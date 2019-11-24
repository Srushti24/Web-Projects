'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');
const path=require('path');
//const mustache = require('mustache');
const mustache = require('mustache');

const Mustache = require('./mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';
const router = express.Router();
var check;


//function serve(port, model, base='') {
  //@TODO
//}

function serve(port, model, base='') {
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
 
  app.use(base, express.static(STATIC_DIR));
  

  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
   // console.log(__dirname);
     
});
}


module.exports = serve;

//@TODO



function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}


/******************************** Routes *******************************/

function setupRoutes(app) {
  const base = app.locals.base;
 
  app.get(`${base}/sensor-types.html`, doSearchTypes(app));
 // app.get(`${base}/list.html`, listUsers(app));
 app.get(`${base}/sensors.html`, doSearchSensors(app));

 app.get(`${base}/sensorsAdd.html`, getSensors(app));
 app.post(`${base}/sensorsAdd.html`,bodyParser.urlencoded({extended: false}), addSensors(app));
 app.get(`${base}/sensor-typesAdd.html`,bodyParser.urlencoded({extended: false}), getSensorTypes(app));
 app.post(`${base}/sensor-typesAdd.html`,bodyParser.urlencoded({extended: false}), addSensorTypes(app));


 
  
    };







/*************************** Action Routines ***************************/


function getSensors(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS_Add_Sensors};
    //console.log(model.fields);
    const html = doMustache(app, 'sensorsAdd', model);
    res.send(html);
  };
};

function addSensors(app) {
  return async function(req, res) {
    var result={};
    const isSubmit = req.body.submit !== undefined;
    const user = getNonEmptyValues(req.body,3);
    //console.log('user is');
    //console.log(user);
    if(user.min!=undefined && user.max!=undefined)
    {
      result["id"]=user.id; 
      result["model"]=user.model; 
      result["period"]=user.period;
      result["expected"]={}; 
      result.expected.min=user.min;
      result.expected.max=user.max;
    }
    //console.log("result is");
    //console.log(result);
    let errors = validate(user,3, ['id']);
    //console.log(isSubmit);
   if(isSubmit){
    //if (!errors) {
      try {
//	if (isUpdate) {
  //const errors="not working";
    //console.log("over here");
    await app.locals.model.update('sensors',result);
     const users=Object.keys(user).map(i => user[i]);
    const fields =
	users.map((u) => ({id: u.id, fields: fieldsWithValues(u,3)}));
   const model=errorModelOne(app,3, 'sensorsAdd', errors,fields,result)
    //const model = errorModel(app,3, 'sensorsAdd', errors);
    const html = doMustache(app, 'sensorsAdd', model);
      res.send(html);
    //res.redirect(`${app.locals.base}/${user.id}.html`);
//	}
//	else {
	 // await app.locals.model.update('sensors',user);
//	}
	//res.redirect(`${app.locals.base}/${user.id}.html`);
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
    }
  //}
    //if (errors) {
      //const model = errorModel(app,3, 'sensorsAdd', errors);
      //const html = doMustache(app, 'sensorsAdd', model);
      //res.send(html);
     //}
  };
};


function getSensorTypes(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS_Add_SensorTypes};
    //console.log(model.fields);
    const html = doMustache(app, 'sensor-typesAdd', model);
    res.send(html);
  };
};
function addSensorTypes(app) {
  return async function(req, res) {
    var result={};
    const isSubmit = req.body.submit !== undefined;
    const user = getNonEmptyValues(req.body,4);
    //console.log('user is');
    //console.log(user);
    if(user.min!=undefined && user.max!=undefined)
    {
     
     result["id"]=user.id; 
     result["manufacturer"]=user.manufacturer; 
     result["modelNumber"]=user.modelNumber;
     result["quantity"]=user.quantity;
     result["unit"]=user.unit;
     result["limits"]={}; 
     result.limits.min=user.min;
     result.limits.max=user.max;
    }
    
    //console.log("result is");
    //console.log(result);
    let errors = validate(user,4, ['id']);
    //console.log(isSubmit);
   if(isSubmit){
   
      try {

  //const errors="not working";
    //console.log("over here");
    await app.locals.model.update('sensor-types',result);
    //const model = errorModel(app,4, 'sensor-typesAdd', errors);
    //const html = doMustache(app, 'sensor-typesAdd', model);
      //res.send(html);


      const users=Object.keys(user).map(i => user[i]);
      const fields =
    users.map((u) => ({id: u.id, fields: fieldsWithValues(u,3)}));
     const model=errorModelOne(app,4, 'sensor-typesAdd', errors,fields,result)
      //const model = errorModel(app,3, 'sensorsAdd', errors);
      const html = doMustache(app, 'sensor-typesAdd', model);
        res.send(html);
      
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
    }
  
  };
};




function doSearchTypes(app) {
  return async function(req, res) {
    
    const isSubmit = req.query.submit !== undefined;
    //let html;
    var count=1;
    if(req.query.submit==undefined)
    { let initialOutput;
      if(req.query._index)
      {
        const v=req.query._index;
        //console.log("v is");
        //console.log(v);
        const re={};
        
        re["_index"]=v;
         initialOutput=await app.locals.model.list('sensor-types',re);
      }
      else
      {
      initialOutput=await app.locals.model.list('sensor-types',"");
      }
    var result2=initialOutput["data"];
    //console.log("result2 is");
    //console.log(result2);
    var result3=result2[0];
    //console.log("result3 is");
    //console.log(result3);
    let users1=[];
     users1=Object.keys(initialOutput).map(i => initialOutput[i]);
  // console.log("user is");
   //console.log(users1);
   const fields1 =
	users1.map((u) => ({id: u.id, fields1: fieldsWithValues(u,1)}));
      //model = { base: app.locals.base, users: fields,output:result };
      let err=undefined;
    const   model1=errorModelOne(app,1, 'sensor-types', err,fields1,result2);
      //console.log("result is");
      //console.log(result);
       let html1 = doMustache(app, 'sensor-types', model1);
       res.send(html1);
   }
   



    let users=[];
    let errors = undefined;
    const search = getNonEmptyValues(req.query,1);
    //console.log("search is");
    //console.log(search);
    if (isSubmit) {
      errors = validate(search,1);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
      if (!errors) {

  const q = querystring.stringify(search);
    try{
     const user=await app.locals.model.list('sensor-types',search);
     //console.log("the user is");
     //console.log(user);
     var result1=user["data"];
     var result=result1[0];
     //console.log("data is");
     //console.log(result);
      users=Object.keys(user).map(i => user[i]);
    //console.log("user is");
    //console.log(users);

  }
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
  }
	if (users.length === 0) {
    //if(Object.keys(users).length==0){
	  errors = {_: 'no users found for specified criteria; please retry'};
	}
      }
    //}
  
    
    let model, template,html;
    if (users.length > 0) 
   //if(Object.keys(users).length>0)
   {
      //console.log("yes");
      template = 'details';
      const fields =
	users.map((u) => ({id: u.id, fields: fieldsWithValues(u,1)}));
      //model = { base: app.locals.base, users: fields,output:result };
      model=errorModelOne(app,1, 'sensor-types', errors={},fields,result)
      //console.log("result is");
      //console.log(result);
       html = doMustache(app, 'sensor-types', model);
      res.send(html);
      }
    else
    {
      //console.log("no");
      template =  'details';
      model = errorModel(app,1, 'sensor-types', errors,);
       html = doMustache(app, 'sensor-types', model);
       res.send(html);
    };
  
    //const html = doMustache(app, 'details', model);
    //res.send(html);
  };
  };
};







