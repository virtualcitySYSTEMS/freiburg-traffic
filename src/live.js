import {getFramework} from './getFramework';
import {getIcon} from './helpers'

const framework=getFramework();
let features={};
let count = 0;

let user = "vsReaMapReader";
let pass = "Yg!reXDujf#1p5_jF";
let url = "backchannel/";
let authorizationBasic = window.btoa(user + ':' + pass);

export async function activateWSLayer(layer){
    //return connectWS().then((ws)=>{
      let first = false;
    return connect().then((ws)=>{
      layer.activate().then(()=>{
        layer.fetchData().then(() => {
          features = layer.source.getFeatures();
          ws.onmessage = function(e) {
            //let feats = layer.source.getFeatures();
            
            let data = JSON.parse(e.data);
            if(!first){
              console.log(data);
              first=true;
            }
            let feat = features.filter((el)=>el.getProperty('code')===data.code)[0];
            if(feat){
              if(feat["olcs_extrudedHeight"]!= data.speed || feat["speed"]!= data.speed || feat["average"]!= data.average || feat["speedBucket"]!= data.speedBucket){
                feat.set("olcs_extrudedHeight", data.speed);
                feat.set("speed", data.speed);
                feat.set("average", data.average);
                feat.set("speedBucket", data.speedBucket);
                feat.changed();
              }
            }
            //console.log(data);
          }; 
          features.forEach((feat) => {
            let props=feat.getProperties();
            feat.set("olcs_extrudedHeight", props.speed);
            feat.changed();
          });
        });
      });
      //console.log(ws);
      return Promise.resolve(ws);
    }).catch(function(err) {
      console.log(err);
      return Promise.resolve(false);
  });

}
export async function activateWSCameraLayer(layer){
  //return connectWS().then((ws)=>{
    let first = false;
  return connectCams().then((ws)=>{
    layer.activate().then(()=>{
      layer.fetchData().then(() => {
        features = layer.source.getFeatures();
        ws.onmessage = function(e) {
          //let feats = layer.source.getFeatures();
          let data = JSON.parse(e.data);
/*           if(!first){
            console.log(data);
            first=true;
          } */
          let feat = features.filter((el)=>el.getProperty('id')===data.host)[0];
          let host = data.host;
          if(feat){
            // Do something with the feature => update ICon
            //https://freiburg-staging.dksr.city/UrbanPulseData/historic/sensordata?sid=d11f7e88-7021-4a79-aac5-454a7164da36
            //axios.get('https://freiburg-staging.dksr.city/UrbanPulseData/historic/sensordata?sid=5663e4ed-f578-4513-806d-b7ce88c10fd7', {timeout: 2 * 60 * 1000, headers: {'content-type': 'application/json'},auth: {username: user,password: pass}}).then((resp)=>{
              axios.get('https://freiburg-staging.dksr.city/UrbanPulseData/historic/sensordata?sid=d11f7e88-7021-4a79-aac5-454a7164da36', {timeout: 2 * 60 * 1000, headers: {'content-type': 'application/json'},auth: {username: user,password: pass}}).then((resp)=>{
              if(!first){

                console.log(resp.data.sensordata[0]);
                console.log(data);
                console.log(feat);
                first=true;
              }
              let icon = getIcon(host,resp.data.sensordata[0]);
              var styleSelected = new ol.style.Style({
                image: new ol.style.Icon({
                  scale:1,
                  src: `data:image/svg+xml,${encodeURIComponent(icon)}`,
                }),
              });
              feat.setStyle(styleSelected);
              feat.changed();
              if(!layer.active){
                layer.activate();
              }
            })
          }
        }; 
        features.forEach((feat) => {
          feat.changed();
        });
      });
    });
    //console.log(ws);
    return Promise.resolve(ws);
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
function connectCams() {
  return new Promise(function(resolve, reject) {
    const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
    var wsURL = uiConfig['wsCamURL'];
    let ws = new WebSocket(wsURL);
    ws.onopen = function() {
        count=0;
        resolve(ws);
    };
    ws.onerror = function(err) {
      if(count<5){
        setTimeout(function() {
          count+=1;
          console.log(count+ '. Versuch die Verbindung zum live Kamerastream zu etablieren! ' + (5-count) +' Versuche verbleiben...');
          connect();
        }, 1000);
      }else{
        console.log('Connection to live cam stream not possible. Even after 5 retries no connection established!');
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