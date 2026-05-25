import argparse
import json
import sqlite3
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "data" / "edits" / "graph_edits.sqlite"


SCHEMA = """
create table if not exists sessions (
  id text primary key,
  snapshot text not null,
  expert_name text,
  notes text,
  created_at text not null,
  updated_at text not null
);

create table if not exists events (
  id integer primary key autoincrement,
  session_id text not null references sessions(id) on delete cascade,
  label text not null,
  payload_json text not null,
  created_at text not null
);

create table if not exists snapshots (
  id integer primary key autoincrement,
  session_id text not null references sessions(id) on delete cascade,
  history_index integer not null,
  patch_json text not null,
  created_at text not null
);
"""


def utc_now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def connect(db_path):
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("pragma foreign_keys = on")
    conn.executescript(SCHEMA)
    conn.commit()
    return conn


class EditHandler(BaseHTTPRequestHandler):
    db_path = DEFAULT_DB

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-headers", "content-type")
        self.send_header("access-control-allow-methods", "GET,POST,OPTIONS")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("content-length") or 0)
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_OPTIONS(self):
        self.send_json(200, {"ok": True})

    def do_GET(self):
        path = urlparse(self.path).path.strip("/").split("/")
        try:
            if path == ["health"]:
                self.send_json(200, {"ok": True, "db": str(self.db_path)})
                return
            if path == ["sessions"]:
                with connect(self.db_path) as conn:
                    rows = conn.execute(
                        "select id, snapshot, expert_name, notes, created_at, updated_at from sessions order by updated_at desc"
                    ).fetchall()
                self.send_json(200, {"sessions": [dict(row) for row in rows]})
                return
            if len(path) == 2 and path[0] == "sessions":
                session_id = path[1]
                with connect(self.db_path) as conn:
                    session = conn.execute(
                        "select id, snapshot, expert_name, notes, created_at, updated_at from sessions where id = ?",
                        (session_id,),
                    ).fetchone()
                    if not session:
                        self.send_json(404, {"error": "session_not_found"})
                        return
                    events = conn.execute(
                        "select id, label, payload_json, created_at from events where session_id = ? order by id",
                        (session_id,),
                    ).fetchall()
                    snapshots = conn.execute(
                        "select id, history_index, patch_json, created_at from snapshots where session_id = ? order by id",
                        (session_id,),
                    ).fetchall()
                self.send_json(
                    200,
                    {
                        "session": dict(session),
                        "events": [
                            {**dict(row), "payload": json.loads(row["payload_json"])}
                            for row in events
                        ],
                        "snapshots": [
                            {**dict(row), "patch": json.loads(row["patch_json"])}
                            for row in snapshots
                        ],
                    },
                )
                return
            self.send_json(404, {"error": "not_found"})
        except Exception as exc:
            self.send_json(500, {"error": str(exc)})

    def do_POST(self):
        path = urlparse(self.path).path.strip("/").split("/")
        try:
            payload = self.read_json()
            now = utc_now()
            if path == ["sessions"]:
                session_id = payload.get("id") or str(uuid.uuid4())
                with connect(self.db_path) as conn:
                    conn.execute(
                        """
                        insert into sessions (id, snapshot, expert_name, notes, created_at, updated_at)
                        values (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            session_id,
                            payload.get("snapshot") or "unknown",
                            payload.get("expert_name"),
                            payload.get("notes"),
                            now,
                            now,
                        ),
                    )
                    conn.commit()
                self.send_json(201, {"id": session_id})
                return
            if len(path) == 3 and path[0] == "sessions" and path[2] == "events":
                session_id = path[1]
                with connect(self.db_path) as conn:
                    conn.execute(
                        "insert into events (session_id, label, payload_json, created_at) values (?, ?, ?, ?)",
                        (
                            session_id,
                            payload.get("label") or "Edit event",
                            json.dumps(payload.get("payload") or payload, ensure_ascii=False),
                            now,
                        ),
                    )
                    conn.execute("update sessions set updated_at = ? where id = ?", (now, session_id))
                    conn.commit()
                self.send_json(201, {"ok": True})
                return
            if len(path) == 3 and path[0] == "sessions" and path[2] == "snapshots":
                session_id = path[1]
                with connect(self.db_path) as conn:
                    conn.execute(
                        "insert into snapshots (session_id, history_index, patch_json, created_at) values (?, ?, ?, ?)",
                        (
                            session_id,
                            int(payload.get("history_index") or 0),
                            json.dumps(payload.get("patch") or payload, ensure_ascii=False),
                            now,
                        ),
                    )
                    conn.execute("update sessions set updated_at = ? where id = ?", (now, session_id))
                    conn.commit()
                self.send_json(201, {"ok": True})
                return
            self.send_json(404, {"error": "not_found"})
        except Exception as exc:
            self.send_json(500, {"error": str(exc)})


def main():
    parser = argparse.ArgumentParser(description="Lightweight graph edit backend prototype")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8790)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    args = parser.parse_args()

    EditHandler.db_path = args.db
    connect(args.db).close()
    server = ThreadingHTTPServer((args.host, args.port), EditHandler)
    print(f"edit backend listening on http://{args.host}:{args.port}")
    print(f"sqlite db: {args.db}")
    server.serve_forever()


if __name__ == "__main__":
    main()
