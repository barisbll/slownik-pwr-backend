## Slownik PWR

Slownik PWR is a social media project for the universities.

## Setup

In order to run the project

1- Use git clone to clone the project
2- In order to not push your api secret, run git update-index --assume-unchanged ./secret.js (This will avoid git to track your secret.js file)
3- Change the username and password of the mongodb key in the secret.js file (Now even after the change git doesn't track changes)
4- Execute npm start