function doSearchSensors(app) {
  return async function(req, res) {
    //console.log(req.query);
    const isSubmit = req.query.submit !== undefined;
   // console.log("isSubmit is");
    //console.log(isSubmit);
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query,2);
   
    //console.log("search is");
    //console.log(search);


    if(req.query.submit==undefined)
    { let initialOutput;
      if(req.query._index)
      {
        const v=req.query._index;
       // console.log("v is");
        //console.log(v);
        const re={};
        re["_index"]=v;
         initialOutput=await app.locals.model.list('sensors',re);
      }
      else
      {
      initialOutput=await app.locals.model.list('sensors',"");
      }
     
     var result2=initialOutput["data"];
     //console.log("result2 is");
     //console.log(result2);
     var result3=result2[0];
     //console.log("result3 is");
     //console.log(result3);
     let users1=[];
      users1=Object.keys(initialOutput).map(i => initialOutput[i]);
   // console.log("user is");
    //console.log(users1);
    const fields1 =
   users1.map((u) => ({id: u.id, fields1: fieldsWithValues(u,2)}));
       //model = { base: app.locals.base, users: fields,output:result };
       let err=undefined;
     const   model1=errorModelOne(app,2, 'sensors', err,fields1,result2);
       //console.log("result is");
       //console.log(result);
        const html1 = doMustache(app, 'sensors', model1);
        res.send(html1);
    }
    



    if (isSubmit) {
      errors = validate(search,2);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
      if (!errors) {

  const q = querystring.stringify(search);
 // console.log("q is");
  //console.log(q);
	try {
   // users = await app.locals.model.findSensorTypes(q);
     const user=await app.locals.model.list('sensors',search);
    // console.log("the user is");
     //console.log(user);
     var result1=user["data"];
     var result=result1[0];
   // console.log("data is");
     //console.log(result);
      users=Object.keys(user).map(i => user[i]);
    //console.log("users is");
    //console.log(users);
  //  console.log("users length is");
    //console.log(users.length);
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
  }
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
	}
      }
   // }
    //console.log("check again");
    //console.log(Object.entries(users).length);

    let model, template,html;
    if (users.length > 0) 
   {
      //console.log("yes");
      template = 'details';
      const fields =
	users.map((u) => ({id: u.id, fields: fieldsWithValues(u,2)}));
     // model = { base: app.locals.base, users: fields,output:result };
      model=errorModelOne(app,2, 'sensors', errors={},fields,result);
      //console.log("results is");
      //console.log(result);
      //console.log("done");
       html = doMustache(app, 'sensors', model);
       res.send(html);
    }
    else
    {
      //console.log("no");
      template =  'details';
      model = errorModel(app,2, 'sensors', errors);
       html = doMustache(app, 'sensors', model);
       res.send(html);
    };
  };
  
    //const html = doMustache(app, 'details', model);
    //res.send(html);
  };
};





