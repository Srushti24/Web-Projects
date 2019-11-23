<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensors</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <div class="page">
    <h1 class="tst-sensors-search-page">Search Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/sensors.html" >

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
   <br/>
</div>
    <label>&nbsp;</label> <input name="submit" type="submit" value="search" class="control">
    </form>
    </div>

    

    <h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                  <th>Sensor ID</th>
                  <th>Model</th>
                  <th>Period</th>
                  <th colspan="2">Expected Range</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
    	   </tr>
         </thead>
         <tbody>
         {{>sdata}}                        
               </tbody>
    </table>












    <div class="scroll">
    
    <a class="tst-next" href="?_index&#x3D;5" rel="next" name="next">&gt;&gt;</a>
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
