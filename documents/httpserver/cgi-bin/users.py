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
print "<HTML>"
print "<BODY>"

f = open('users.data', 'r')
lines = f.readlines()
f.close()
for line in lines:
	print '<div>' + line + '</div>'
print '<a href="../addUser.html">Add user</a>'
print "</BODY>"
print "</HTML>"