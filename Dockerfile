FROM postgres:12.5
FROM python:3.7-buster


RUN \
      apt-get update && apt-get install -y --no-install-recommends \
              postgis \
      && rm -rf /var/lib/apt/lists/*
# Python 3.7 install and update 
# install geoparsepy requirements
# install postgris


# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN python3 -m pip install -r requirements.txt
EXPOSE 5000
COPY . /app

ENV FLASK_APP main.py
ENV FLASK_ENV development
CMD ["flask", "run", "--host", "0.0.0.0"]