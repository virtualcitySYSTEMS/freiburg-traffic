<template>
    <article class="message" :class="accordionClasses">
      <div class="message-header" > <i class="fa fa-clock-o" aria-hidden="true"></i>
        historischer Verkehr
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
          <div>
              <p><small><i class="fa fa-info-circle" aria-hidden="true" ></i> Auf Straßensegmente in der Karte clicken um diese zu selektieren!</small></p>
              <div v-if="itemList.length > 0" style="height: 7rem; overflow-y: auto; overflow-x: hidden;">
                <!--label class="" style="width:90%">Alle löschen?</label>
                <input class="" type="checkbox" style="width:12px; height:12px; top:0px;" v-model="deleteAll" @change="deleteAllItems"-->
                <div>
                  <input type="checkbox" id="delete" name="delete" v-model="deleteAll" @change="deleteAllItems">
                  <label for="delete"> Alle löschen?</label><br>
                </div>
                <div v-for="(i,index) in itemList" :key="index" v-on:mouseover="mouseoverItem(index)" v-on:mouseleave="mouseleaveItem()">
                  <b>{{ i }}</b>
                  <i class="fa fa-trash" aria-hidden="true" @click="removeItem(index)" style="display: inline-block; float: right; margin-right: 0.5rem;"></i>
                </div>
              </div>
              <div>
                <h4>Startdatum:</h4>
                <input type="datetime-local" id="startDate" name="start" style="width:100%" v-model="start">
              </div>
              <div>
                <h4>Enddatum:</h4>
                <input type="datetime-local" id="endDate" name="ende" style="width:100%" v-model="end">
              </div>
              <button class="send-button" title="Durch Click wird die Aufnahme der oben ausgewählten Kameras gestartet." @click="startRequest()"><i class="fa fa-paper-plane" aria-hidden="true" ></i> Anfrage starten</button>
              <!--toggle-button :value="false" :disabled="live" color="#82C7EB" :width="80" :labels="{checked: 'Historisch', unchecked: 'Aus'}" @change="activateHistoric()" style="float:right; margin-left: 1rem"/-->
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
.send-button {
  width: 100%;
  display: block;
  color: #fff;
  margin-left:0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: #409d76;
}
.send-button:hover {
  color: dimgray;
  background-color: #fff;
}
</style>


<script type="text/babel">

