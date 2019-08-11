# Awesome Node boilerplate

A boileplate for REST API focuses on separation of concerns and scalability

## Table of content

---

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

---
## **📂 Separation of concerns & multilayer structure**
- _Router_, _Middleware_, _Controller_ and _Service_.
- _API response_ and _Error handling_.

## **🚀 Rapid development workflow**
- _**[Nodemon](https://www.npmjs.com/package/nodemon)**_
- _**[Winston](https://github.com/winstonjs/winston)**_
- _**[Babel](https://babeljs.io/)**_

## **⚔️ Type checking**
- _**[TypeScript](https://www.typescriptlang.org/docs/tutorial.html)**_

## **🛡 Testing**

- _**[Jest](https://github.com/facebook/jest)**_
- _**[Supertest](https://github.com/visionmedia/supertest)**_

## **🔐 Authentication and authorisation**
- _**[JSON Web Token - JWT](https://github.com/auth0/node-jsonwebtoken)**_
- _**[Passport local strategy](http://www.passportjs.org/packages/passport-local/)**_
- _**[Passport Google Strategy](http://www.passportjs.org/packages/passport-google-oauth/)**_
- _**[Sendgrid](https://sendgrid.com/)**_
- _**Account validation and activation**_
- _**Reset password flow**_
- _**Multi-role authorisation**_

## **📝 API documentation**
- _**[Swagger](https://swagger.io/)**_

![swagger](docs/images/swagger.png 'Swagger documentation')

## **🗄 Database integration**
- _**[MongoDB](https://www.mongodb.com/)**_
- _**[Mongoose](https://mongoosejs.com/)**_
- _**CRUD users**_
- _**Searching, sorting and pagination**_


## **🚓 Security**
- _**[HelmetJS](https://helmetjs.github.io/)**_
- _**[Express Rate Limit](https://github.com/nfriedly/express-rate-limit)**_

## **💎 Rich utilities: Git hooks and code formatting**
- _**[Prettier](https://github.com/prettier/prettier)**_
- _**[Husky](https://github.com/typicode/husky/)**_
- _**[Lint-staged](https://github.com/okonet/lint-staged/)**_
- _**[TSLint](https://github.com/palantir/tslint/)**_

## **🚀 Contious integration**

- _**[TravisCI](https://travis-ci.org/)**_

## **🏆 Test coverage**
![test coverage](docs/images/test_coverage.svg 'Test coverage')
## Prerequisites

---

- [NodeJS](https://nodejs.org/en/).
- [MongoDB](https://www.mongodb.com/).
- IDE of your choice.
- Command Line Tools.

## Getting started

---

Install dependencies

```bash
  npm install
```

Run MongoDB locally

**MacOS**

```bash
  sudo mongod
```

Run development server

```bash
  npm run dev
```

## Project structure

---

The boilerplate is abstracted to different layers based on the notion of concerns separation and clarity.

### **Root server file: [server.ts](src/server.ts)**

- Initialize Express app, environment variables, logging, global middlewares and routing.
- Run Passport configuration
- Connect to MongoDB

### **Global middleware: [global.ts](src/middlewares/global.ts)**

This is where we initalize all global middlewares. Those will be used in _any_ routes.

### **Environment configurations [config](src/config/index.ts)**

Configurations including API keys, environment variables and specific setups for _development_, _production_ or _test_ env. You can find those in other config files in this directory.

### **Routers and resources: [user](src/resources/user/user.router.ts) and [auth](src/resources/auth/auth.router.ts)**

Here is where core of the API is located. Each **resouce** is divided into different layers:

- **Router** (`resource.router.ts`)
  _ Initialise routes.
  _ Add specific **authorisation** and **middlewares** for each route. \* Connect route with equivalent **controller**
- **Interface** (`resource.interface.ts`) \* **Types** that are used by layers of the resource
- **Model** (`resource.model.ts`) \* Define **model** for the resource based on database schema.
- **Controller** (`resource.controller.ts`) \* A bridge between **router** and **service** layer. This controller layer take input from client side queries, send to service layer. Then it gets back either data that the client wants, or error in case of failure, and send back to the client.
- **Service** (`resource.service.ts`) \* The deepest layer of the API where actual database queries and operations are performed. This is also the only layer that does this job.

### **Server reponse (success or error) [apiResponse.ts](src/utils/apiResponse.ts)**

## Testing

---

Configuration for Jest could be found in [`jest.config.js`](jest.config.js).

### Running test

Running all test suites with coverage:

```bash
  npm run test
```

Running and watching for changes in one particular test file:

```bash
  npm run test:watch src/tests/api/auth/api.test.ts
```

## Deployment

---

### **Deploy with Heroku**

- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
- Create a new app on [Heroku Dashboard](https://devcenter.heroku.com/articles/heroku-dashboard).
- Login to your Heroku account in command line tool:

```bash
  heroku login
```

- Create a Heroku remote from your app's name:

```bash
  heroku git:remote -a your-app-name
```

- Rename production branch if you want to:

```bash
  git remote rename heroku production
```

- Deploying:

```bash
  git push production master
```
