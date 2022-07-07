<template>
    <article class="message" :class="accordionClasses">
      <div class="message-header" > <i class="fa fa-podcast" aria-hidden="true"></i> <i class="fa fa-video-camera" aria-hidden="true"></i>
        Live Kamera(s)
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
            <p style="margin: 0.5rem;"><small style="line-height: 1 !important;"> <i class="fa fa-info-circle" aria-hidden="true" ></i>Bitte selektieren sie per click auf ein Kameraicon, die Kameras die sie sehen wollen. Bis zu 3 Kameras können gleichzeitig angezeigt werden!</small></p>
            <button v-if="cams.length > 0" class="rec-button" title="Durch Click wird die Aufnahme der oben ausgewählten Kameras gestartet." @click="startRecord()"><i class="fa fa-video-camera" aria-hidden="true" ></i> Aufnahme für alle Kameras starten</button>
            <div class="container" v-for="(object, i) in cams" :key="i">
              <img v-if="!dev" :src="object.url" alt="Hier sollte ein Bild sein" style="width:280px;">
              <img v-if="dev" src="/global/Freiburg_Traffic/test.png" alt="Hier sollte ein Bild sein" style="width:280px;">
              <div class="bottom-right" style="background-color: white; opacity: 0.6; padding: 2px;">{{object.name}}</div>
              <button v-if="records.includes(object.id)" class="recording Rec top-right3"></button>
              <span class="vcm-btn-icon pop-out top-right2" @click="popOut(object,i)" title="Kamera vom Menü lösen..." style="cursor: pointer; pointer-events:auto;"/>
              <span @click="remove(i)" class="vcm-btn-icon closing top-right" title="Kamera aus Liste der Live-Kameras entfernen..." style="cursor: pointer; pointer-events:auto;"></span>
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
  max-height: 55rem;
  overflow: hidden;
  transition: 0.3s ease all;
  border-color: #555555;
}
.is-closed .message-body {
  max-height: 0;
}
.message-content {
  padding: 0 0.5rem 0.5rem 0.5rem;
  border-color: #555555;
  color: #444444;
  border: outset;
  margin-bottom: 1rem;
  max-height: 650px;
}
/* Container holding the image and the text */
.container {
  position: relative;
  text-align: center;
  color: crimson;

}
.rec-button {
  width: 92%;
  display: block;
  color: #fff;
  margin-left:12px;
  background-color: #409d76;
}
.rec-button:hover {
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
    name: 'liveCamera',  
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
      itemsToRequest: function (val, oldval) {
        if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
        var styleSelected = new ol.style.Style({
          image: new ol.style.Icon({
            scale:1,
            src: 'global/Freiburg_Traffic/cam_selected.png',
          }),
        });
/*         var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [193, 6, 193, 1],
                width: 12,
            }),
        }); */
        this.itemsToRequest.forEach((el) => {
            this.layer.featureVisibility.highlight({
                [el.id]: styleSelected
            });
        });
      }
    },
    mounted() {
      this.dev = uiConfig['dev'];
      this.unwatch=this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);
         this.isOpen=this.$store.state.traffic_freiburg.open==='liveCamera'?true:false;
         if(this.isOpen){
          var layerName = uiConfig['kameraLayer'];
          this.layer = framework.getLayerByName(layerName);
          if(this.layer && !this.layer.active){
            this.layer.activate();
          }
          var vm = this;
          const interaction = new clickInteraction((feature) => { 
            if(feature.hasOwnProperty("values_")){
              if(feature['values_']['url']){
                let props = feature['values_'];
                var res=this.$store.state.traffic_freiburg.flLiveCams.filter((el)=>el.id===props.id);
                var res1=this.$store.state.traffic_freiburg.activeCams.filter((el)=>el.id===props.id);
                if(vm.cams.length<3 && res.length ===0 && res1.length===0){
                  vm.cams.push(props);
                  vm.itemsToRequest.push({id:feature.getId(),camId:props.id});
                }else if(res.length===0 && res1.length===0){
                  vm.cams.shift();
                  vm.itemsToRequest.shift();
                  vm.cams.push(props);
                  vm.itemsToRequest.push({id:feature.getId(),camId:props.id});
                }else{
                  toastr["error"]('Die Kamera wird bereits auf dem Bildschirm angezeigt!');
                }
                //console.log(vm.cams);
                vm.$store.state.traffic_freiburg.activeCams=vm.cams;
                vm.$forceUpdate();
              }
            }
          });
          vcs.vcm.Framework.getInstance().eventHandler.addExclusiveInteraction(interaction, () => { console.log('Exclusive click interaction for cams removed');});
/*           if(!this.listener){
            this.listener = vcs.vcm.Framework.getInstance().subscribe("FEATURE_CLICKED", (id, object, layer) => {
                //console.log(object);
                let props = object.getProperties();
                delete props['geometry'];
                var res=this.$store.state.traffic_freiburg.flLiveCams.filter((el)=>el.id===props.id);
                var res1=this.$store.state.traffic_freiburg.activeCams.filter((el)=>el.id===props.id);
                if(vm.cams.length<3 && res.length ===0 && res1.length===0){
                  vm.cams.push(props);
                }else if(res.length===0 && res1.length===0){
                  vm.cams.shift();
                  vm.cams.push(props);
                }else{
                  toastr["error"]('Die Kamera wird bereits auf dem Bildschirm angezeigt!');
                }
                console.log(vm.cams);
                vm.$store.state.traffic_freiburg.activeCams=vm.cams;
                vm.$forceUpdate();
              });
            }*/
          }else{
            vcs.vcm.Framework.getInstance().eventHandler.removeExclusive();
          }
        }
      )
    },
    data() {
      return {
        isOpen: this.$store.state.traffic_freiburg.open==='liveCamera'?true:false,
        cams: this.$store.state.traffic_freiburg.activeCams,
        itemsToRequest:[],
        records:this.$store.state.traffic_freiburg.records,
        recording:false,
        dev:false,
        layer:'',
        cameras:[{cam:1, url:'https://via.placeholder.com/280x150'},{cam:2, url:'https://via.placeholder.com/280x150'},{cam:3, url:'https://via.placeholder.com/280x150'}
        ]
      }
    },
    methods:{ 
      toggleAccordion: function() {
          this.isOpen = !this.isOpen;
          if(this.isOpen){
            this.$store.state.traffic_freiburg.open='liveCamera';
          }else if(!this.isOpen){
            this.$store.state.traffic_freiburg.open='';
          }
      },
      startRecord(){
        let recPost={};
        recPost.startTime=new Date().toISOString;
        recPost.duration=10;
        recPost.metadata={
          startTime:'isostring',
          duration:'minutes'
        }
        recPost.camIds=this.cams.map((el)=>el.id);
        this.$store.state.traffic_freiburg.records=recPost.camIds;
        this.records = recPost.camIds;
        this.records = [...new Set(this.records)];
        this.$store.state.traffic_freiburg.records=this.records;
        //this.recording=true;
        toastr["info"]('Kameraaufzeichung wurde an Backend gesendet, mit folgenden Angaben: '+JSON.stringify(recPost) + '\n');
      },
      popOut(object,index) {
        // `this` inside methods points to the Vue instance
        if(this.$store.state.traffic_freiburg.flLiveCams.length<3){
          var res=this.$store.state.traffic_freiburg.flLiveCams.filter((el)=>el.id===object.id);
          if(res.length===0){
            this.$store.state.traffic_freiburg.flLiveCams.push(object);
            this.remove(index,true);
          }
        }
      },
      remove(index,popout=false){
        this.cams.splice(index, 1);
        if(!popout){
          this.itemsToRequest.splice(index,1);
        }
        
        this.$store.state.traffic_freiburg.activeCams=this.cams;
      }           
    },
    destroyed() {
      this.unwatch();
      vcs.vcm.Framework.getInstance().eventHandler.removeExclusive();
     /*  if (this.listener) {
          vcs.vcm.Framework.getInstance().unsubscribeByKey(this.listener);
      } */
    },
}
</script>