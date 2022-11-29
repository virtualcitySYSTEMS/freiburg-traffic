<template>
    <Draggable
    :x=x
    :y=y
    :w="width"
    :h="height"
    :z="25"
    :draggable=true
    :resizable=true
    style="background-color:#97999b"
    class="vcm-base-dye01"
    :lock-aspect-ratio="false"
    @resizing="onResize" @resizestop="onResizeStop"
    :handles="['tl','tr','br','bl']"
  >
    <div
      :id="`${container}`"
    >
      <div class="scroll-spacer">
        <SubButton
          @click="close(object)"
          class="close vcm-btn-icon cancel-icon"
          title="Kamera aus Liste der Live-Kameras entfernen..."
          style="z-index: 999;"
        ></SubButton>
        <SubButton class="vcm-btn-icon pop-out top-right2" @click="dock(object)" title="Kamera an Menü andocken..." style="cursor: pointer; pointer-events:auto; z-index: 999;"/>
        <div v-if="object.url">
          <img v-if="!dev" :src="object.url" alt="Hier sollte ein Bild sein" :height="height"/>
          <img v-if="dev" src="/global/Freiburg_Traffic/test.png" alt="Hier sollte ein Bild sein" :height="height"/>
        </div>
        <div v-else class="diagram-div" :id="'cam-'+object.id.replaceAll('.','-')" style="height:280px;"></div>
        <div class="bottom-right" style="background-color: white; opacity: 0.6; padding: 2px;">{{object.name}}</div>
        <!--button v-if="recording" class="recording Rec top-right3"></button-->
        <!--span @click="remove(i)" class="vcm-btn-icon closing top-right" title="Kamera entfernen..." style="cursor: pointer; pointer-events:auto;"></span-->
      </div>
    </div>
  </Draggable>
</template>

<style scoped>
.bottom-right {
  position: absolute;
  bottom: 8px;
  width:100%;
  text-align: right;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border: none;
  text-align: center;
}

.vdr {
  touch-action: none;
  position: absolute;
  box-sizing: border-box;
  border: 1px solid #97999B;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  width: 10px;
  height: 10px;
  background: #eee;
  border: 1px solid #333;
}

.handle-tl {
  top: -10px;
  left: -10px;
  cursor: nw-resize;
}

.handle-tm {
  top: -10px;
  left: 50%;
  margin-left: -5px;
  cursor: n-resize;
}

.handle-tr {
  top: -10px;
  right: -10px;
  cursor: ne-resize;
}

.handle-ml {
  top: 50%;
  margin-top: -5px;
  left: -10px;
  cursor: w-resize;
}

.handle-mr {
  top: 50%;
  margin-top: -5px;
  right: -10px;
  cursor: e-resize;
}

.handle-bl {
  bottom: -10px;
  left: -10px;
  cursor: sw-resize;
}

.handle-bm {
  bottom: -10px;
  left: 50%;
  margin-left: -5px;
  cursor: s-resize;
}

.handle-br {
  bottom: -10px;
  right: -10px;
  cursor: se-resize;
}
.pop-out::before {
    content: "\f023";
}
.pop-out{
  color: #555555;
}
.pop-out:hover {
  color: crimson;
}
.top-right2 {
  position: absolute;
  top: 0;
  right: 24px;
	/* font-size: 1em; */
/* 	margin-top: 3px; */
  text-align: center;
  margin-right: 5px;
	outline: none;
}
.recording {
	width: 8px;
	height: 8px;
  position: absolute;
  top: 8px;
  right: 50px;
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

/* @media only screen and (max-width: 768px) {
  [class*="handle-"]:before {
    content: "";
    left: -10px;
    right: -10px;
    bottom: -10px;
    top: -10px;
    position: absolute;
  }
} */
</style>

<script type="text/babel">
import Draggable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import {createTrafficChart, getRandomFloat} from '../../src/helpers'
import toastr from "toastr";
toastr.options={
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
let id=0;
function nextId() {
  id += 1;
  return id;
}

export default {
  name: "flHistoricCam",
  i18n: {
    messages: {
      de: {

      },
      en: {

      },
    },
  },
  props: {
  },

  components: {
    Draggable,
  },
  styling: null,
  destroyed() {},
  data() {
    return {
      dev:false,
      container: "Kamera "+nextId(),
      resizable: false,
      object:{},
      width:400,
      height:200,
      imagWidth:400,
      imagHeight:180,
      x: 338,
      y: 83,
      
    };
  },
  created() {
    this.index = this.$store.state.traffic_freiburg.flHistoricCams.length-1;
    this.id = this.$store.state.traffic_freiburg.flHistoricCams[this.index].id;
    
  },
  mounted(){
    const uiConfig = vcs.vcm.Framework.getInstance().getConfig('plugins').filter((elm)=>elm.name==='traffic_freiburg')[0];
    this.dev = uiConfig['dev'];
    this.object=this.$store.state.traffic_freiburg.flHistoricCams[this.index];
    var vm=this;
    if(this.object.hasOwnProperty('url')){
      this.getMeta(vm.object.url, function(width, height) {
        vm.height = (vm.width/width)*height;
      })
    }else{
      this.height = 310;
      this.width = 450;
      vm.$nextTick(function () {
          setTimeout(function() {
            vm.addChart(); //empty!!!!
          }, 100);
      });
    }

  },
  computed: {
  },
  methods: {
    onResize: function (x, y, width, height) {
      this.resizing = true
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onResizeStop: function (x, y, width, height) {
      this.resizing = false
    },
    addChart(){
      createTrafficChart(this.object.id,this.object.values);
    },
    getMeta(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function() { callback(this.width, this.height);
       }
    },
    dock(o){
      if(this.$store.state.traffic_freiburg.activeHistoricCams.length<2){
        this.$store.state.traffic_freiburg.activeHistoricCams.push(o);
        let index = this.$store.state.traffic_freiburg.flHistoricCams.findIndex(x => x.id ===o.id);
        this.$store.state.traffic_freiburg.flHistoricCams.splice(index, 1);
        //this.$store.state.traffic_freiburg.selectedCams.push({id:feature.getId(),camId:props.id});
        this.close(o,true);
      }else{
        toastr["error"]('Kameramenü enthält bereits 2 Kameras. Die aktuelle Kamera kann nicht wieder angedockt werden. Bitte eine Kamera aus dem Menü entfernen, oder diese Kamera aus der Kameraliste entfernen.');
      }

    },
    close(o,dock=false) {
      let index = this.$store.state.traffic_freiburg.flHistoricCams.findIndex(x => x.id ===o.id);
      if(index!=-1){
        if(!dock){
          this.$store.state.traffic_freiburg.selectedHistoricCams.splice(index,1);
        }
        this.$store.state.traffic_freiburg.flHistoricCams.splice(index, 1);
      }
    },
  },
};
</script>