const framework = vcs.vcm.Framework.getInstance();
const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
import { ToggleButton } from 'vue-js-toggle-button';
import toastr from 'toastr';
import clickInteraction from "../../src/clickInteraction";
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
    name: 'historicTraffic',  
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
    created(){
    },
    mounted() {
      this.unwatch=this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);
         this.isOpen=this.$store.state.traffic_freiburg.open==='historicTraffic'?true:false;
         if(this.isOpen){
/*           document.getElementById('startDate').defaultValue = start;
          document.getElementById('endDate').defaultValue = start; */           
         }else{
            if (this.listener) {
              vcs.vcm.Framework.getInstance().unsubscribeByKey(this.listener);
            }
          }
        });

    },
    data() {
      return {
        isOpen: this.$store.state.traffic_freiburg.open==='historicTraffic'?true:false,
        start:'',
        end:'',
        itemList:[],
        itemsToRequest:[],
        layer:'',
        deleteAll:false,
        unwatch:'',
      }
    },
    watch: {
      isOpen: function(val){
        if(val){
          const [date, time] =this.formatDate(new Date()).split(' ');
          this.start = date + 'T' + time;
          this.end=date + 'T' + time;
          let layerName = uiConfig['trafficLayer'];
          this.layer = framework.getLayerByName(layerName); //var layer
          if (this.layer != "") {
            if(this.layer.hasOwnProperty("featureVisibility")){
              this.layer.featureVisibility.clearHighlighting();
            }
          }
          if(this.layer && !this.layer.active){
            this.layer.activate();
          }
          let vm = this;
          const interaction = new clickInteraction((feature) => { 
            if(feature.hasOwnProperty("values_")){
              if(feature['values_']['code']){
                let props = feature['values_'];
                if(vm.itemList.length <50){
                  vm.itemList.push(props.code);
                  vm.itemsToRequest.push(feature.getId());
                  vm.itemsToRequest= [...new Set(vm.itemsToRequest)];
                  vm.itemList= [...new Set(vm.itemList)];
                }else{
                  toastr["error"]('Zu viele Straßensegmente für die Anfrage ausgewählt. Die Begrenzung liegt bei 50 Straßensegmenten\n');
                }
              }
            }
          });
          vcs.vcm.Framework.getInstance().eventHandler.addExclusiveInteraction(interaction, () => { console.log('Exclusive click interaction removed');});
/*           if(!this.listener){
            this.listener = vcs.vcm.Framework.getInstance().subscribe("FEATURE_CLICKED", (id, object, l) => {
                //console.log(object);
                if(this.layer.name===l.name){
                  let props = object.getProperties();
                  if(vm.itemList.length <50){
                    vm.itemList.push(props.code);
                    vm.itemsToRequest.push(id);
                    vm.itemsToRequest= [...new Set(vm.itemsToRequest)];
                    vm.itemList= [...new Set(vm.itemList)];
                    console.log(vm.itemList);
                  }else{
                    toastr["error"]('Zu viele Straßensegmente für die Anfrage ausgewählt. Die Begrenzung liegt bei 50 Straßensegmenten\n');
                  }
                }
              });
            } */
        }else if(!val){
          this.unwatch();
          vcs.vcm.Framework.getInstance().eventHandler.removeExclusive();
        }
      },
      itemsToRequest: function (val, oldval) {
          if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
          var style = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [193, 6, 193, 1],
                  width: 12,
              }),
          });
          this.itemsToRequest.forEach((id) => {
              this.layer.featureVisibility.highlight({
                  [id]: style
              });
          });
      }
    },
    methods:{ 
      toggleAccordion: function() {
          this.isOpen = !this.isOpen;
          if(this.isOpen){
            this.$store.state.traffic_freiburg.open='historicTraffic';
          }else if(!this.isOpen){
            this.$store.state.traffic_freiburg.open='';
          }
      },
      mouseoverItem: function (index) {
          this.layer.featureVisibility.clearHighlighting();
          var style = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [193, 0, 0, 1],
                  width: 20,
              })
          });
          var style1 = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [193, 6, 193, 1],
                  width: 12,
              }),
          });
          var vm = this;
          this.itemsToRequest.forEach((id, idx) => {
              if(index===idx){
                  vm.layer.featureVisibility.highlight({
                      [id]: style
                  });
              }else{
                    vm.layer.featureVisibility.highlight({
                      [id]: style1
                  });
              }
          });
      },
      mouseleaveItem: function () {
          this.layer.featureVisibility.clearHighlighting();
          var style = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: [193, 6, 193, 1],
                  width: 12,
              }),
          });
          this.itemsToRequest.forEach((id) => {
              this.layer.featureVisibility.highlight({
                  [id]: style
              });
          });
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
        recPost.idList=this.itemList;
        recPost.requestedItems=10;
        recPost.metadata={
          startTime:'isostring',
          endTime:'isostring',
          idList:'array'
        }
        //recPost.camIds=this.cams.map((el)=>el.id);
        toastr["info"]('Die Anfrage an das Backend wurde gesendet, mit folgenden Angaben: '+JSON.stringify(recPost) + '\n');
        if (this.layer != "") {this.layer.featureVisibility.clearHighlighting();}
        this.itemList=[];
        this.itemsToRequest=[];
      },
      removeItem(index){
        this.itemList.splice(index,1);
        this.itemsToRequest.splice(index,1);
      },
      deleteAllItems(){
        if(this.deleteAll){
          this.itemList=[];
          this.itemsToRequest=[];
          this.deleteAll=false;
        }
      }
    }
}
</script>

