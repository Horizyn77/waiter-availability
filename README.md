# Waiter Availability App ☕

![Screenshot from 2023-10-16 14-40-17](https://github.com/Horizyn77/waiter-availability/assets/116552523/c3825b16-821c-4bb7-9df4-0b6bd1100cd2)

Link to app 🔗:  

https://waiter-availability-1kqb.onrender.com

Please note the app is using a free hosting account on render which has limitations. To speed up the loading process open the site and reload it again.

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)

## Overview 📝<a name="overview"></a>

The Waiter Availability app is a useful app that allows waiters at a coffee shop to select days when they are able to work during the week, and give restaurant managers the ability to see how many waiters and which waiters are available to work during the week.

## Features 🌟<a name="features"></a>

### Shift scheduling
Waiters can log in and set or update their shifts for the week. The data is persisted and stored in a database, so when they logout and login again the previous shift set is still set.

### Accounts


Waiters are able to create accounts. Waiters and restaurant managers can log into the system and access their respective pages. Waiters are only allowed to access their specific page for their account while logged in and everyone else is restricted. Only managers have access to the admin page. When signing up, waiters passwords are encrypted and stored safely.

*NB: There are demo login details for waiters and admins on the homepage for those interested in testing the app. You can also sign up for an account as a waiter.*

### Statistics

Managers can see nice statistics and breakdown of waiters available by a particular day or see all the days a particular waiter will be available. There is also a nice colour coded bar chart reflecting when there are enough/not enough/more than enough waiters available for a particular day

### Form Validation

There are useful error messages when logging in and signing up that notify the user

## Technologies Used 💻<a name="technologies-used"></a>

#### Node.js/Express
Used for setting up a server and handling routes and logic  
#### Handlebars  
Used for HTML templating
#### PostgreSQL
Used for providing database and crud functionality
#### Chart.js
Used for creating a beautiful, dynamic and color coded chart for displaying data related to how many waiters are available for work
#### Bcrypt
Used to hash and encrypt passwords
#### JWT
Used to protect certain routes that can only be accessed when the authorized user is logged in

[![Node.js CI with PostgreSQL](https://github.com/Horizyn77/waiter-availability/actions/workflows/node-psql.js.yml/badge.svg)](https://github.com/Horizyn77/waiter-availability/actions/workflows/node-psql.js.yml)
