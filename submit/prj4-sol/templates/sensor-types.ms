<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensor Types</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <div class="page">
    <h1 class="tst-sensor-types-search-page">Search Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/sensor-types.html" >

    {{#fields}}
	  {{#isSearch}}
	    <label>
	    <span class="label">{{friendlyName}}:</span>
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}

<div>
         

    <label>&nbsp;</label> <input name="submit" type="submit" value="search" class="control">
    </form>
    </div>
    <h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                  <th>Manufacturer</th>
                  <th>Sensor Type ID</th>
                  <th>Model Number</th>
                  <th>Measure</th>
                  <th colspan="2">Limits</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
    	   </tr>
         </thead>
         <tbody>
         {{>data}}
                 
                          </tbody>
    </table>

    <div class="scroll">
    <a class="tst-next" href="?_index&#x3D;5" rel="next">&gt;&gt;</a>
    </div>

    <footer>
    <ul>
      <li><a class="tst-home" href="/">Home</a>.</li>
        <li>
          <a class="tst-sensor-types-search"
    	 href="/sensor-types.html">
    	Search Sensor Types
          </a>.
        </li>
        <li>
          <a class="tst-sensor-types-add"
    	 href="/sensor-typesAdd.html">
    	Add Sensor Type
          </a>.
        </li>
        <li>
          <a class="tst-sensors-search"
    	 href="/sensors.html">
    	Search Sensor
          </a>.
        </li>
        <li>
          <a class="tst-sensors-add"
    	 href="/sensorsAdd.html">
    	Add Sensor
          </a>.
        </li>
    </ul>
    </footer>
  </body>
</html>
