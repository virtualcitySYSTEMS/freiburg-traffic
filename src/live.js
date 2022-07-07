import {getFramework} from './getFramework';

const framework=getFramework();
let features={};
let count = 0;

export async function activateWSLayer(){
    const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
    var layerName = uiConfig['trafficLayer'];
    var layer = framework.getLayerByName(layerName);
    //return connectWS().then((ws)=>{
    return connect().then((ws)=>{
      layer.activate().then(()=>{
        layer.fetchData().then(() => {
          features = layer.source.getFeatures();
          ws.onmessage = function(e, features) {
            var data = JSON.parse(e.data);
            var feat = features.filter((el)=>el.getProperty('code')===data.code)[0];
            if(feat){
              //var props=feat.getProperties();
              feat.set("olcs_extrudedHeight", data.speed);
              feat.set("speed", data.speed);
              feat.set("average", data.average);
              feat.set("speedBucket", data.speedBucket);
              feat.changed();
            }
            //console.log(data);
          }; 
          features.forEach((feat) => {
            var props=feat.getProperties();
            feat.set("olcs_extrudedHeight", props.speed);
            feat.changed();
          });
        });
      });
      //console.log(ws);
      return Promise.resolve(true);
    }).catch(function(err) {
      console.log(err);
      return Promise.resolve(false);
  });

}
function connect() {
  return new Promise(function(resolve, reject) {
    const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
    var wsURL = uiConfig['wsURL'];
    let ws = new WebSocket(wsURL);
    ws.onopen = function() {
        count=0;
        resolve(ws);
    };
    ws.onerror = function(err) {
      if(count<5){
        setTimeout(function() {
          count+=1;
          console.log(count+ '. Versuch die Verbindung zum live stream zu etablieren! ' + (5-count) +' Versuche verbleiben...');
          connect();
        }, 1000);
      }else{
        console.log('Connection to live stream not possible. Even after 5 retries no connection established!');
        reject(err);
      }
    };
  });
}
/* async function connectWS(){
    const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
    var wsURL = uiConfig['wsURL'];
    let status=false;
    if(count < 5){

      let ws = new WebSocket(wsURL);
      ws.onopen = function() {
        count = 0;
        status=true;
        console.log("ws connected");
       // return Promise.resolve(ws);
      }
      ws.onclose = function() {
        console.log("ws closed");
        setTimeout(function() {
          count+=1;
          connectWS();
        }, 1000);
      };
      ws.onerror = function() {
        console.log("ws error");
      //  return Promise.resolve(false);
      };
      ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var feat = features.filter((el)=>el.getProperty('code')===data.code)[0];
        if(feat){
          //var props=feat.getProperties();
          feat.set("olcs_extrudedHeight", data.speed);
          feat.set("speed", data.speed);
          feat.set("average", data.average);
          feat.set("speedBucket", data.speedBucket);
          feat.changed();
        }
        //console.log(data);
      }; 
    }else if(count ===5){
      console.log('Connection to live stream not possible. Even after 5 retries no connection established!');
      if(status){
        return Promise.resolve(wS);
      }else{
        return Promise.resolve(false);
      }
      //return Promise.reject(new Error("Whoops!"));
    }
  } */