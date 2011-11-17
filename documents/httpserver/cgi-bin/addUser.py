#!C:\Tools\Python26\pythonw.exe -u
#!/usr/bin/env python

import cgitb
import cgi

"""
see: http://www.cs.virginia.edu/~lab2q/lesson_7/
"""

#cgitb.enable()
cgitb.enable(display=1, logdir=".")


form = cgi.FieldStorage()
errors = []
if "name" not in form:
	#print "<H1>Error</H1>"
	errors.append("Please fill in the name field.")
	#print "Please fill in the name field."

if "password" not in form:
	#print "<H1>Error</H1>"
	errors.append("Please fill in the password field.")

if len(errors) > 0:
	#we have errors so we will display them
	print "Content-type: text/html"
	print
	print "<HTML>"
	print "<BODY>"
	for error in errors:
		print '<div>' + error + '</div>'
	print "</BODY>"
	print "</HTML>"
else:
	#no errors...all good
	#print 'Name: ' +form['name'].value + ' password: ' + form['password'].value
	f = open('users.data', 'a')
	f.write("\n" + form['name'].value + "\t" + form['password'].value)
	f.close()	
	print "Status: 301 Moved",
	print "Location: http://localhost:8000/cgi-bin/users.py"
	

