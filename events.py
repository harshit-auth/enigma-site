from http.server import BaseHTTPRequestHandler
import json

EVENTS = [
    {"title": "Intro to Web Dev Workshop", "date": "Oct 12"},
    {"title": "Hack Night", "date": "Oct 26"},
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(EVENTS).encode())