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
  height: 25rem;
}
</style>


<script type="text/babel">

const framework = vcs.vcm.Framework.getInstance();
import { ToggleButton } from 'vue-js-toggle-button';
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
    created() {
      this.$store.watch(
        (state)=>{
          //console.log(this.$store.state.traffic_freiburg.open);
         this.isOpen=this.$store.state.traffic_freiburg.open==='historicCamera'?true:false;
        }
      )
    },
    data() {
      return {
        isOpen: this.$store.state.traffic_freiburg.open==='historicCamera'?true:false,
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
    }
}
</script>