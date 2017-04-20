<h1> Cassiopeia API </h1>

<h2> Authors</h2>
<ul>
<li> Kyle Guthrie </li>
<li> Susan Kuretski </li>
<li> Michael Cash Stramel </li>
</ul>

<h2>Description</h2>
<p> This Node.js & Express backed API is written to support CS467 capstone project which focuses on project management
organization. 
</p>
<p>Endpoints are like so: 
<ul>
  <li>/employees/:id</li>
  <li>/disciplines/:id</li>
</ul>
</p>
<h2>File Organization</h2>
<p>
-- [ auth ]<br>
-- [ config ]<br>
&nbsp&nbsp&nbsp&nbsp-- .config.json<br>
&nbsp&nbsp&nbsp&nbsp-- index.js<br>
-- [ db ]<br>
&nbsp&nbsp&nbsp&nbsp-- [ tables ]<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- assignments.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- deliverables.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- disciplines.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- employees.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- funding.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- projects.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- tasks.js<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- index.js<br>
-- [ services ]<br>
&nbsp&nbsp&nbsp&nbsp-- router.js<br>
-- [ views ]<br>
&nbsp&nbsp&nbsp&nbsp-- [ layouts ]<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-- main.handlebars<br>
&nbsp&nbsp&nbsp&nbsp-- index.handlebars<br>
-- .gitignore<br>
-- package.json<br>
-- server.js<br>
</p>
<h2>License</h2>
ISC
<h2>Dependencies</h2>
<ul>
<li>body-parser</li>
<li>express</li>
<li>express-handlebars</li>
<li>fs</li>
<li>morgan</li>
<li>mysql</li>
<li>path</li>
</ul>
