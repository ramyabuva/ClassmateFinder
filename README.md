# Databases: Classmate Finder
Source code repository for our CS 4750 Final Project.

## Overview
This webpage is implemented using Flask, and is configured in the app.yaml file to run using Google App Engine.

main.py: The app includes the code for text parsing, and for predicting the location of the image. It also includes subroutines to calculate the scores described in the research paper. 

## Requirements
- Setup a conda environment and install some prerequisite packages like this
```bash
conda create -n dbproj python=3.7    # Create a virtual environment
source activate dbproj         	    # Activate virtual environment
pip install flask
pip install requests
```

## Running the website
In order to test the website only the following commands need to be run.
```bash
source activate dbproj
export FLASK_ENV=development
export FLASK_APP=main.py
flask run
```
The server is now run on port 5000, not 8080

## Deploying the website on Google App Engine.
Create a Google App Engine account on Google Cloud and start a a project. You can see how to setup and configure a basic Flask app on Google App Engine here https://codelabs.developers.google.com/codelabs/cloud-app-engine-python3/#0

Once everything is installed you should be able to just deploy using the following command:

```bash
gcloud app deploy
```