/************************** Field Definitions **************************/

const FIELDS_INFO = {
  id: {
    friendlyName: 'Id',
    isSearch: true,
    isId: true,
    isRequired: true,
    regex: /^[a-zA-Z0-9\-a-zA-Z0-9]+$/,
    error: 'Sensor Id field can only contain alphanumerics or -',
  },
  manufacturer: {
    friendlyName: 'Manufacturer',
    isSearch: true,
    regex: /^[a-zA-Z0-9\sa-zA-Z0-9]+$/,
    error: "Manufacturer field can only contain alphabetics, -, ' or space",
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    regex: /^[a-zA-Z0-9]+$/,
    error: "Model Number field can only contain alphanumerics, -, ' or space",
  },
  quantity: {
    friendlyName: 'Measure',
    isSearch: true,
    regex: /^[a-zA-Z]+$/,
    error: 'measure: field must be of the form "a-zA-Z"',
  },
  
  
  
  
};

const FIELDS=
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));

  const FIELDS_INFO_Add_SensorTypes = {
    id: {
      friendlyName: 'Id',
      isSearch: true,
      isId: true,
      isRequired: true,
      regex: /^[a-zA-Z0-9\-a-zA-Z0-9]+$/,
      error: 'Sensor Id field can only contain alphanumerics or -',
    },
    manufacturer: {
      friendlyName: 'Manufacturer',
      isSearch: true,
      regex: /^[a-zA-Z0-9\sa-zA-Z0-9]+$/,
      error: "Manufacturer field can only contain alphabetics, -, ' or space",
    },
    modelNumber: {
      friendlyName: 'Model Number',
      isSearch: true,
      regex: /^[a-zA-Z0-9]+$/,
      error: "Model Number field can only contain alphanumerics, -, ' or space",
    },
    quantity: {
      friendlyName: 'Measure',
      isSearch: true,
      regex: /^[a-zA-Z]+$/,
      error: 'measure: field must be of the form "a-zA-Z"',
    },
    unit: {
      friendlyName: 'Unit',
      isSearch: true,
      regex: /^[a-zA-Z]+$/,
      error: 'unit: field must be of the form "a-zA-Z"',
    },

    
    min:{
      friendlyName: 'Minimum Expected',
    isSearch: true,
    regex: /^\d+$/,
    error: 'expected: field must be of the form of numbers',
    },
    max:{
      friendlyName: 'Maximum Expected',
    isSearch: true,
    regex: /^\d+$/,
    error: 'expected: field must be of the form of numbers',
    }
    
    
  };
  
  const FIELDS_Add_SensorTypes=
    Object.keys(FIELDS_INFO_Add_SensorTypes).map((n) => Object.assign({name: n}, FIELDS_INFO_Add_SensorTypes[n]));
  
  


  const FIELDS_INFO_Sensors = {
    id: {
      friendlyName: 'Sensor ID',
      isSearch: true,
      isId: true,
      isRequired: true,
      regex: /^[a-zA-Z0-9]+$/,
      error: 'Sensor Id field can only contain alphanumerics or _',
    },
    model: {
      friendlyName: 'Model',
      isSearch: true,
      regex: /^[a-zA-Z0-9\-a-zA-Z0-9 ]+$/,
      error: 'pModel: field must be of the form alphanumeric',
    },
    period: {
      friendlyName: 'Period',
      isSearch: true,
      regex: /^\d+$/,
      error: 'period: field must be of the form of numbers',
    },
    
  }; 
  
  const FIELDS_Sensors =
  Object.keys(FIELDS_INFO_Sensors).map((n) => Object.assign({name: n}, FIELDS_INFO_Sensors[n]));







  const FIELDS_INFO_Add_Sensors = {
    id: {
      friendlyName: 'Sensor ID',
      isSearch: true,
      isId: true,
      isRequired: true,
      regex: /^[a-zA-Z0-9]+$/,
      error: 'Sensor Id field can only contain alphanumerics or _',
    },
    model: {
      friendlyName: 'Model',
      isSearch: true,
      regex: /^[a-zA-Z0-9\-a-zA-Z0-9 ]+$/,
      error: 'pModel: field must be of the form alphanumeric',
    },
    period: {
      friendlyName: 'Period',
      isSearch: true,
      regex: /^\d+$/,
      error: 'period: field must be of the form of numbers',
    },

       min:{
        friendlyName: 'Minimum Expected',
      isSearch: true,
      regex: /^\d+$/,
      error: 'expected: field must be of the form of numbers',
      },
      max:{
        friendlyName: 'Maximum Expected',
      isSearch: true,
      regex: /^\d+$/,
      error: 'expected: field must be of the form of numbers',
      }

    
  }; 
  
  const FIELDS_Add_Sensors =
  Object.keys(FIELDS_INFO_Add_Sensors).map((n) => Object.assign({name: n}, FIELDS_INFO_Add_Sensors[n]));


  /************************** Field Utilities ****************************/

