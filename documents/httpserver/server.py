#!/usr/bin/env python

# python's web server does the trick for debugging:

import BaseHTTPServer
import SimpleHTTPServer

def run(server_class=BaseHTTPServer.HTTPServer, handler_class=BaseHTTPServer.BaseHTTPRequestHandler):
	server_address = ('', 8000)
	httpd = server_class(server_address, handler_class)
	httpd.serve_forever()
	
if __name__ == "__main__":
	run(handler_class=SimpleHTTPServer.SimpleHTTPRequestHandler)