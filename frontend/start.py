#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple HTTP Server for E-Tendering Frontend
"""

import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 8080

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

def open_browser():
    """Open browser after a delay"""
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')

def main():
    # Change to the directory of this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Fix encoding issues on Windows
    import sys
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("=" * 60)
    print(">> E-Tendering Frontend Server")
    print("=" * 60)
    print(f"\n>> Server starting on port {PORT}...\n")
    
    Handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f">> Server is running!")
        print(f"\n>> Access the application at:")
        print(f"   http://localhost:{PORT}")
        print(f"   http://127.0.0.1:{PORT}")
        print(f"\n>> Press Ctrl+C to stop the server\n")
        print("=" * 60)
        
        # Open browser in a separate thread
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n" + "=" * 60)
            print(">> Server stopped by user")
            print("=" * 60)
            print("\n>> Thank you for using E-Tendering System!\n")

if __name__ == "__main__":
    main()