/** Return copy of FIELDS with values and errors injected into it. */
function fieldsWithValues(values,rotate, errors={}) {
  if(rotate==1)
  {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}
if(rotate==2)
{
return FIELDS_Sensors .map(function (info) {
  const name = info.name;
  const extraInfo = { value: values[name] };
  if (errors[name]) extraInfo.errorMessage = errors[name];
  return Object.assign(extraInfo, info);
});
}
if(rotate==3)
{
return FIELDS_Add_Sensors.map(function (info) {
  const name = info.name;
  const extraInfo = { value: values[name] };
  if (errors[name]) extraInfo.errorMessage = errors[name];
  return Object.assign(extraInfo, info);
});
}
if(rotate==4)
{
return FIELDS_Add_SensorTypes.map(function (info) {
  const name = info.name;
  const extraInfo = { value: values[name] };
  if (errors[name]) extraInfo.errorMessage = errors[name];
  return Object.assign(extraInfo, info);
});
}
else
{
  return FIELDS_Sensors.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}
}

/** Given map of field values and requires containing list of required
 *  fields, validate values.  Return errors hash or falsy if no errors.
 */
function validate(values, rotate,requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined && rotate===1) {
      errors[name] =
	`A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
    else if (values[name] === undefined && rotate===2) {
      errors[name] =
	`A value for '${FIELDS_INFO_Sensors[name].friendlyName}' must be provided`;
    }
    else if (values[name] === undefined && rotate===3) {
      errors[name] =
	`A value for '${FIELDS_INFO_Add_Sensors[name].friendlyName}' must be provided`;
    }


  });
  for (const name of Object.keys(values)) {
    if(rotate==1)
    {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
 else if(rotate==2)
 
 
  {
  const fieldInfo = FIELDS_INFO_Sensors[name];
  const value = values[name];
  if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
    errors[name] = fieldInfo.error;
  }
}
else if(rotate==3)
 
 
  {
  const fieldInfo = FIELDS_INFO_Add_Sensors[name];
  const value = values[name];
  if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
    errors[name] = fieldInfo.error;
  }
}
 }
  
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values,rotate) {
  const out = {};
  if(rotate==1)
  {
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}
else if(rotate==2) {
  
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO_Sensors[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}
else if(rotate==3) {
  
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO_Add_Sensors[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}
else if(rotate==4) {
  
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO_Add_SensorTypes[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}
}

/** Return a model suitable for mixing into a template */
function errorModel(app,rotate, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values,rotate, errors)
  };
}


function errorModelOne(app,rotate, values={}, errors={},fields,result) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values,rotate, errors),
    users: fields,
    output:result 
  };
}





/************************ General Utilities ****************************/

/** Decode an error thrown by web services into an errors hash
 *  with a _ key.
 */
function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer,data:app.templates.data,sdata:app.templates.sdata };
  //return mustache.render(app.templates[templateId], view, templates);
  return mustache.render(app.templates[templateId],view,templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}
