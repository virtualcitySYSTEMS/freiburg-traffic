<template>
    <article class="message" :class="accordionClasses">
      <div class="message-header" > <i class="fa fa-podcast" aria-hidden="true"></i>
        Live Verkehr
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
        <iframe v-if="!connected" src="https://pilot.dksr.city/OutboundInterfaces/outbound/inrixFreiburgDataEventTypeStatement" title="Websocket"></iframe>
        <div style="display: inline-block; margin-top: 1rem;">
            <p style="display: inline; line-height: 1.4rem;">Live Verkehr</p>
            <toggle-button :value="enabled" :sync="true" color="#82C7EB" :width="60" :labels="{checked: 'Live', unchecked: 'Aus'}" @change="activateLive()" style="float:right; margin-left: 1rem"/>
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
</style>


<script type="text/babel">

const framework = vcs.vcm.Framework.getInstance();
import { ToggleButton } from 'vue-js-toggle-button';
import { activateWSLayer } from '../../src/live.js'
export default {
    i18n: {
    messages: {
      de: {

      },
      en: {
      },
    },
  },
    name: 'liveTraffic',  
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
      isOpen:function(val, oldval){
        if(val){
          this.activateLive();
        }else{
          this.unwatch();
        }
      }
    },
    created() {
      if(this.isOpen){
        this.activateLive();
      }
      this.unwatch=this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);
         this.isOpen=this.$store.state.traffic_freiburg.open==='liveTraffic'?true:false;
        }
      )
    },
    data() {
      return {
        isOpen: this.$store.state.traffic_freiburg.open==='liveTraffic'?true:false,
        enabled:this.isOpen,
        unwatch:'',

      }
    },
    methods:{ 
      toggleAccordion: function() {
          this.isOpen = !this.isOpen;
          this.activateLive();
      },
      activateLive(){
          if(this.isOpen){
            var vm = this;
            activateWSLayer().then((resp)=>{
              vm.connected = resp;
              this.enabled=resp;
              vm.$forceUpdate();
            });
            this.$store.state.traffic_freiburg.open='liveTraffic';
          }else{
            this.$store.state.traffic_freiburg.open='';
          }
      }, 
    }
}
</script>