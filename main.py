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

import hashlib

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.

app = Flask(__name__)
app.secret_key = 'randomstring'


@app.route('/', methods=['GET'])
def main():
	if 'user' in session:
		return redirect('/profile')
	return render_template('login.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
	if 'user' in session:
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm', password='Spr1ng2021!!',
                              database='rsb4zm_classmatefinder', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		query = "SELECT * FROM User WHERE comp_id = '{cid}'".format(cid = session['user'])
		mycursor.execute(query)
		myresult = mycursor.fetchall()
		cnx.close()
		if len(myresult) > 0:
			return render_template('profile.html', comp_id = session['user'], 
				fname = myresult[0][1], lname = myresult[0][2], gradyear = myresult[0][3], major = myresult[0][4])
	return redirect('/')

@app.route('/update', methods=['GET', 'POST'])
def update():
	print(request.form)
	if 'user' in session:
		query = "UPDATE `User` SET `first_name` = '{fname}', `last_name` = '{lname}', `graduation_year` = '{gradyear}', `major` = '{major}' WHERE `User`.`comp_id` = '{cid}'".format(
			cid = session['user'],
			fname = request.form['firstname'],
			gradyear = request.form['gradyear'],
			lname = request.form['lastname'],
			major = request.form['major']
			)
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm', password='Spr1ng2021!!',
	                              database='rsb4zm_classmatefinder', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		mycursor.execute(query)
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
		cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm', password='Spr1ng2021!!',
                              database='rsb4zm_classmatefinder', auth_plugin='mysql_native_password')
		mycursor = cnx.cursor()
		query = "SELECT * FROM User WHERE comp_id = '{cid}'".format(cid = request.form['cid-login'].lower())
		mycursor.execute(query)
		myresult = mycursor.fetchall()
		cnx.close()
		if len(myresult) > 0 and myresult[0][5] == encode_password(request.form['password']):
			session['user'] = request.form['cid-login'].lower()
			return redirect('/profile')
	return redirect('/') # TODO: figure out message for incorrect username/password


@app.route('/register', methods=['POST'])
def register():
	session['user'] = request.form['cid'].lower()
	vals = "('{cid}', '{fname}',{gradyear},'{lname}','{major}', %(pwd)s)".format(
		cid = request.form['cid'].lower(),
		fname = request.form['firstname'],
		gradyear = request.form['grad-year'],
		lname = request.form['lastname'],
		major = request.form['major'],
		)
	cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm', password='Spr1ng2021!!',
                              database='rsb4zm_classmatefinder', auth_plugin='mysql_native_password')
	query = "SELECT * FROM User WHERE comp_id = '{cid}'".format(cid = request.form['cid-login'].lower())
	mycursor = cnx.cursor()
	mycursor.execute(query)
	myresult = mycursor.fetchall()
	if len(myresult) > 0:
		return redirect('/')
	query = "INSERT INTO `User` (`comp_id`, `first_name`, `graduation_year`, `last_name`, `major`, `password`) VALUES " + vals
	mycursor.execute(query, { 'pwd': encode_password(request.form['password']) })
	cnx.commit()
	cnx.close()
	return redirect('/profile')

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
