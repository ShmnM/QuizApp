# Quiz App

A full-stack trivia web app built using Node.js, Express, and MongoDB.

Demo Video: https://www.youtube.com/watch?v=xiFvBCCKqXg
<video src="https://github.com/user-attachments/assets/453c0bd1-ed3b-4c8a-80ad-e3cea30e3a6a" controls></video>

## Features
- User Registration and login with secure password hashing (scrypt)
- Pick how many questions you want and how long you get per question
- Results page showing a summary of attempt
- Leaderboard tracking top scores for all users
- Personal profile page with quiz history
- Toggleable dark mode
- Questions come from the Open Trivia Database API

## Built With
- Node.js, Express
- MongoDB Atlas
- Bootstrap 5
- Open Trivia DB API

## Setup

### Requirements
- Node.js installed
- MongoDB Atlas account

### Installation
1. Download the repository
2. Run `npm install`
3. Create a `.env` file with the following:

ATLAS_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

4. Run `npm start`
5. Open `http://localhost:3000` in your browser 

## Notes
- Passwords are hashed using scrypt with a unique salt per user
- Sessions are managed server side using express-session
- Protected pages require authentication
