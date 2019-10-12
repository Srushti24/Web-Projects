'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

//var USER_TABLE='user_infos';
class Sensors {
  constructor(client, dbN) {
    this.client = client;
    this.dbN = dbN;
    this.db=client.db(dbN);
    this.f=this.db.collection("a"); 
    this.f2=this.db.collection("b");
    this.f3=this.db.collection("c");
             
    
    //db.createCollection("vr",function(err,db){
      //if(err) throw err;
      //console.log("collection created");
    }
       
  


  /** Return a new instance of this class with database as
   *  per mongoDbUrl.  Note that mongoDbUrl is expected to
   *  be of the form mongodb://HOST:PORT/DB.
   */
  static async newSensors(mongoDbUrl) {
    //@TODO
    console.log(mongoDbUrl);
    var string=mongoDbUrl;
    var regex=RegExp('mongodb:\/\/localhost:[0-9]+\/sensors');
    var result=regex.test(string);
    if(result===true)
    {
     // console.log(result);
      var f=string.split('/');
      var link=f[0].concat('//').concat(f[2]);
      var DB_NAME=f[3];
      //console.log(DB_NAME);
      //const c=new mongo(link);

       const client= await mongo.connect(link,MONGO_OPTIONS);
      // if(client.isConnected())
       //{
        // console.log("Connected");
       //}
      //const client = await mongo.connect(link);
    //const db = client.db(DB_NAME);
    //console.log(DB_NAME);
    return new Sensors(client, DB_NAME);
    //console.log()
    }
    else
    {
      console.log("not proper regex");
    }
    //return new Sensors(); 
   
  }
  

  /** Release all resources held by this Sensors instance.
   *  Specifically, close any database connections.
   */
  async close() {
    //@TODO
    await this.client.close();
  }

  /** Clear database */
  async clear() {
    //@TODO
    await this.db.collection('a').drop();
    await this.db.collection('b').drop();
    await this.db.collection('c').drop();
  }

