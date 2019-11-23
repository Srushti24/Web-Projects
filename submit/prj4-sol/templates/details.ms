<!DOCTYPE html>
<html>
  <head>
    <title> Details</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Details</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    {{#users}}
      <dl>
        {{#fields}}
	  {{#value}}
          <dt>{{friendlyName}}</dt>
          <dd>{{value}}</dd>
	  {{/value}}
	{{/fields}}
      </dl>
    {{/users}}
    {{>footer}}
  </body>
</html>
