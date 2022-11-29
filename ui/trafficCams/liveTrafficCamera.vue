<template>
    <article class="message" :class="accordionClasses">
      <div class="message-header" > <i class="fa fa-podcast" aria-hidden="true"></i> <i class="fa fa-video-camera" aria-hidden="true"></i>
        Live Verkehrskamera(s)
        <i
          class="fa fa-caret-down"
          aria-hidden="true"
          style="float:right; margin-top: 0.2rem"
          v-if="!isOpen"
          @click="toggleAccordion"
        ></i>
        <i
          class="fa fa-caret-up"
          aria-hidden="true"
          style="float:right; margin-top: 0.2rem"
          v-if="isOpen"
          @click="toggleAccordion"
        ></i>
      </div>
      <div class="message-body">
        <div class="message-content">
          <p v-if="!connected && enabled" style="margin-right: 1.2rem;">Um Zugang zu den Livedaten zu bekommen müssen sie Username und Passwort eingeben, damit der gesicherte Zugang ermöglicht wird. Nach erfolgreicher Eingabe der Daten können Sie den Live Verkehr anschalten und nach Erhalt der ersten Datenpakete verschwindet das IFrame Feld und Daten fließen periodisch in die Anwendung! </p>
          <p v-if="connected" style="margin-right: 1.2rem;">Die Verbindung zu den Live Verkehrsdaten wurde erfolgreich hergestellt! Die Daten fließen jetzt periodisch in die Anwendung und werden verarbeitet.</p>
          <p v-if="!connected && !enabled" style="margin-right: 1.2rem; color:red"><small>Die Verbindung zu den Live Daten konnte nicht hergestellt werden. Bitte versuchen sie es später noch einmal.</small></p>
          <iframe v-if="!connected" src="https://freiburg-staging.dksr.city/OutboundInterfaces/outbound/FreiCameraVehicleIdEventTypeStatement" title="Websocket"></iframe>
          <div style="display: inline-block; margin-top: 1rem;">
              <p style="display: inline; line-height: 1.4rem;">Live Verkehrskameras</p>
              <toggle-button :value="enabled" :sync="true" color="#82C7EB" :width="60" :labels="{checked: 'Live', unchecked: 'Aus'}" @change="activateCamsLive()" style="float:right; margin-left: 1rem"/>
          </div>      
        </div>
      </div>
    </article>
</template>
<style scoped>
.message {
  /*max-width: 60rem;*/
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.message-header {
  cursor: pointer;
  background-color: #555555;
  color: white;
  padding: 0.5rem;
}
.message-body {
  padding: 0;
  max-height: 35rem;
  overflow: auto;
  transition: 0.3s ease all;
  border-color: #555555;
}
.is-closed .message-body {
  max-height: 0;
}
.message-content {
  padding: 0.5rem;
  border-color: #555555;
  color: #444444;
  border: outset;
  margin-bottom: 0.5rem;
  max-height: fit-content;
}
/* Container holding the image and the text */
.container {
  position: relative;
  text-align: center;
  color: crimson;

}

.rec-button {
  width: 98%;
  display: block;
  color: #fff;
  margin-left:4px;
  margin-bottom: 0.5rem;
  background-color: #409d76;
}
.rec-button:hover {
  color: dimgray;
  background-color: #fff;
}
.rec-stop-button {
  width: 98%;
  display: block;
  color: #fff;
  margin-left:4px;
  margin-bottom: 0.5rem;
  background-color: #a00a05;
}
.rec-stop-button:hover {
  color: dimgray;
  background-color: #fff;
}
img {
  border-style: solid;
  border-color: #555555;
}
/* Bottom left text */
.bottom-left {
  position: absolute;
  bottom: 8px;
  left: 16px;
}

/* Top left text */
.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

/* Top right text */
.top-right {
  position: absolute;
  top: 7px;
  right: 20px;
}
.top-right2 {
  position: absolute;
  top: 8px;
  right: 44px;
}
.top-right3 {
  position: absolute;
  top: 8px;
  right: 64px;
}

/* Bottom right text */
.bottom-right {
  position: absolute;
  bottom: 8px;
  right: 12px;
}

/* Centered text */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.pop-out::before {
    content: "\f09c";
}
.pop-out{
  color: #555555;
}
.pop-out:hover {
  color: crimson;
}
.closing::before {
    content: "\f00d";
}
.closing {
    color: #555555;
}
.closing:hover {
  color: crimson;
}

.recording {
	width: 8px;
	height: 8px;
	font-size: 0;
	background-color: red;
	border: 0;
	border-radius: 8px;
	margin-top: 3px;
  margin-right: 10px;
	outline: none;
}
.Rec{
	animation-name: pulse;
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

@keyframes pulse{
	0%{
		box-shadow: 0px 0px 5px 0px rgba(173,0,0,.3);
	}
	65%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,.3);
	}
	90%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,0);
	}
}
</style>