  /** Subject to field validation as per validate('addSensorType',
   *  info), add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
   if(info.hasOwnProperty("id"))
   {
    var get_id=info["id"];
    console.log(get_id);
    
    //user1.replaceOne({"id":get_id},{info},{upsert:true});
    //this.a.replaceOne({"id":get_id},{info},{upsert:true});
    const d=await this.db.collection('a').replaceOne({id:get_id},sensorType,{upsert:true});
     //console.log(d);
    //this.db.f.replaceOne({"id":get_id},{info},{upsert:true});;
   }
    //@TODO
  }
  
  /** Subject to field validation as per validate('addSensor', info)
   *  add sensor specified by info to this.  Note that info.model must
   *  specify the id of an existing sensor-type.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    if(info.hasOwnProperty("id"))
    {
      var get_id2=info["id"];
      const d2=await this.db.collection('b').replaceOne({id:get_id2},sensor,{upsert:true});
    }
    //@TODO
  }

  /** Subject to field validation as per validate('addSensorData',
   *  info), add reading given by info for sensor specified by
   *  info.sensorId to this. Note that info.sensorId must specify the
   *  id of an existing sensor.  Replace any earlier reading having
   *  the same timestamp for the same sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    if(info.hasOwnProperty("sensorId"))
    {
      var get_id3=info["sensorId"];
      const d3=await this.db.collection('c').replaceOne({sensorId:get_id3},sensorData,{upsert:true});
    }
    //@TODO
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorTypes', info), return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types (except for meta-properties starting
   *  with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index
   *  (when set to the lastIndex) and _count search-spec
   *  meta-parameters can be used in successive calls to allow
   *  scrolling through the collection of all sensor-types which meet
   *  some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorTypes(info) {
    //@TODO
    const searchSpecs = validate('findSensorTypes', info);
    var data=[];
    //const index=0;
    //const counter=0;
     //const ret;
     if(info.hasOwnProperty("manufacturer") && info.hasOwnProperty("quantity"))
     {
       const ret=await this.db.collection('a').find({"manufacturer":searchSpecs.manufacturer,"quantity":searchSpecs.quantity}).sort({id:1}).toArray();
         //const ret=ret1.sort();
       return {data:[ret],nextIndex:-1};
      }
  
      //const check={$or:[{id:searchSpecs.id},{manufacturer:searchSpecs.manufacturer},{modelNumber:searchSpecs.modelNumber},{quantity:searchSpecs.quantity}]};
      else if(info.hasOwnProperty("id"))
      { 
       const ret=await this.db.collection('a').find({"id":searchSpecs.id}).sort({id:1}).toArray();
       //const ret=ret1.sort();
    return { data:[ret], nextIndex: -1 };
      }
      else if(info.hasOwnProperty("manufacturer"))
      {
        const ret=await this.db.collection('a').find({"manufacturer":searchSpecs.manufacturer}).sort({id:1}).toArray();
        //const ret=ret1.sort();
        if(info.hasOwnProperty("_index"))
        {   if(info.hasOwnProperty("_count"))
              {
               const counter=Number(searchSpecs._count);
                const index=Number(searchSpecs._index);
                const data=[];
                var i=0;
                while(i!=counter)
                {
                  data.push(ret[index+i]);
                  i++;
                  
                }
                return {data:data,nextIndex:1+i};
              }
            const index=Number(searchSpecs._index);
           console.log(index);
           return{data:[ret[index]],nextIndex:this.index};
        }
        return{data:[ret],nextIndex:-1};
      }
      else
      {
        return{data:[ret],nextIndex:-1};
      }
      
  }
  
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when 
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);
    if(info.hasOwnProperty("model"))
    { 
      const ret=await this.db.collection('b').find({"model":searchSpecs.model}).sort({id:1}).toArray();
     if(info.hasOwnProperty("_index"))
       {
         if(info.hasOwnProperty("_count"))
         {  const data=[];
           const counter=Number(searchSpecs._count);
           const index=Number(searchSpecs._index);
           var i=0;
           while(i!=counter)
           {
            data.push(ret[index+i]);
            i++;
           }
           return {data:data,nextIndex:i+1};
         }
         const index=Number(searchSpecs._index);
         return {data:[ret[index]],nextIndex:0};
       }
          
    return { data:[ret], nextIndex:1+i};
      }
      return {data:[],nextIndex:-1};
}
  
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
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
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
    const{sensorId,timestamp,_count,statuses}=searchSpecs;
    const check1=await this.db.collection('b').find({"id":searchSpecs.sensorId}).toArray();
    //console.log(check1);
    var data=[];
    for(var key of check1)
    {
      if(key.hasOwnProperty("period"))
      {
        const period=key.period;
        
      }
      if(key.hasOwnProperty("expected"))
      {
        
        var range=key.expected;
      }
      
    }

    const check2=await this.db.collection('a').find({"id":searchSpecs.sensorId}).toArray();
    assert(check2);
    for(const k of check2)
    {
      if(k.hasOwnProperty("limits"))
      {
        var l=k.limits;
        console.log(l);
      }
    }
  const sensorData=await this.db.collection('c').find({"sensorId":searchSpecs.sensorId}).sort({sensorId:1}).toArray();
  //console.log(sensorData);
  for(const k of sensorData)
  {
    if(k.hasOwnProperty("value"))
    {
      var v=k.value;
  
    }
  }
  if(l!=undefined){
  var status=!inRange(v,l)?'error':!inRange(v,range)?'outOfRange':'ok';
  }
  else
  {
   var status=!inRange(v,range)?'outOfRange':'ok';
  }
  if(statuses.has(status))
  {
    data.push({
      timestamp:searchSpecs.timestamp,
      value:v,
      status
    })
  }

    ///return {data:[sensorData],nextIndex:sensorData.length};
    //if(!sensorData) throw['no sensor data for sensor ${sensorId}'];
   //const[period,latest]=[Number(check1.period),check2.value];
   //const startTime=(timestamp>latest)?latest:latest-Math.ceil((latest-timestamp)/period)*period;
   //const data=[];

    
    return { data: data,nextIndex:-1 };
  }

  
  //async toDbUsers(users,mustHaveId=true) {
    //const userPromises=users.map(async(u)=>await toDBUsers(u,mustHaveId));
    //turn await Promise.all(userPromises);
    
  //}

} //class Sensors

module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}

function fromDbUsers(dbUsers)
{
  return dbUsers.map((u)=>fromDbUser(u));
}

function fromDbUser(dbUser)
{
  const user=Object.assign({},dbUser);
  return user;
}
//async function toDbUsers(users,mustHaveId=true)
//{
  //const userPromises=users.map(async(u)=>await toDBUsers(u,mustHaveId));
  //return await Promise.all(userPromises);
//}