'use strict';

const assert = require('assert');
const OutputData = require('./outputData');

class Sensors {
  constructor() {
    //@TODO
     this.sensorDataU = [];
	  this.sensorTypeU=[];
	  this.sensorU=[];
  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
	  this.sensorDataU=[];
	  this.sensorTypeU=[];
	  this.sensorU=[];
  }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO
	  this.sensorTypeU.push(sensorType);
	  function compare(a,b){
		  if(a["id"]>b["id"]) return -1;
		  if(b["id"]>a["id"]) return -1;
		  return 0;
	  }
	  this.sensorTypeU.sort(compare);
  }
  
  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
	

  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@TODO
	  this.sensorU.push(sensor);
	  function compare(a,b){
		  if(a["id"]>b["id"]) return 1;
		  if(b["id"]>a["id"]) return -1;
		  return 0;
	  }
	  this.sensorU.sort(compare);

  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All //user errors must be thrown as an array of objects.
   */
  async compare(a, b){
    if (a["id"] > b["id"]) return 1;
    if (b["id"] > a["id"]) return -1;
    return 0;
  }

  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO
    this.sensorDataU.push(sensorData);
	  function compare(a,b){
		  if(a["id"]>b["id"]) return 1;
		  if(b["id"]>a["id"]) return -1;
		  return 0;
	  }
	  this.sensorDataU.sort(compare);

    //this.sensorDataU.sort(compare);
  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO
    var result1={};
	  result1.nextIndex=1;
	  result1.data=[];
	  var count=0;
	  var indexCount=5;
	  var indexCounter=0;
	  if(info.hasOwnProperty("count"))
	  {
		  indexCount=info.count;
           }
	  var inputLength=Object.keys(info).length;
	  if(inputLength==0){
		  for(var check=0;check<indexCount;check++)
       		  {
			  result1.data.push(this.sensorTypeU[check]);
	          }
	                     }
	  else
           {
	  var keys=Object.keys(searchSpecs);
	  for(var index=0;index<this.sensorTypeU.length;index++)
	  { 
	     for(var i=0;i<keys.length;i++)
		  {
		  var key=keys[i];
		  if(indexCounter<indexCount &&this.sensorTypeU[index].hasOwnProperty(key) && (this.sensorTypeU[index][key]===searchSpecs[key] || this.sensorTypeU[index][key]===parseInt(searchSpecs[key],10)))
		  {       result1.data.push(this.sensorTypeU[index]);
			  indexCounter=indexCounter+1;
		  }
	  }
       }
	   }
	  return result1;
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property, 
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete 
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO
	  const result3={};
	  result3.nextIndex = 1;
	  result3.data = [];
	  var count=0;
	  var indexCount=5;
	  var indexCounter=0;
	  if(info.hasOwnProperty("count"))
	  {    
  		  indexCount=info.count;
          }		  
	  var inputLength = Object.keys(info).length;
	  if (inputLength == 0) {
		for(var check=0;check<indexCount;check++)
		  {
			  result3.data.push(this.sensorU[check]);
                  // result3=this.sensorU[index];
	           }
	                          }
	  else{
	  var keys = Object.keys(searchSpecs);
	  //console.log(keys)
	  for(var index=0;index<this.sensorU.length;index++)
	  {        
            for(var i = 0;i<keys.length;i++){
			var key = keys[i]
		  	if(indexCounter<indexCount && this.sensorU[index].hasOwnProperty(key) && (this.sensorU[index][key]===searchSpecs[key]|| this.sensorU[index][key]===parseInt(searchSpecs[key],10)))
		  	{
			  result3.data.push(this.sensorU[index]);
				indexCounter=indexCounter+1;
			  //result3=this.sensorU[index];
                  	}
		}
          }
	  }
    return result3;
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   * 
   *  If info specifies a truthy value for a doDetail property, 
   *  then the returned object will have additional 
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorData(info) {
	  
    const searchSpecs = validate('findSensorData', info);
    //@TODO
   const result = {};
	  result.nextIndex=1;
	  result.data=[];
	  var count=0;
	  var indexCount=5;
	  var indexCounter=0;
	  if(info.hasOwnProperty("count"))
	  {
		  indexCount=info.count;
           }

	 // console.log(searchSpecs);
	  var inputLength=Object.keys(info).length;
	  if(inputLength==0)
	  {
		  for(var check=0;check<indexCount;check++)
		  {
			  result.data.push(this.sensorDataU[check]);
		  }
           }
	  else
	  {
	  var keys=Object.keys(searchSpecs);
   for ( var index = 0; index<this.sensorDataU.length;index++)
{
	for(var i=0;i<keys.length;i++)
	{ 
		var key=keys[i];
    if(indexCounter<indexCount && this.sensorDataU[index].hasOwnProperty(key) && (this.sensorDataU[index][key]===searchSpecs[key] || this.sensorDataU[index][key]===parseInt(searchSpecs[key],10)))
	    {
		    //result.push(this.sensorDataU[index]);
		    result.data.push(this.sensorDataU[index]);
		    indexCounter=indexCounter+1;
             }
    }
}
}
    return result;
  }
  
  
}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary

const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
	  
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}


function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
	  sensorId: {default:null },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
	default:null,//also returned
    },
  },
	_range:{//pseudo-command ;used internally for validating range
          min:{type:"number"},
		 max:{type:"number"},
	},
};
