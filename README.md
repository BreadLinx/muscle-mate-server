# Node.js Express Server with TypeScript
This is a simple Node.js server built with the Express framework and written in TypeScript with auth system.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
Node.js
npm (Node Package Manager)

## Installing
### 1. Clone the repository to your local machine
git clone https://github.com/BreadLinx/JS-Prodigy-Server.git
### 2. Navigate to the project directory
### 3. Install the required dependencies
npm install
### 4. Create .env file in the root of the project with such a fields:
#### DATABASE_USERNAME=string
#### DATABASE_PASSWORD=string
#### SERVER_PORT=number
#### AUTH_TOKEN_KEY=string
#### REFRESH_TOKEN_KEY=string
### 5. Start the server
#### npm run dev - for developer mode
#### npm run build - to build project in dist directory
### 6. The server should now be running on http://localhost:<Port that you had written in .env file>.

## Built With
Node.js - JavaScript runtime built on Chrome's V8 JavaScript engine
Express - Fast, unopinionated, minimalist web framework for Node.js
TypeScript - Strongly typed superset of JavaScript

## Contributing
If you would like to contribute to this project, please create a pull request.
