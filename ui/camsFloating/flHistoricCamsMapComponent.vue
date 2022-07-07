<template>
  <div>
    <cams
      v-for="cam in cams"
      :key="cam.id"
      :cam-id="cam.id"
    >
    </cams>
  </div>
</template>
<style>

</style>
<script type="text/babel">
  import cams from './flHistoricCamComponent.vue';
  
  export default {
    components: { cams },
    data() {
      return {
        draggable: {},
      };
    },
    computed: {
      cams() {
        return this.$store.state.traffic_freiburg.flHistoricCams;
      }
    },
  };

</script>
