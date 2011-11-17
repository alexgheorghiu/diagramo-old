#!C:\Tools\Python26\pythonw.exe -u
#!/usr/bin/env python

import cgitb
import cgi

"""
see: http://www.cs.virginia.edu/~lab2q/lesson_7/
"""


#cgitb.enable()
cgitb.enable(display=1, logdir=".")



print "Content-type: text/html"
print
print 
"""<HTML>
<HEAD>
	<TITLE>CGI Environment</TITLE>
</HEAD>
<BODY>"""
cgi.print_environ()
print "</BODY></HTML>"