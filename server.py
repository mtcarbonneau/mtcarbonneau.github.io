"""Simple HTTP server with CORS support for local development."""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
from typing import Tuple

class CORSRequestHandler(SimpleHTTPRequestHandler):
    """Request handler that adds CORS headers to all responses."""

    def end_headers(self) -> None:
        """Add CORS headers before ending response headers."""
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_options(self) -> None:
        """Handle OPTIONS requests for CORS preflight."""
        self.send_response(200)
        self.end_headers()

def get_server_config() -> Tuple[str, int]:
    """Get server configuration parameters."""
    host = ''  # Empty string means all available interfaces
    port = 8000
    return host, port

def main() -> None:
    """Start the HTTP server."""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    host, port = get_server_config()
    server_address = (host, port)
    http_server = HTTPServer(server_address, CORSRequestHandler)
    print(f'Server running at http://localhost:{port}')
    http_server.serve_forever()

if __name__ == '__main__':
    main()
