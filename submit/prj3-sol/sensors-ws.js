const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');
const p=0;
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const error_check=0;
var check="sensor-type";

function serve(port, sensors) {
  //@TODO set up express app, routing and listen
  const app=express();
  app.locals.port=port;
  //p=port;
  app.locals.sensors=sensors;
    //console.log(sensors.client.s.url);
    //sensors.toString=function(){return sensors};
 setupRoutes(app);
 app.listen(port,function(){
 console.log(`listening on port ${port}`);
 })
// console.log(sensors);
}


module.exports = { serve:serve };

function setupRoutes(app) {
  const sensors = app.locals.sensors;
  //console.log(sensors);
  app.use(cors());
  app.use(bodyParser.json());
  app.get(`/sensor-types`,doList(app));
  app.get(`/sensor-types/:id`,doListT(app));
   app.get(`/sensors`,getSensors(app));
   app.get(`/sensors/:id`,getSensorsT(app));
  app.get(`/sensor-data/:sensorId`,getSensorData(app));
  app.get(`/sensor-data/:sensorId/:timestamp`,getSensorDataT(app));
  app.post('/sensor-types',addSensorType(app));
  app.post('/sensors',addSensor(app));
  app.post('/sensor-data/:sensorId',addSensorData(app)); 
}



function doList(app) {
  return errorWrap(async function(req, res) {
    //console.log("dolist");
    const q = req.query || {};
    const index=Number(req.param('_index'));
    const count=Number(req.param('_count'));
      var next_index=index+count;
        var prev_index=index-count;
        const port = req.app.locals.port;
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
      for(var key in results)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":"+port+"/sensor-types/"+temp1["id"];
          
        
        }
      }
    }
      //var temp=req.protocol+"://"+req.hostname+":2345"+req.originalUrl;
      //temp1["self2"]=requestUrl(req);
      results["self"]=requestUrl(req);
     // if(index!=undefined && count!=undefined)
     if(!isNaN(next_index) && !isNaN(prev_index))
      {
        results["next"]=req.protocol+"://"+req.hostname+":2345"+req.path+"?_index="+next_index+"&_count="+count;
        results["previous"]=req.protocol+"://"+req.hostname+":2345"+req.path+"?_index="+prev_index+"_&count="+count;
      }
      //if(index==undefined && count==undefined)
      else
      {
        results["next"]=req.protocol+"://"+req.hostname+":2345"+req.path+"?_index=5";
      }
      res.json(results);
      
    }
    catch (err) {
      //error_check=error_check+1;
      
     // results["errors"]={};
    var results={};
      const errors={};
        errors["code"]="NOT FOUND";
       errors["message"]="no result for sensor-id "+req.params.id;
        results=errors;
       //res.json(results);
      //const mapped = mapError(err);
      //err.isDomain=true;

      res.status(NOT_FOUND).json(results);

          }
  });
}

function doListT(app) {
  return errorWrap(async function(req, res) {
    console
    const q = req.query || {};
    const port = req.app.locals.port;
   q["id"]=req.params.id;
   //console.log("dms");
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
      if (results.length === 0) {
        throw {
          error_check:1,
          isDomain: true,
          errorCode: 'NOT_FOUND',
          message: `user ${id} not found`,
        }
        //const errors={};
        //errors["code"]="NOT FOUND";
       // errors["message"]="no result for sensor-id"+req.params.id;
       // res.json(errors);
            }
     else{
      for(var key in results)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":"+port+"/sensor-types/"+temp1["id"];
        
        }
      }
    }
      var temp=req.protocol+"://"+req.hostname+":2345"+req.originalUrl;
      results["self"]=temp;
     
      
      res.json(results);
      
    }
  }
    catch (err) {
     var results={};
      const errors={};
       errors["code"]="NOT FOUND";
       errors["message"]="no result for sensor-id "+req.params.id;
        results=errors;
       
      res.status(NOT_FOUND).json(results);

     // const mapped = mapError(err);
      //res.status(mapped.status).json(mapped);

    }
  });
}



