<template>
    <article class="message" :class="accordionClasses">
      <div class="message-header" > <i class="fa fa-clock-o" aria-hidden="true"></i> <i class="fa fa-video-camera" aria-hidden="true"></i>
        historische Kamera(s)
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
          <p><small><i class="fa fa-info-circle" aria-hidden="true" ></i> Auf ein Kameraicon in der Karte clicken um diese zu selektieren!</small></p>
          <div>
            <h4>Startdatum:</h4>
            <input type="datetime-local" id="startDate" name="start" style="width:100%" v-model="start">
          </div>
          <div>
            <h4>Enddatum:</h4>
            <input type="datetime-local" id="endDate" name="ende" style="width:100%" v-model="end">
          </div>
          <button class="send-button" title="Durch Click wird die Aufnahme der oben ausgewählten Kameras gestartet." @click="startRequest()"><i class="fa fa-paper-plane" aria-hidden="true" ></i> Anfrage starten</button>
          <div class="container" v-for="(object, i) in cams" :key="i">
            <img v-if="!dev" :src="object.url" alt="Hier sollte ein Bild sein" style="width:280px;">
            <img v-if="dev" src="/global/Freiburg_Traffic/test.png" alt="Hier sollte ein Bild sein" style="width:280px;">
            <div class="bottom-right" style="background-color: white; opacity: 0.6; padding: 2px;">{{object.name}}</div>
            <span class="vcm-btn-icon pop-out top-right2" @click="popOut(object,i)" title="Kamera vom Menü lösen..." style="cursor: pointer; pointer-events:auto;"/>
            <span @click="remove(object)" class="vcm-btn-icon closing top-right" title="Kamera aus Liste der Live-Kameras entfernen..." style="cursor: pointer; pointer-events:auto;"></span>
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
.send-button {
  width: 98%;
  display: block;
  color: #fff;
  margin-left:4px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: #409d76;
}
.send-button:hover {
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
    name: 'historicCamera',  
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
    mounted() {
      this.unwatch=this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);
         this.isOpen=this.$store.state.traffic_freiburg.open==='historicCamera'?true:false;
        }
      )
    },
    data() {
      return {
        isOpen: this.$store.state.traffic_freiburg.open==='historicCamera'?true:false,
        cams: this.$store.state.traffic_freiburg.activeHistoricCams,
        unwatch:'',
        start:'',
        end:'',
        layer:'',
        itemsToRequest:[],
      }
    },
    watch: {
      isOpen: function(val){
        if(val){
          const [date, time] =this.formatDate(new Date()).split(' ');
          this.start = date + 'T' + time;
          this.end=date + 'T' + time;
          var layerName = uiConfig['kameraLayer'];
          this.layer = framework.getLayerByName(layerName); //var layer
          if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
          if(this.layer && !this.layer.active){
            this.layer.activate();
          }
          var vm = this;
          const interaction = new clickInteraction((feature) => { 
            if(feature.hasOwnProperty("values_")){
              if(feature['values_']['url']){
                let props = feature['values_'];
                var res=vm.$store.state.traffic_freiburg.flHistoricCams.filter((el)=>el.id===props.id);
                var res1=vm.$store.state.traffic_freiburg.activeHistoricCams.filter((el)=>el.id===props.id);
                if(vm.cams.length<2 && res.length ===0 && res1.length===0){
                  vm.cams.push(props);
                  //vm.itemsToRequest.push({id:feature.getId(),camId:props.id});
                  vm.$store.state.traffic_freiburg.selectedHistoricCams.push({id:feature.getId(),camId:props.id});
                }else if(res.length===0 && res1.length===0){
                  vm.cams.shift();
                  //vm.itemsToRequest.shift();
                  vm.$store.state.traffic_freiburg.selectedHistoricCams.shift();
                  vm.cams.push(props);
                  //vm.itemsToRequest.push({id:feature.getId(),camId:props.id});
                  vm.$store.state.traffic_freiburg.selectedHistoricCams.push({id:feature.getId(),camId:props.id});
                }else{
                  toastr["error"]('Die Kamera wird bereits auf dem Bildschirm angezeigt!');
                }
                //console.log(vm.cams);
                vm.$store.state.traffic_freiburg.activeHistoricCams=vm.cams;
                vm.$forceUpdate();
              }
            }
          });
          this.itemsToRequest= this.$store.state.traffic_freiburg.selectedHistoricCams;
          vcs.vcm.Framework.getInstance().eventHandler.addExclusiveInteraction(interaction, () => { console.log('Exclusive click interaction for cams removed');});
        }else if(!val && this.$store.state.traffic_freiburg.open==='historicCamera'){
          this.unwatch();
          vcs.vcm.Framework.getInstance().eventHandler.removeExclusive();
        }
      },
      itemsToRequest: function (val, oldval) {
        if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
        var styleSelected = new ol.style.Style({
          image: new ol.style.Icon({
            scale:1,
            src: 'global/Freiburg_Traffic/cam_selected.png',
          }),
        });
        this.itemsToRequest.forEach((el) => {
            this.layer.featureVisibility.highlight({
                [el.id]: styleSelected
            });
        });
      }
    },    
    methods:{ 
      toggleAccordion: function() {
          this.isOpen = !this.isOpen;
          if(this.isOpen){
            this.$store.state.traffic_freiburg.open='historicCamera';
          }else if(!this.isOpen){
            this.$store.state.traffic_freiburg.open='';
          }
      },
      padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      },
      formatDate(date) {
        return (
          [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
          ].join('-') +
          ' ' +
          [
            this.padTo2Digits(date.getHours()),
            this.padTo2Digits(date.getMinutes()),
            // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
          ].join(':')
        );
      },
      startRequest(){
        let recPost={};
        recPost.startTime=this.start;
        recPost.endTime=this.end;
        recPost.idList=this.cams.map((el)=>el.id);
        recPost.requestedItems=10;
        recPost.metadata={
          startTime:'isostring',
          endTime:'isostring',
          idList:'array'
        }
        //recPost.camIds=this.cams.map((el)=>el.id);
        toastr["info"]('Die Anfrage an das Backend wurde gesendet, mit folgenden Angaben: '+JSON.stringify(recPost) + '\n');
        if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
      }, 
      popOut(object,index) {
        // `this` inside methods points to the Vue instance
        if(this.$store.state.traffic_freiburg.flHistoricCams.length<3){
          var res=this.$store.state.traffic_freiburg.flHistoricCams.filter((el)=>el.id===object.id);
          if(res.length===0){
            this.$store.state.traffic_freiburg.flHistoricCams.push(object);
            this.remove(object,true);
          }
        }
      },
      remove(o,popout=false){
        let index = this.$store.state.traffic_freiburg.activeHistoricCams.findIndex(x => x.id ===o.id);
        if(index!=-1){
          //this.cams.splice(index, 1);
          if(!popout){
            this.$store.state.traffic_freiburg.selectedHistoricCams.splice(index,1);
          }
          this.$store.state.traffic_freiburg.activeHistoricCams.splice(index, 1);
          this.cams=this.$store.state.traffic_freiburg.activeHistoricCams;
        }
      }                              
    }
}
</script>