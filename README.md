# Cassiopeia API 

## Authors
<ul>
<li> Kyle Guthrie </li>
<li> Susan Kuretski </li>
<li> Michael Cash Stramel </li>
</ul>

## Description
This Node.js & Express backed API is written to support CS467 capstone project which focuses on project management
organization. 

Endpoints are like so: 
<ul>
  <li>/employees/:id</li>
  <li>/disciplines/:id</li>
  <li>/projects/:id</li>
  <li>/tasks/:id</li>
  <li>/sow/:id  (statement of work)</li>
  <li>/funding/:id</li>
  <li>/deliverables/:id</li>
</ul>

## File Organization

- [ auth ]
- [ config ]
  - .config.json
  - index.js
- [ db ]
  - [ tables ]
    - assignments.js
    - deliverables.js
    - disciplines.js
    - employees.js
    - funding.js
    - projects.js
    - tasks.js
  - index.js
- [ services ]
  - router.js
- [ views ]
  - [ layouts ]
    - main.handlebars
  - index.handlebars
- .gitignore
- package.json
- server.js

## License
ISC

## Dependencies
<ul>
<li>body-parser</li>
<li>express</li>
<li>express-handlebars</li>
<li>fs</li>
<li>morgan</li>
<li>mysql</li>
<li>path</li>
</ul>

## Development Dependencies
- chai
- chai-http
- mocha (installed globally)

## How To Run

- How To Install
  - npm install

- How To Start Server
  - npm start
  - Recommended libraries:
    - nodemon for development
    - forever for production 
  
- How To Test
  - npm test (Will cover all unit tests)