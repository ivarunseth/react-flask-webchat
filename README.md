# Real-time webchat application using React and Flask

This project is a real-time chat application built with React, Flask, Celery, Socket.io, and SQLite3. Users can sign up, log in and send and receive real-time messages.

## How to Run the Application

### Local Setup

#### Prerequisites

This project is developed and tested using Python3.9 and Node v18.17.1, please ensure the same are installed.

#### Client

In the project directory, you can run:

    npm start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

    npm test

Launches the test runner in the interactive watch mode.

    npm run build

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### Server

In the project directory, you can run:

    python3.9 -m venv venv

Creates a python virtual environment called venv.

    source venv/bin/activate

Activates the virtual environment.

    python3.9 -m pip install -U pip

Updates python package installer.

    pip install -r requirements.txt

Installs all python packages required to the application.

    python app.py

    or

    flask run

Runs the flask application.

    celery -A api.celery worker -l info -P eventlet -Ofair

Runs the celery worker for asynchronous tasks.

### Using Docker

For using Docker to run the application make sure you have the latest version of Docker installed.

    docker compose build app

Builds the application image using docker.

    docker compose up

Starts the application.