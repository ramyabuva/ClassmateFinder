'''
	Main app for vislang.ai
'''
import random, io, time
import requests as http_requests
import xml.etree.ElementTree as ET 

from collections import defaultdict

from flask import Flask, request, redirect, flash, url_for
from flask import render_template


from pagination import Pagination
import mysql.connector

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.

app = Flask(__name__)



cnx = mysql.connector.connect(host='usersrv01.cs.virginia.edu', user='rsb4zm', password='Spr1ng2021!!',
                              database='rsb4zm_classmatefinder', auth_plugin='mysql_native_password')
mycursor = cnx.cursor()

# mycursor.execute("SELECT * FROM account")

# myresult = mycursor.fetchall()

# for x in myresult:
#   print(x)

@app.route('/', methods=['GET'])
def main():
	return render_template('index.html')

####################################################

# *****************************
# Load model stuff here
# *****************************

####################################################
import os, sys, logging, traceback, codecs, datetime, copy, time, ast, math, re, random, shutil, json


@app.route('/classmatefinder', methods = ["GET", "POST"])
def classmatefinder():
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('classmatefinder.html')

	return {}

@app.route('/friends', methods = ["GET", "POST"])
def friends():
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('friends.html')

	return {}

@app.route('/clubs', methods = ["GET", "POST"])
def clubs():
	# If the request is GET then only render template.
	if request.method == "GET":
		return render_template('clubs.html')

	return {}

if __name__=='__main__':
	app.run(host='0.0.0.0', debug=True, use_reloader=False)
