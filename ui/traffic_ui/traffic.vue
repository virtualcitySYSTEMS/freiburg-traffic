<template lang="html">
<div class="traffic">
     <SubButton @click="close()" class="close vcm-btn-icon cancel-icon close-btn"></SubButton>
    <div v-if="mounted">
        <h2>Verkehrsinformation</h2>
        <!--button @click="activate()">Live Verkehr</button-->
        <liveTraffic/>
        <historicTraffic/>
        <liveCamera/>
        <historicCamera/>
        <!--div style="display: inline-block; margin-top: 1rem;">
            <p style="display: inline; line-height: 1.4rem;">Live Verkehr</p>
            <toggle-button :value="false" :disabled="historic" color="#82C7EB" :width="60" :labels="{checked: 'Live', unchecked: 'Aus'}" @change="activateLive()" style="float:right; margin-left: 1rem"/>
        </div-->
        <!--div style="display: inline-block; margin-top: 1rem;">
            <p style="display: inline; line-height: 1.4rem;">Historischer Verkehr</p>
            <toggle-button :value="false" :disabled="live" color="#82C7EB" :width="60" :labels="{checked: 'Historisch', unchecked: 'Aus'}" @change="activateHistoric()" style="float:right; margin-left: 1rem"/>
        </div-->
    </div>

</div>
</template>

<style>

.item {
    color:whitesmoke;
}
.item:hover {
    color:#b52a2a;
}
.w3-check:checked::before {
    background-color: #c72f2f !important;
}

.export-layer-rows {
    overflow: auto;
    text-align: left;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
}

/* #toast-container > toast-info {
    max-width: 100% !important;
    width: 25rem !important;
} */
.close {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border: none;
    text-align: center;
}

.traffic {
    margin: 0.5rem;
    margin-bottom: 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: 85vh;
    text-align: justify;
}

@media screen and (max-height: 28.125em) {
    .traffic {
        display: none;
    }
}

@media screen and (min-height: 28.125em) {
    .traffic {
        height: 74vh;
    }
}

@media screen and (min-height: 37.5em) {
    .traffic {
        height: 80vh;
    }
}

@media screen and (min-height: 55em) {
    .traffic {
        height: 89vh;
    }
}

@media screen and (min-height: 70em) {
    .traffic {
        height: 90vh;
    }
}

@media screen and (min-height: 80em) {
    .traffic {
        height: 91vh;
    }
}

@media screen and (min-height: 105em) {
    .traffic {
        height: 93vh;
    }
}

.traffic ul {
    list-style-type: none;
}

.traffic li {
    list-style-type: none;
    line-height: 1.2rem;
    margin: 0.2rem;
    text-align: left;
}

.traffic li::marker {
    display: none;
}

/* .traffic p {
    float: left;
} */

.icon-span {
    float: right;
    margin-right: 0.5rem;
}
</style>

<script>
import liveTraffic from '../components/liveTraffic.vue';
import historicTraffic from '../components/historicTraffic';
import liveCamera from '../components/liveCamera.vue';
import historicCamera from '../components/historicCamera';
import { ToggleButton } from 'vue-js-toggle-button';
export default {
    name: "traffic",
    components: {
         ToggleButton,
         liveTraffic,
         historicTraffic,
         liveCamera,
         historicCamera
    },
    data() {
        return {
            uiConfig: {
                contentPosition: "left",
                contentPositionFixed: true,
            },
            connected:false,
            mounted:false,
            live:false,
            historic:false,
        };
    },
    mounted() {
        this.setDefaultContentState("traffic");
        this.mounted = true;
        //console.log(this.mounted);
    },
    methods: {
        activateLive(){
            this.live=!this.live;
            this.historic=false;
           // this.connected=activateWSLayer();
        },
        activateHistoric(){
            this.live=false;
            this.historic=!this.historic;
        },
        close() {
            vcs.ui.router.push('home');
        },
    },
};
</script>

<style scoped>
.container {
  z-index: 22;
  position: absolute;
  color: #444444;
}
</style>
