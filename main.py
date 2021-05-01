'''
	Main app for vislang.ai
'''
import random, io, time
import requests as http_requests
import xml.etree.ElementTree as ET 

from collections import defaultdict

from flask import Flask, request, redirect, flash, url_for, session
from flask import render_template


from pagination import Pagination
import mysql.connector
import numpy as np

import hashlib
import re

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.

app = Flask(__name__)
app.secret_key = 'randomstring'


db_users = {
	"rsb4zm_a": 'Spr1ng2021!!',
	"rsb4zm_b": 'Spr1ng2021!!',
	"rsb4zm_c": 'Spr1ng2021!!',
}


@app.route('/', methods=['GET'])
def main():
	if 'user' in session:
		return redirect('/profile')
	return render_template('login.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
	if 'user' in session:
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("SELECT * FROM User WHERE comp_id = %(cid)s", {'cid': session['user']})
		myresult = mycursor.fetchall()
		cnx.close()
		if len(myresult) > 0:
			return render_template('profile.html', comp_id = session['user'], 
				fname = myresult[0][1], lname = myresult[0][2], gradyear = myresult[0][3], major = myresult[0][4])
	return redirect('/')

@app.route('/user', methods=['GET'])
def user():
	# TODO: get user information, mutual classes, and mutual clubs
	if 'user' in session:
		cid = request.args.get('cid')
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("SELECT comp_id, first_name, last_name, graduation_year, major FROM User WHERE comp_id = %(cid)s", {"cid": cid})
		myresult = mycursor.fetchall()
		cnx.close()
		if len(myresult) > 0:
			return render_template('user.html', comp_id = myresult[0][0], 
				fname = myresult[0][1], lname = myresult[0][2], gradyear = myresult[0][3], major = myresult[0][4])
	return redirect('/')

@app.route('/search-users', methods=['POST'])
def searchusers():
	if 'user' in session:
		cid = request.form['cid'] + "%"
		fname = request.form['firstname'] + "%"
		lname = request.form['lastname'] + "%"
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("SELECT comp_id, first_name, last_name, graduation_year, major FROM User WHERE first_name LIKE %(fname)s AND last_name LIKE %(lname)s AND comp_id LIKE %(cidsearch)s AND comp_id != %(cid)s AND comp_id NOT IN (SELECT comp_id_friend FROM Friends_With WHERE comp_id_user = %(cid)s) LIMIT 5", 
			{
				 "cid": session['user'],
				 "cidsearch": cid, 
				 "fname": fname, 
				 "lname": lname
			 })
		myresult = mycursor.fetchall()
		cnx.close()

		toRet = {}
		for user in myresult:
			toRet[user[0]] = {'name': str(user[1]) + " "+ str(user[2]),
									'graduation_year':user[3],
									'major':user[4]
									 };
		return toRet
	return {}


# def friends_in_club():
# 	cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
# 	                              database='rsb4zm', auth_plugin='mysql_native_password')
# 	mycursor = cnx.cursor()
# 	mycursor.execute("SELECT t1.club_name, t2.comp_id FROM Member_Of as t1 CROSS JOIN Member_Of as t2 WHERE t1.club_name = t2.club_name AND t1.comp_id = %(cid)s AND t2.comp_id IN (SELECT t1.comp_id_friend as comp_id FROM Friends_With as t1 CROSS JOIN Friends_With as t2 WHERE t1.comp_id_user = t2.comp_id_friend AND t1.comp_id_friend = t2.comp_id_user AND t1.comp_id_user = %(cid)s);", {"cid": session['user']})
# 	myresult = mycursor.fetchall()
# 	cnx.close()
# 	toRet = {}
# 	for x in myresult:
# 		if toRet.get(x[0], False):
# 			toRet[x[0]].append(x[1])
# 		else:
# 			toRet[x[0]] = [x[1]]
# 	return toRet

@app.route('/remove-club', methods=['POST'])
def removeclub():
	if 'user' in session:
		club = request.form['club']
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("DELETE FROM Member_Of WHERE comp_id = %(cid)s AND club_name = %(club)s", {"cid": session['user'], "club": club})
		cnx.commit()
		cnx.close()
		return {}
	return {}

@app.route('/add-club', methods=['POST'])
def addclub():
	if 'user' in session:
		club = request.form['club']
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("INSERT IGNORE INTO `Member_Of` (`comp_id`, `club_name`) VALUES (%(cid)s, %(club)s);", {"cid": session['user'], "club": club})
		cnx.commit()
		cnx.close()
		return {}
	return {}

@app.route('/my-clubs', methods=['GET', 'POST'])
def myclubs():
	if 'user' in session:
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("SELECT DISTINCT club_name FROM Member_Of WHERE comp_id=%(cid)s;", {"cid": session['user']})
		myclubs = mycursor.fetchall()

		mycursor.execute("SELECT t1.club_name, t2.comp_id FROM Member_Of as t1 CROSS JOIN Member_Of as t2 WHERE t1.club_name = t2.club_name AND t1.comp_id = %(cid)s AND t2.comp_id IN (SELECT t1.comp_id_friend as comp_id FROM Friends_With as t1 CROSS JOIN Friends_With as t2 WHERE t1.comp_id_user = t2.comp_id_friend AND t1.comp_id_friend = t2.comp_id_user AND t1.comp_id_user = %(cid)s);", {"cid": session['user']})
		myresult = mycursor.fetchall()
		cnx.close()
		toRet = {}
		for x in myresult:
			if toRet.get(x[0], False):
				toRet[x[0]].append(x[1])
			else:
				toRet[x[0]] = [x[1]]

		for x in myclubs:
			if x[0] not in toRet:
				toRet[x[0]] = []
		return toRet
	return {}

@app.route('/friend-list', methods=['GET', 'POST'])
def friendlist():
	if request.method == "GET":
		if 'user' in session:
			cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
			mycursor = cnx.cursor()
			mycursor.execute("SELECT comp_id, first_name, last_name, graduation_year, major FROM (SELECT t1.comp_id_friend as comp_id FROM Friends_With as t1 CROSS JOIN Friends_With as t2 WHERE t1.comp_id_user = t2.comp_id_friend AND t1.comp_id_friend = t2.comp_id_user AND t1.comp_id_user = %(cid)s) as t1 NATURAL JOIN User", {"cid": session['user']})
			friends = mycursor.fetchall()
			cnx.close()
			toRet = {}

			for friend in friends:
				toRet[friend[0]] = {'name': str(friend[1]) + " "+ str(friend[2]),
									'graduation_year':friend[3],
									'major':friend[4]
									 };
			return toRet

@app.route('/friend-requests', methods=['GET', 'POST'])
def friendrequests():
	if request.method == "GET":
		if 'user' in session:
			cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
			mycursor = cnx.cursor()
			mycursor.execute("SELECT comp_id, first_name, last_name FROM (SELECT DISTINCT comp_id_user as comp_id FROM Friends_With WHERE comp_id_friend = %(cid)s AND comp_id_user NOT IN (SELECT DISTINCT comp_id_friend FROM Friends_With WHERE comp_id_user = %(cid)s) ) as t1 NATURAL JOIN User", {"cid": session['user']})
			friends = mycursor.fetchall()
			cnx.close()
			toRet = {}

			for friend in friends:
				toRet[friend[0]] = {'name': str(friend[1]) + " "+ str(friend[2]) };
			return toRet

@app.route('/requested-friends', methods=['GET'])
def requested():
	if request.method == "GET":
		if 'user' in session:
			cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
			mycursor = cnx.cursor()
			mycursor.execute("SELECT comp_id, first_name, last_name FROM (SELECT DISTINCT comp_id_friend as comp_id FROM Friends_With WHERE comp_id_user = %(cid)s AND comp_id_friend NOT IN (SELECT DISTINCT comp_id_user FROM Friends_With WHERE comp_id_friend = %(cid)s) ) as t1 NATURAL JOIN User", {"cid": session['user']})
			friends = mycursor.fetchall()
			cnx.close()
			toRet = {}

			for friend in friends:
				toRet[friend[0]] = {'name': str(friend[1]) + " "+ str(friend[2]) };
			return toRet

@app.route('/add-friend', methods=[ 'POST'])
def addFriend(): #TODO: implement removal from Friends_With table
	if request.method == "POST":
		if 'user' in session:
			cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
			mycursor = cnx.cursor()
			mycursor.execute("INSERT IGNORE INTO `Friends_With` (`comp_id_user`, `comp_id_friend`) VALUES (%(cid)s, %(friendid)s);", {"cid": session['user'], "friendid" : request.form["friend"]})
			cnx.commit()
			cnx.close()
			return {}
	return {}


@app.route('/remove-friend', methods=[ 'POST'])
def removeFriend(): #TODO: implement removal from Friends_With table
	if request.method == "POST":
		if 'user' in session:
			cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
			mycursor = cnx.cursor()
			mycursor.execute("DELETE FROM Friends_With WHERE comp_id_user = %(friendid)s AND comp_id_friend = %(cid)s", {"cid": session['user'], "friendid" : request.form["friend"]})
			mycursor.execute("DELETE FROM Friends_With WHERE comp_id_user = %(cid)s AND comp_id_friend = %(friendid)s", {"cid": session['user'], "friendid" : request.form["friend"]})
			cnx.commit()
			cnx.close()
			return {}
	return {}


@app.route('/update', methods=['GET', 'POST'])
def update():
	print(request.form)
	if 'user' in session:
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_c', password=db_users['rsb4zm_c'],
	                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("UPDATE `User` SET `first_name` = %(fname)s, `last_name` = %(lname)s, `graduation_year` = %(gradyear)s, `major` = %(major)s WHERE `User`.`comp_id` = %(cid)s",
			{
			'cid' : session['user'],
			'fname' : request.form['firstname'],
			'gradyear' : int(request.form['gradyear']),
			'lname' : request.form['lastname'],
			'major' : request.form['major']
			})
		cnx.commit()
		cnx.close()
	return redirect('/profile')

@app.route('/logout', methods=['GET', 'POST'])
def logout():
	if 'user' in session:
		session.pop('user', None)
	return redirect('/')

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == "POST":
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_b', password=db_users['rsb4zm_b'],
                              database='rsb4zm', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute("SELECT * FROM User WHERE comp_id = %(cid)s", {'cid': request.form['cid-login'].lower()})
		myresult = mycursor.fetchall()
		cnx.close()
		if len(myresult) > 0 and myresult[0][5] == encode_password(request.form['password']):
			session['user'] = request.form['cid-login'].lower()
			return redirect('/profile')
	return redirect('/') # TODO: figure out message for incorrect username/password


@app.route('/register', methods=['POST'])
def register():
	cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm_b', password=db_users['rsb4zm_b'],
                              database='rsb4zm', auth_plugin='mysql_native_password')
	mycursor = cnx.cursor()
	mycursor.execute("SELECT * FROM User WHERE comp_id = %(cid)s", {"cid": request.form['cid'].lower()})
	myresult = mycursor.fetchall()
	if len(myresult) > 0:
		return redirect('/')
	if re.match("^[a-zA-Z0-9_]*$", request.form['cid']):
		session['user'] = request.form['cid'].lower()
		mycursor.execute("INSERT INTO `User` (`comp_id`, `first_name`, `graduation_year`, `last_name`, `major`, `password`) VALUES (%(cid)s, %(fname)s,%(gradyear)s,%(lname)s,%(major)s, %(pwd)s)",
		 {  'pwd': encode_password(request.form['password']) ,
		 	'cid' : request.form['cid'].lower(),
			'fname' :request.form['firstname'],
			'gradyear': int(request.form['grad-year']),
			'lname' : request.form['lastname'],
			'major': request.form['major'],
		 })
		cnx.commit()
		cnx.close()
		return redirect('/profile')
	return redirect('/')

def encode_password(pwd):
	return hashlib.pbkdf2_hmac('sha256', pwd.encode('utf-8'), bytes([32]), 100000)

@app.route('/classmatefinder', methods = ["GET", "POST"])
def classmatefinder(): 
	if 'user' not in session:
		return redirect('/')
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('classmatefinder.html')

	return {}

@app.route('/friends', methods = ["GET", "POST"])
def friends():
	if 'user' not in session:
		return redirect('/')
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('friends.html')

	return {}

@app.route('/clubs', methods = ["GET", "POST"])
def clubs():
	if 'user' not in session:
		return redirect('/')
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('clubs.html')

	return {}

if __name__=='__main__':
	app.run(host='0.0.0.0', debug=True, use_reloader=False)
