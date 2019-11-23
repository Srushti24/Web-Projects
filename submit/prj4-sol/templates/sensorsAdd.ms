<!DOCTYPE html>
<html>
  <head>
    <title>Create &#x2F; Update Sensors</title>

    <<link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <div class="page">
    <h1 class="tst-sensors-add-page">Create &#x2F; Update Sensors</h1>
    <p>
     <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    </p>
    <form method="POST" action="{{{base}}}/sensorsAdd.html" >
   
    
	 
        
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
    <label>&nbsp;</label> <input name="submit" type="submit" value="submit" class="control">
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
                               
              {{#output}}

    

   
        
                 <tr>
                         <td
    		          class="tst-sensor-type-id">
    		       {{{output.id}}}
    		     </td>
                         <td
    		         class="tst-model-number">
    		       {{{output.model}}}
    		     </td>
                         <td
    		         class="tst-quantity">
                 {{{output.period}}}
    		       
    		     </td>
                         <td
    		         class="numeric interval tst-limits-min">
    		        {{{output.expected.min}}}
    		     </td>
                         <td
    		         class="numeric interval tst-limits-max">
    		       {{{output.expected.max}}}
    		     </td>
                         
               </tr>
               {{/output}}
                 
                      </tbody>
                     </table>

     





     <div class="scroll">
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
