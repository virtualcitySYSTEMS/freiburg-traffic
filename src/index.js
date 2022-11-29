import { version } from '../package.json';
import { activateWSLayer } from './live';
import traffic from '../ui/traffic_ui/traffic.vue';
import liveCamFLComponent from '../ui/camsFloating/flLiveCamsMapComponent';
import historicCamFLComponent from '../ui/camsFloating/flHistoricCamsMapComponent';

const routes=[
  {
    name: 'traffic',
    path: '/traffic',
    component: traffic,
  }
];


const store = {
  state:{
    open:'liveTraffic',
    selectedCams:[],
    activeCams:[],
    flLiveCams:[],
    selectedHistoricCams:[],
    activeHistoricCams:[],
    flHistoricCams:[],
    records:[],
  },
  mutations: {
    setTicker(state, ticker) {
      state.ticker = ticker;
    }
  },
};

export default {
  version,
  //activateWSLayer,
  // preInitialize
  // postInitialize
  // registerUiPlugin
  // postUiInitialize
  registerUiPlugin: async () => ({
    name: 'traffic_freiburg',
    routes,
    store,
    //mapComponent: [traffic],
    mapComponent: [liveCamFLComponent, historicCamFLComponent],
    supportedMaps: ["vcs.vcm.maps.Cesium", "vcs.vcm.maps.Openlayers"],
    headerButton: [ // you can add multiple buttons as an array
      '<a title="Anzeige des Live-Traffics..." class="" href="#/traffic" style="text-decoration: none; color:#777777" ><span class="header-btn-text">Verkehrsinformationen</span></a>',
      //'<a title="Anzeige des Historischen -Traffics..." data-v-10d68858="" href="#/traffic" class="" style="text-decoration: none;"><span data-v-10d68858="" data-v-32d16ac8="" class="vcm-btn-icon user-o" data-duet-btn3=""></span><span data-v-10d68858="" data-v-32d16ac8="" class="header-btn-text">Historic</span></a>'
    ],
     legendItem: [] 
  }
  ),
};

/* function addLayer(){
  activateWSLayer();
} */