import {getVcsFramework} from './getFramework';

const framework=getVcsFramework();

//var exampleSocket = new WebSocket("wss://pilot.dksr.city/OutboundInterfaces/outbound/inrixFreiburgDataEventTypeStatement?vsRealTimeMapReader=Ghkjhd565!bt-93!");
//var client = Stomp.over('wss://pilot.dksr.city/OutboundInterfaces/outbound/inrixFreiburgDataEventTypeStatement');
/*exampleSocket.onmessage = function (event) {
  console.log(event.data);
}*/
var user = "vsRealTimeMapReader";
var pass = "Ghkjhd565!bt-93!";
var httpsUrl = 'https://pilot.dksr.city/OutboundInterfaces/outbound/inrixFreiburgDataEventTypeStatement';
var wssUrl = 'wss://pilot.dksr.city/OutboundInterfaces/outbound/inrixFreiburgDataEventTypeStatement';

var authorizationBasic = window.btoa(user + ':' + pass);
var config = {
  "headers": {
    "Authorization": "Basic " + authorizationBasic
  }
};