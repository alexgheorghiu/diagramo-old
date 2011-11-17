#!/usr/bin/env python
#!C:\Tools\Python26\pythonw.exe -u


import BaseHTTPServer
import CGIHTTPServer
import cgitb; cgitb.enable()  ## This line enables CGI error reporting

server = BaseHTTPServer.HTTPServer
server_address = ("192.168.56.1", 8000)

handler = CGIHTTPServer.CGIHTTPRequestHandler
#handler.cgi_directories = [""]

httpd = server(server_address, handler)
httpd.serve_forever()