function getSensors(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    //console.log(q);
    var temp=req.protocol+"://"+req.hostname+":2345"+req.originalUrl;
    var count=req.param('_count');
    const port = req.app.locals.port;
   
    try {
      const results = await app.locals.sensors.findSensors(q);
      
      for(var key in results)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":"+port+"/sensors/"+temp1["id"];
        
        }
      }
    }
      results["self"]=temp;
      if(count!=undefined)
      {
        results["next"]=req.protocol+"://"+req.hostname+":"+port+req.originalUrl+"&_index="+count;
      }
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensorsT(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    q["id"]=req.params.id;
   // console.log(q);
    const port = req.app.locals.port;

    var temp=req.protocol+"://"+req.hostname+":2345"+req.originalUrl;
    
      
    try {
      const results = await app.locals.sensors.findSensors(q);
      for(var key in results)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":"+port+"/sensors/"+temp1["id"];
        
        }
      }
    }
      results["self"]=temp;
      
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function getSensorData(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
   q["sensorId"]=req.params.sensorId;
   const port = req.app.locals.port;
    try {
      const results = await app.locals.sensors.findSensorData(q);
      var temp=req.protocol+"://"+req.hostname+":2345"+req.originalUrl;
   results["self"]=temp;
      for(var key in results)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":"+port+"/sensor-data/"+req.params.sensorId+"/"+temp1["timestamp"];;
        
        }
      }
    }
     // results["self"]=temp;
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function getSensorDataT(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
   // console.log(q);
     //console.log(req.params.sensorId);
    //var s={};
   q["sensorId"]=req.params.sensorId;
   q["timestamp"]=req.params.timestamp;
   const port = req.app.locals.port;
    try {
      const results = await app.locals.sensors.findSensorData(q);
      
   let check=0;
   const result={};
   for(var key in results)
   {
     if(results.hasOwnProperty("data"))
     {
       var t=results["data"];
       for(var temp1 of t)
       {
         if(temp1.hasOwnProperty("timestamp") &&check==0)
         {
           if(Number(temp1["timestamp"])==Number(req.params.timestamp))
           {
              result["data"]=temp1;
             check=check+1;

           }
         }
       }
     }
   }
  if(check==1)
  {
   var temp=req.protocol+"://"+req.hostname+":"+port+req.originalUrl;
   result["self"]=temp;

      for(var key in result)
      {
      if(results.hasOwnProperty("data"))
      { 
        var t=results["data"];
        for(var temp1 of t)
        {
          temp1["self"]=req.protocol+"://"+req.hostname+":2345/sensor-data/"+req.params.sensorId+"/"+temp1["timestamp"];;
        
        }
      }
    }
     // results["self"]=temp;
      res.json(result);
    }
    else{
      const errors={};
      errors["code"]="NOT FOUND";
      errors["message"]="no data for timestamp "+req.params.timestamp;
      res.status(NOT_FOUND).json(errors);
     // res.json(errors);
    }
  }
    catch (err) {
      const mapped = mapError(err);
     // res.status(mapped.status).json(mapped);
      res.status(NOT_FOUND).json(results);
    }
  });
}

function addSensorType(app) {
  return errorWrap(async function(req, res) {
    try{
    const obj=req.body;
    const results= await app.locals.sensors.addSensorType(obj); 
    res.append('Location',requestUrl(req)+'/'+obj.id);
    //res.send(CREATED);
    res.sendStatus(CREATED);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function addSensor(app) {
  return errorWrap(async function(req, res) {
    try{
    const obj=req.body;
    const results= await app.locals.sensors.addSensor(obj); 
   res.append('Location',requestUrl(req)+'/'+obj.id);
   // res.send(CREATED);
    res.sendStatus(CREATED);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}



function addSensorData(app) {
  return errorWrap(async function(req, res) {
    try{
    const obj=req.body;
   // console.log(obj);
    obj["sensorId"]=req.params.sensorId;
    const results= await app.locals.sensors.addSensorData(obj); 
    res.append('Location',requestUrl(req)+'/'+obj.timestamp);
    res.send(CREATED);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}



function doCreate(app){
  return errorWrap(async function(req,res)
  { 
    try{
      console.log("inside doCreate");
    }
    catch(err)
    {
      const mapped=mapError(err);
      res.status(mapped.status).json(mapped);
    }
     })
}




function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.error(err);
  };
}

/** Set up error handling for handler by wrapping it in a 
 *  try-catch with chaining to error handler on error.
 */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

/*************************** Mapping Errors ****************************/

const ERROR_MAP = {
  EXISTS: CONFLICT,
  NOT_FOUND: NOT_FOUND
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  //console.error(err);
  //console.log("is domain is");
 // console.log(err.isDomain);
 // console.log(err.errorCode);
 // console.log(err.message);
 // console.log(err.isDomain);
  
  //}
  //console.log(err.errorCode);
  return err.isDomain
    ? { status: (ERROR_MAP[err.errorCode] || BAD_REQUEST),
	code: err.errorCode,
  message: err.message,
  //df:"sd"
     }
    : { status: SERVER_ERROR,
      code: 'INTERNAL',
      message: err.toString()
         };
    } 

/****************************** Utilities ******************************/

/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
  