<script type="text/babel">

const framework = vcs.vcm.Framework.getInstance();
import { ToggleButton } from 'vue-js-toggle-button';
import toastr from 'toastr';
import clickInteraction from "../../src/clickInteraction";
const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
import {icon, getIcon} from '../../src/helpers'
import { activateWSCameraLayer } from '../../src/live.js'
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "showDuration": "1000",
  "hideDuration": "1000",
  "tapToDismiss" :true,
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
export default {
    i18n: {
    messages: {
      de: {

      },
      en: {
      },
    },
  },
    name: 'liveTrafficCamera',  
    props:{
    },
    components: {
         ToggleButton
    },
    computed:{
      accordionClasses: function() {
          return {
              "is-closed": !this.isOpen,
          };
      },
    },
    watch: {
    },
    mounted() {
      this.dev = uiConfig['dev'];
      var layerName = uiConfig['kameraLayer'];
      this.layer = framework.getLayerByName(layerName);
      let icon1 = getIcon()
      var styleSelected = new ol.style.Style({
        image: new ol.style.Icon({
          scale:1,
          src: `data:image/svg+xml,${encodeURIComponent(icon1)}`,
        }),
      });
      let features=this.layer.source.getFeatures();
      features.forEach((feat)=>{
       // feat.setStyle(styleSelected);
       // feat.changed();
      });
      this.layer.activate();
      this.unwatch=this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);

         this.isOpen=this.$store.state.traffic_freiburg.open==='liveTrafficCamera'?true:false;
        }
      )
    },
    data() {
      return {
          isOpen: this.$store.state.traffic_freiburg.open==='liveTrafficCamera'?true:false,
          dev:false,
          layer:'',
          unwatch:'',
      }
    },
    methods:{ 
      toggleAccordion: function() {
          this.isOpen = !this.isOpen;
          if(this.isOpen){
            this.$store.state.traffic_freiburg.open='liveTrafficCamera';
            this.activateCamsLive();
          }else if(!this.isOpen){
            this.$store.state.traffic_freiburg.open='';
          }
      },
      activateCamsLive(){
        //console.log(this.enabled);
          if(this.isOpen && !this.enabled){
            let layer = framework.getLayerByName(uiConfig['kameraLayer']);
            if(layer){
/*               var styleSelected = new ol.style.Style({
                  image: new ol.style.Icon({
                    scale:1,
                    src: `data:image/svg+xml,${encodeURIComponent(icon)}`,
                  }),
                }); */
                var styleSelected = new ol.style.Style({
                  image: new ol.style.Icon({
                    scale:1,
                    src: `data:image/svg+xml,${encodeURIComponent(getIcon())}`,
                  }),
                });
                let features=layer.source.getFeatures();
                features.forEach((feat)=>{
                  feat.setStyle(styleSelected);
                  feat.changed();
              });
              if(layer.active){
                this.activation(layer);
              }else{
                layer.activate();
              }
            }else{
              //layer not found
              throw new Error('Layer, wie in der config unter "Kameras" angegeben, konnte nicht gefunden werden!');
            }
          }else{
            this.enabled=false;
            if(this.ws!=''){
              this.ws.close();
              this.ws.onclose = function(err) {
                console.log('Connection to live stream will be closed!');
              };
            }
          }
      },
      activation(layer){
        let vm = this;
        activateWSCameraLayer(layer).then((resp)=>{
          vm.ws = resp;
          vm.connected = resp;
          vm.enabled=true;
          vm.$forceUpdate();
        });
        this.$store.state.traffic_freiburg.open='liveTrafficCamera';
      }      
    },
    destroyed() {
      this.unwatch();
      vcs.vcm.Framework.getInstance().eventHandler.removeExclusive();
    },
}
</script>