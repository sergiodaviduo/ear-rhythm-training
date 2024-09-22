# ear-rhythm-training


Proof-of-concept Web app that tests your musical ear by playing short, rhythmic sequences of sound, and has the user validate them by tapping the spacebar at the exact rhythm. A simon says type of rhythm game.

Requires at least Django 4.2.0, and a compatible python install under python3. Tested on Node 19, Django 4.2.0 and 5.0.6.

## Launch instructions:

Install with "npm install". Start web server with "npm start"

To edit JS live, run "npm run js" to make live changes to JS app, and to package JS changes made in /src

## To put in a Docker container:

> docker build . -t ear-rhythm-training

> docker run --rm -it -p 8000:8000/tcp ear-rhythm-training:latest
