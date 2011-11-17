#!C:\Tools\Python26\pythonw.exe -u
#!/usr/bin/env python

import cgitb, sys
import cgi

cgitb.enable(display=1, logdir=".")

print "Content-type: text/html"
print

form = cgi.FieldStorage()
if "name" not in form:
    print "<H1>Error</H1>"
    print "Please fill in the name and addr fields."
    sys.exit()
    
print "<p>name:", form["name"].value
#print "<p>addr:", form["addr"].value
