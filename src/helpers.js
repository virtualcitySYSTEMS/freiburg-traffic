import ApexCharts from 'apexcharts';
let height = 13;
let width = 13;
let points = [[0, 13], [13, 13], [6, 0]];

//export const icon = `<svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg"><polygon points="${points.map(p => p.join(',')).join(' ')}" style="fill:white;" /></svg>`
export function getRandomFloat(min, max, decimals) {
   const str = (Math.random() * (max - min) + min).toFixed(decimals);

   return parseFloat(str);
}

export function parseSvg(svg) {
   return (new DOMParser()).parseFromString(svg, 'application/xml');
 }
 
export function getIcon(id=0,values={}){
   if(Object.keys(values).length===0 && id===0){
      values={
         "_headers": {
         "eventType": "sumFreiburgVehikelAnzahl"
         },
         "statementName": "sumFreiburgVehikelAnzahl_VSResultStatement",
         "countMotorrad": 0,
         "countFahrrad": 0,
         "countVan": 0,
         "countLKWAnhanger": 0,
         "countLKW": 0,
         "countPKW": 0,
         "speed":0,//getRandomFloat(5, 50,0),
         "SID": "5663e4ed-f578-4513-806d-b7ce88c10fd7",
         "timestamp": "2022-11-24T17:00:18.652+0000"
      }
   }
   let svg;
   svg = parseSvg(icon);
   if(id===0){
      Object.keys(values).forEach((key)=>{
         if(key.includes('PKW')){
            let elm=svg.querySelector("[id='text_car']");
            elm.textContent = values[key];
         }
         if(key.includes('Fahrrad')){
            let elm=svg.querySelector("[id='text_bike']");
            elm.textContent = values[key];
         }
         if(key.includes('Motorrad')){
            let elm=svg.querySelector("[id='text_motocycle']");
            elm.textContent = values[key];
         }
         if(key.includes('Van')){
            let elm=svg.querySelector("[id='text_van']");
            elm.textContent = values[key];
         }
         if(key==='countLKW'){
            let elm=svg.querySelector("[id='text_truck']");
            elm.textContent = values[key];
         }
         if(key==='countLKWAnhanger'){
            let elm=svg.querySelector("[id='text_bigTruck']");
            elm.textContent = values[key];
         }
         if(key.includes('speed')){
            let elm=svg.querySelector("[id='text_speed']");
            elm.textContent = values[key] || getRandomFloat(5, 50,0);
         }
      })
   }else{
      id = id.replaceAll('.','_');
      Object.keys(values).filter((el)=>el.includes(id)).forEach((key)=>{
         if(key.includes('PKW')){
            let elm=svg.querySelector("[id='text_car']");
            elm.textContent = values[key];
         }
         if(key.includes('Fahrrad')){
            let elm=svg.querySelector("[id='text_bike']");
            elm.textContent = values[key];
         }
         if(key.includes('Motorrad')){
            let elm=svg.querySelector("[id='text_motocycle']");
            elm.textContent = values[key];
         }
         if(key.includes('Van')){
            let elm=svg.querySelector("[id='text_van']");
            elm.textContent = values[key];
         }
         if(key==='countLKW'){
            let elm=svg.querySelector("[id='text_truck']");
            elm.textContent = values[key];
         }
         if(key==='countLKWAnhanger'){
            let elm=svg.querySelector("[id='text_bigTruck']");
            elm.textContent = values[key];
         }
         if(key.includes('speed')){
            let elm=svg.querySelector("[id='text_speed']");
            elm.textContent = values[key];
         }
      })
   }

   return new XMLSerializer().serializeToString(svg);
}
 //const { attributes } = svg.querySelector('circle');

export function createTrafficChart(id,values={}){
   if(id){
      if(Object.keys(values).length===0){
         /* values={
            "_headers": {
            "eventType": "sumFreiburgVehikelAnzahl"
            },
            "statementName": "sumFreiburgVehikelAnzahl_VSResultStatement",
            "countMotorrad": 0,
            "countFahrrad": 0,
            "countVan": 0,
            "countLKWAnhanger": 0,
            "countLKW": 0,
            "countPKW": 0,
            "speed":getRandomFloat(5, 50,0),
            "SID": "5663e4ed-f578-4513-806d-b7ce88c10fd7",
            "timestamp": "2022-11-24T17:00:18.652+0000"
         } */
         values={
            "countMotorrad": 0,
            "countFahrrad": 0,
            "countVan": 0,
            "countLKWAnhanger": 0,
            "countLKW": 0,
            "countPKW": 0,
         }
      }else{
         console.log(values);
      }
      var chart = document.querySelector("#cam-"+id.replaceAll('.','-'));
      if(chart){
        chart.innerHTML='';
      }
      var options = {
        series: [],
        chart: {
          height: 280,
          width: "100%",
          background:'#fff',
          type: 'bar',
          stacked:false,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          },
          legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: false,
            showForZeroSeries: false,
          },
        },
        title: {
          text: 'Fahrzeuge',
          offsetX: 0
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '100%',
            borderRadius: 1
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
         xaxis: {
          categories: ['period'],
        },
        yaxis:[{
          labels: {
            formatter: function (val) {
                return val;
            }
          },
          title: {
            text: 'vehicles [count]'
          }
        }],
        legend:{
          colors:['#000000']
        },
        theme: {
          mode: 'light', 
        },
        colors: [function({ value, seriesIndex, w }) {
          if(w.config.series[seriesIndex].name.includes('Fahrrad')){
            return '#f2845c'
          }
          else if(w.config.series[seriesIndex].name.includes('motorrad')){
            return '#1b8c63'
          }
          if(w.config.series[seriesIndex].name.includes('PKW')){
            return '#3e9cba'
          }
          if(w.config.series[seriesIndex].name.includes('LKW_')){
            return '#005993'
          }
          if(w.config.series[seriesIndex].name.includes('LKWAnhanger_')){
            return '#01385c'
          }
          if(w.config.series[seriesIndex].name.includes('Van')){
            return '#225566'
          }
          else{
            return '#585858'
          }
        }],
        tooltip:{
          theme:'dark',
          y: []
        }   
      };
      Object.keys(values).forEach((key)=>{
         if(key.includes('PKW')){
            options.series.push({name:'PKW' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'PKW',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
            //options.xaxis.categories = values.timestamp;
         }
         if(key.includes('Fahrrad')){
            options.series.push({name:'Fahrrad' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'Fahrrad',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
         }
         if(key.includes('Motorrad')){
            options.series.push({name:'Motorrad' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'Motorrad',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
         }
         if(key.includes('Van')){
            options.series.push({name:'Van' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'Van',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
         }
         if(key.includes('LKW_')){
            options.series.push({name:'LKW' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'LKW',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
         }
         if(key.includes('LKWAnhanger_')){
            options.series.push({name:'LKWAnhanger' , "data": [values[key]]});
            options.yaxis.push({
               seriesName: 'LKWAnhanger',
               show: false,
               axisTicks: {
                  show: false,
               },
               axisBorder: {
                  show: false
               },
               labels: {
                  show:false,
               },
               title: {
                  text: "",
               },
               tooltip: {
                  enabled: false
               }
            })
         }
         if(key.includes('speed')){
/*             options.series.push({name:'speed' , "data": [values[key]]});
            options.yaxis.push({
               seriesName:'speed',
               opposite: true,
               labels: {
                 formatter: function (val) {
                     return val;
                 }
               },
               title: {
                 text: 'speed [km/h]'
               }
             }) */
         }
      })
      chart = new ApexCharts(document.querySelector("#cam-"+id.replaceAll('.','-')), options);
      chart.render();
   }
}

export const icon = `<svg
width="118.88525"
height="145.07819"
viewBox="0 0 31.455031 38.385317"
version="1.1"
id="svg1574"
xmlns="http://www.w3.org/2000/svg"
xmlns:svg="http://www.w3.org/2000/svg">
<defs
  id="defs1571" />
<g
  id="layer1"
  transform="translate(-0.08500825,-0.19317245)">
 <rect
    style="fill:#ffffff;fill-opacity:1;stroke:#818385;stroke-width:0.474536;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    id="rect234"
    width="30.980543"
    height="19.869995"
    x="0.32225132"
    y="0.43044037"
    ry="1.9924158" />
 <path
    style="fill:#ffffff;fill-opacity:1;stroke:#818385;stroke-width:0.50448;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    d="M 0.43501465,15.558841 H 31.153927"
    id="path1280" />
 <path
    style="fill:#ffffff;fill-opacity:1;stroke:#818385;stroke-width:0.479694;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    d="M 14.756387,0.70190935 V 15.564327"
    id="path1282" />
 <g
    id="g5054"
    transform="matrix(-0.01704121,0,0,0.01624473,6.2380431,0.40665781)"
    style="fill:#cccccc">
   <path
      d="m 238.703,127.946 c -5.119,0 -10.089,0.487 -14.847,1.67 L 204.901,78.661 h 6.176 c 9.72,0 18.913,-3.577 25.887,-10.345 l 6.541,-6.273 c 2.973,-2.885 3.043,-7.595 0.158,-10.568 -2.885,-2.973 -7.633,-3.024 -10.605,-0.139 l -6.541,6.206 c -4.159,4.037 -9.643,6.118 -15.439,6.118 h -16.979 c -2.458,0 -4.76,1.356 -6.161,3.375 -1.401,2.02 -1.725,4.673 -0.865,6.975 l 7.214,19.372 c -0.046,-0.001 -0.093,0.141 -0.139,0.141 -0.016,0 -0.032,0.137 -0.049,0.137 H 98.126 L 85.165,71.823 99.243,66.928 c 3.467,-1.191 5.564,-4.55 4.961,-8.166 -0.604,-3.615 -3.731,-6.101 -7.397,-6.101 h -41.21 c -5.775,0 -10.475,4.506 -10.475,10.281 0,8.941 7.266,16.12 16.196,16.12 1.79,0 3.565,-0.347 5.277,-0.934 l 4.103,-1.433 13.146,21.996 -10.097,30.285 c -3.312,-0.669 -6.714,-1.09 -10.193,-1.201 -17.589,-0.563 -34.055,6.138 -46.219,18.697 -11.694,12.074 -17.84,27.992 -17.303,44.822 1.032,32.337 27.172,58.476 59.509,59.508 0.673,0.021 1.34,0.032 2.008,0.032 16.811,0 32.513,-6.716 44.212,-18.794 9.464,-9.773 15.291,-22.38 16.885,-35.38 h 12.051 c 2.598,2 5.961,3.634 9.639,3.634 8.196,0 14.864,-6.636 14.864,-14.833 0,-2.661 -0.712,-5.139 -1.942,-7.303 l 42.042,-71.305 10.553,28.289 c -19.435,10.359 -32.698,30.831 -32.698,54.348 0,33.938 27.61,61.549 61.548,61.549 33.938,0 61.547,-27.61 61.547,-61.547 0,-33.937 -27.609,-61.546 -61.547,-61.546 z m -57.724,-19.285 -36.606,62.091 c -0.013,0 -0.025,-0.062 -0.037,-0.062 -0.043,0 -0.084,0.096 -0.127,0.097 l -37.131,-62.125 h 73.901 z m -86.987,7.008 37.378,62.514 c -0.618,1.101 -1.089,2.478 -1.412,3.478 h -7.326 c -2.591,-21 -16.064,-39.121 -34.658,-48.001 z m -19.545,65.992 c -0.503,-1 -1.081,-1.526 -1.728,-2.233 l 8.865,-26.626 c 10.72,5.925 18.562,16.859 20.834,28.859 z m 16.948,36.465 c -8.215,8.481 -19.311,13.04 -31.215,12.655 -21.822,-0.696 -39.461,-18.319 -40.157,-40.141 -0.363,-11.369 3.784,-22.112 11.679,-30.262 7.898,-8.154 18.497,-12.642 29.845,-12.642 0.455,0 0.91,0.01 1.369,0.024 1.502,0.048 2.981,0.185 4.439,0.389 l -8.966,26.9 c -6.569,1.537 -11.481,7.43 -11.481,14.461 0,8.196 6.668,14.801 14.863,14.801 5.552,0 10.395,-2.65 12.947,-7.65 h 27.699 c -1.451,8 -5.22,15.474 -11.022,21.465 z m 147.308,12.916 c -22.909,0 -41.548,-18.639 -41.548,-41.548 0,-14.932 7.921,-28.044 19.779,-35.369 l 14.098,37.785 c 1.125,3.017 3.986,4.88 7.027,4.88 0.871,0 1.757,-0.152 2.621,-0.476 3.881,-1.447 5.853,-5.768 4.404,-9.648 l -14.169,-37.977 c 2.524,-0.481 5.125,-0.743 7.788,-0.743 22.909,0 41.547,18.639 41.547,41.548 0,22.909 -18.637,41.548 -41.547,41.548 z"
      id="path5001"
      style="fill:#cccccc" />
   <g
      id="g5003"
      style="fill:#cccccc">
</g>
   <g
      id="g5005"
      style="fill:#cccccc">
</g>
   <g
      id="g5007"
      style="fill:#cccccc">
</g>
   <g
      id="g5009"
      style="fill:#cccccc">
</g>
   <g
      id="g5011"
      style="fill:#cccccc">
</g>
   <g
      id="g5013"
      style="fill:#cccccc">
</g>
   <g
      id="g5015"
      style="fill:#cccccc">
</g>
   <g
      id="g5017"
      style="fill:#cccccc">
</g>
   <g
      id="g5019"
      style="fill:#cccccc">
</g>
   <g
      id="g5021"
      style="fill:#cccccc">
</g>
   <g
      id="g5023"
      style="fill:#cccccc">
</g>
   <g
      id="g5025"
      style="fill:#cccccc">
</g>
   <g
      id="g5027"
      style="fill:#cccccc">
</g>
   <g
      id="g5029"
      style="fill:#cccccc">
</g>
   <g
      id="g5031"
      style="fill:#cccccc">
</g>
 </g>
 <g
    id="g5133"
    transform="matrix(0.01050767,0,0,0.01001656,15.584582,0.03078028)"
    style="fill:#cccccc">
   <g
      id="g5060"
      style="fill:#cccccc">
     <g
id="g5058"
style="fill:#cccccc">
             <path
d="m 392.533,298.667 c -23.526,0 -42.667,19.14 -42.667,42.667 0,23.526 19.14,42.667 42.667,42.667 23.526,0 42.667,-19.14 42.667,-42.667 0,-23.527 -19.14,-42.667 -42.667,-42.667 z m 0,68.266 c -14.114,0 -25.6,-11.486 -25.6,-25.6 0,-14.114 11.486,-25.6 25.6,-25.6 14.114,0 25.6,11.486 25.6,25.6 0,14.114 -11.486,25.6 -25.6,25.6 z"
id="path5056"
style="fill:#cccccc" />

     </g>

</g>
   <g
      id="g5066"
      style="fill:#cccccc">
     <g
id="g5064"
style="fill:#cccccc">
             <path
d="m 509.5,292.634 -6.033,-6.033 V 136.533 c 0,-4.71 -3.814,-8.533 -8.533,-8.533 h -384 c -2.782,0 -5.393,1.357 -6.989,3.644 l -59.068,84.378 c -17.391,14.43 -33.562,33.135 -36.139,70.374 l -6.229,6.238 C 0.896,294.229 0,296.405 0,298.667 v 17.067 c 0,2.261 0.896,4.437 2.5,6.033 l 6.033,6.033 v 13.534 c 0,4.71 3.814,8.533 8.533,8.533 H 51.2 c 4.719,0 8.533,-3.823 8.533,-8.533 0,-32.939 26.803,-59.733 59.733,-59.733 32.93,0 59.733,26.795 59.733,59.733 0,4.71 3.814,8.533 8.533,8.533 h 136.533 c 4.719,0 8.533,-3.823 8.533,-8.533 0,-32.939 26.803,-59.733 59.733,-59.733 32.93,0 59.733,26.795 59.733,59.733 0,4.71 3.814,8.533 8.533,8.533 h 34.133 c 4.719,0 8.533,-3.823 8.533,-8.533 V 327.8 l 6.033,-6.033 c 1.604,-1.596 2.5,-3.772 2.5,-6.033 v -17.067 c 0.004,-2.262 -0.892,-4.438 -2.496,-6.033 z M 115.379,145.067 h 72.354 v 68.267 H 67.593 Z m 379.554,167.134 -6.033,6.033 c -1.604,1.596 -2.5,3.772 -2.5,6.033 V 332.8 H 468.855 C 464.597,294.451 432,264.533 392.533,264.533 c -39.467,0 -72.064,29.918 -76.322,68.267 H 195.789 C 191.531,294.451 158.934,264.533 119.467,264.533 80,264.533 47.403,294.451 43.145,332.8 H 25.6 v -8.533 c 0,-2.261 -0.896,-4.437 -2.5,-6.033 l -6.033,-6.033 V 302.2 l 6.033,-6.033 c 1.51,-1.502 2.389,-3.516 2.492,-5.641 0.299,-6.494 1.101,-12.194 2.21,-17.459 h 14.865 c 4.719,0 8.533,-3.823 8.533,-8.533 0,-4.71 -3.814,-8.534 -8.533,-8.534 h -9.165 c 4.958,-10.18 11.989,-18.099 20.787,-25.6 h 141.978 c 4.719,0 8.533,-3.823 8.533,-8.533 v -76.8 H 486.4 V 256 h -8.533 c -4.719,0 -8.533,3.823 -8.533,8.533 0,4.71 3.814,8.533 8.533,8.533 h 8.533 v 17.067 c 0,2.261 0.896,4.437 2.5,6.033 l 6.033,6.033 z"
id="path5062"
style="fill:#cccccc" />

     </g>

</g>
   <g
      id="g5072"
      style="fill:#cccccc">
     <g
id="g5070"
style="fill:#cccccc">
             <path
d="m 119.467,298.667 c -23.526,0 -42.667,19.14 -42.667,42.667 0,23.526 19.14,42.666 42.667,42.666 23.527,0 42.667,-19.14 42.667,-42.667 -10e-4,-23.526 -19.141,-42.666 -42.667,-42.666 z m 0,68.266 c -14.114,0 -25.6,-11.486 -25.6,-25.6 0,-14.114 11.486,-25.6 25.6,-25.6 14.114,0 25.6,11.486 25.6,25.6 0,14.114 -11.486,25.6 -25.6,25.6 z"
id="path5068"
style="fill:#cccccc" />

     </g>

</g>
   <g
      id="g5074"
      style="fill:#cccccc">
</g>
   <g
      id="g5076"
      style="fill:#cccccc">
</g>
   <g
      id="g5078"
      style="fill:#cccccc">
</g>
   <g
      id="g5080"
      style="fill:#cccccc">
</g>
   <g
      id="g5082"
      style="fill:#cccccc">
</g>
   <g
      id="g5084"
      style="fill:#cccccc">
</g>
   <g
      id="g5086"
      style="fill:#cccccc">
</g>
   <g
      id="g5088"
      style="fill:#cccccc">
</g>
   <g
      id="g5090"
      style="fill:#cccccc">
</g>
   <g
      id="g5092"
      style="fill:#cccccc">
</g>
   <g
      id="g5094"
      style="fill:#cccccc">
</g>
   <g
      id="g5096"
      style="fill:#cccccc">
</g>
   <g
      id="g5098"
      style="fill:#cccccc">
</g>
   <g
      id="g5100"
      style="fill:#cccccc">
</g>
   <g
      id="g5102"
      style="fill:#cccccc">
</g>
 </g>
 <g
    id="g5194"
    transform="matrix(-0.02124281,0,0,0.02024996,20.653162,5.1740307)"
    style="fill:#cccccc">
   <g
      id="g5139"
      style="fill:#cccccc">
     <path
d="m 237.90617,120.354 -19.709,-42.577 c -1.229,-2.652 -3.885,-4.35 -6.807,-4.35 h -61.982 V 36.312 c 0,-4.142 -3.357,-7.5 -7.5,-7.5 H -8.1148332 c -4.1429998,0 -7.4999998,3.358 -7.4999998,7.5 v 126.221 c 0,4.142 3.357,7.5 7.4999998,7.5 H 6.5761669 c -1.256,2.75 -2.205,5.667 -2.799,8.712 H -8.1148332 c -4.1429998,0 -7.4999998,3.358 -7.4999998,7.5 0,4.142 3.357,7.5 7.4999998,7.5 H 3.7781669 c 3.51,18.016 19.4060001,31.659 38.4360001,31.659 19.027,0 34.922,-13.644 38.432,-31.659 h 62.596003 c 3.51,18.016 19.405,31.659 38.434,31.659 19.026,0 34.92,-13.644 38.43,-31.659 h 10.996 c 4.143,0 7.5,-3.358 7.5,-7.5 v -62.74 c -0.002,-1.089 -0.238,-2.164 -0.696,-3.151 z m -94.666,58.39 H 80.645167 c -0.593,-3.045 -1.543,-5.962 -2.799,-8.712 h 64.063003 c 1.988,0 3.791,-0.779 5.133,-2.042 -1.764,3.331 -3.059,6.944 -3.802,10.754 z M -0.61483313,43.812 H 134.40817 V 155.033 H 65.832167 c -6.571,-4.985 -14.754,-7.95 -23.619,-7.95 -8.865,0 -17.05,2.965 -23.621,7.95 H -0.61483313 Z M 42.213167,210.403 c -13.324,0 -24.164,-10.838 -24.164,-24.159 0,-13.323 10.84,-24.162 24.164,-24.162 13.322,0 24.16,10.839 24.16,24.162 0,13.321 -10.838,24.159 -24.16,24.159 z m 139.461003,0 c -13.323,0 -24.162,-10.838 -24.162,-24.159 0,-13.323 10.839,-24.162 24.162,-24.162 13.321,0 24.158,10.839 24.158,24.162 0,13.321 -10.837,24.159 -24.158,24.159 z m 41.926,-31.659 h -3.496 c -3.51,-18.018 -19.402,-31.662 -38.43,-31.662 -13.535,0 -25.486,6.904 -32.523,17.374 0.162,-0.615 0.258,-1.257 0.258,-1.923 V 88.427 h 57.189 l 17.002,36.729 z"
id="path5135"
style="fill:#cccccc" />

     <path
d="m 211.066,95.302 h -31.537 c -4.143,0 -7.5,3.358 -7.5,7.5 v 20.85 c 0,4.142 3.357,7.5 7.5,7.5 h 41.428 c 0.011,0 0.015,0 0.02,0 4.143,0 7.5,-3.358 7.5,-7.5 0,-1.343 -0.353,-2.603 -0.971,-3.693 l -9.663,-20.371 c -1.242,-2.618 -3.88,-4.286 -6.777,-4.286 z m -24.037,20.849 v -5.85 h 19.294 l 2.774,5.85 z"
id="path5137"
style="fill:#cccccc" />

</g>
   <g
      id="g5141"
      style="fill:#cccccc">
</g>
   <g
      id="g5143"
      style="fill:#cccccc">
</g>
   <g
      id="g5145"
      style="fill:#cccccc">
</g>
   <g
      id="g5147"
      style="fill:#cccccc">
</g>
   <g
      id="g5149"
      style="fill:#cccccc">
</g>
   <g
      id="g5151"
      style="fill:#cccccc">
</g>
   <g
      id="g5153"
      style="fill:#cccccc">
</g>
   <g
      id="g5155"
      style="fill:#cccccc">
</g>
   <g
      id="g5157"
      style="fill:#cccccc">
</g>
   <g
      id="g5159"
      style="fill:#cccccc">
</g>
   <g
      id="g5161"
      style="fill:#cccccc">
</g>
   <g
      id="g5163"
      style="fill:#cccccc">
</g>
   <g
      id="g5165"
      style="fill:#cccccc">
</g>
   <g
      id="g5167"
      style="fill:#cccccc">
</g>
   <g
      id="g5169"
      style="fill:#cccccc">
</g>
 </g>
 <path
    d="m 22.190278,12.336287 h -1.505146 c -0.104608,0 -0.189384,0.08083 -0.189384,0.180525 v 1.2584 h -0.396323 v -1.2584 c 0,-0.09969 -0.08477,-0.180525 -0.189387,-0.180525 h -3.855694 c -0.08314,0 -0.156528,0.05167 -0.181002,0.127408 l -0.280285,0.867806 c -0.0056,0.01721 -0.0085,0.03514 -0.0085,0.05314 v 0.868113 c 0,0.09971 0.0848,0.180533 0.189384,0.180533 h 0.214765 c 0.03462,0.295356 0.298071,0.525766 0.616995,0.525766 0.318919,0 0.582373,-0.230438 0.616964,-0.525831 h 0.689581 c 0.03459,0.295393 0.298041,0.525831 0.61695,0.525831 0.167582,0 0.319771,-0.06371 0.431589,-0.166939 0.111804,0.103231 0.263978,0.166939 0.431553,0.166939 0.286244,0 0.52773,-0.185622 0.599285,-0.437182 0.06364,-0.0291 0.107678,-0.09091 0.107678,-0.162686 v -0.22293 h 0.396314 v 0.116499 c 0,0.09971 0.08478,0.180533 0.189376,0.180533 h 0.135659 c 0.03462,0.295356 0.298058,0.525766 0.616975,0.525766 0.318912,0 0.582319,-0.23041 0.616947,-0.525766 h 0.135578 c 0.104576,0 0.189375,-0.08083 0.189375,-0.180533 v -1.735939 c 1.2e-5,-0.09969 -0.08479,-0.180525 -0.189375,-0.180525 z m -2.469624,1.528677 c -0.09528,-0.05681 -0.20774,-0.08976 -0.328178,-0.08976 -0.167585,0 -0.319767,0.06371 -0.431567,0.166918 C 18.849086,13.83891 18.696911,13.7752 18.529321,13.7752 c -0.229755,0 -0.430609,0.119664 -0.537988,0.296962 h -0.609406 v -1.374821 h 2.338727 z M 16.19416,12.697341 h 0.204978 v 0.50679 h -0.368635 z m -0.230734,0.867841 h 0.625084 c 0.104603,0 0.189391,-0.0808 0.189391,-0.180507 v -0.687334 h 0.22529 v 1.215357 c -0.107757,-0.08576 -0.246332,-0.137486 -0.397375,-0.137486 -0.229792,0 -0.430661,0.119675 -0.538052,0.297002 h -0.104338 z m 0.64239,1.032826 c -0.133541,0 -0.242183,-0.103581 -0.242183,-0.230874 0,-0.127304 0.108642,-0.230882 0.242183,-0.230882 0.133535,0 0.242191,0.103566 0.242191,0.230882 0,0.127293 -0.108656,0.230874 -0.242191,0.230874 z m 1.923505,0 c -0.133529,0 -0.24219,-0.103581 -0.24219,-0.230874 0,-0.127304 0.108659,-0.230882 0.24219,-0.230882 0.133571,0 0.242196,0.103566 0.242196,0.230882 0,0.127293 -0.108625,0.230874 -0.242196,0.230874 z m 0.863155,0 c -0.133546,0 -0.242193,-0.103581 -0.242193,-0.230874 0,-0.127304 0.108624,-0.230882 0.242193,-0.230882 0.133556,0 0.242193,0.103566 0.242193,0.230882 0,0.127293 -0.108637,0.230874 -0.242193,0.230874 z m 1.482015,-1.900667 h 1.126411 v 1.374873 h -0.02512 c -0.107389,-0.177327 -0.308275,-0.297002 -0.53805,-0.297002 -0.22978,0 -0.430643,0.119675 -0.538045,0.297002 h -0.0252 z m 0.563242,1.900667 c -0.133521,0 -0.242175,-0.103581 -0.242175,-0.230874 0,-0.127304 0.108641,-0.230882 0.242175,-0.230882 0.133552,0 0.242193,0.103566 0.242193,0.230882 0,0.127293 -0.108649,0.230874 -0.242193,0.230874 z"
    id="path5196"
    style="fill:#cccccc;stroke-width:0.0147916" />
 <g
    id="g5261"
    transform="matrix(0.29033794,0,0,0.2767681,1.1214208,5.5384452)"
    style="fill:#999999">
   <g
      id="g5207"
      style="fill:#999999">
     <path
style="fill:#cccccc"
d="M 17.668,5.734 C 17.508,4.532 13.817,4.643 13.984,5.282 14.151,5.921 12.732,6.413 12.732,6.413 L 10.692,6.81 C 9.451,5.824 8.89,5.515 8.46,5.239 6.789,4.168 5.037,6.375 5.037,6.375 c 0,0 -1.622,-0.198 0.299,-2.119 C -1.349,7.688 1.833,8.26 1.833,8.26 h 1.879 l -0.3,0.485 C 3.115,8.614 2.785,8.54 2.437,8.54 1.091,8.54 0,9.632 0,10.977 c 0,1.346 1.091,2.438 2.437,2.438 1.346,0 2.437,-1.092 2.437,-2.438 0,-0.755 -0.344,-1.429 -0.884,-1.876 l 0.258,-0.418 2.599,2.896 v 0 h 0.226 4.713 0.584 c 0.268,1.054 1.222,1.836 2.359,1.836 1.346,0 2.436,-1.092 2.436,-2.438 0,-1.345 -1.09,-2.437 -2.436,-2.437 -1.23,0 -2.244,0.912 -2.411,2.096 h -0.023 c 0,0 -0.213,-0.783 -0.592,-1.753 1.266,-0.423 6.104,-2.104 5.965,-3.149 z m -15.23,6.775 c -0.845,0 -1.531,-0.687 -1.531,-1.532 0,-0.845 0.687,-1.531 1.531,-1.531 0.173,0 0.338,0.029 0.493,0.083 l -0.528,0.856 c -0.004,0.006 -0.011,0.01 -0.015,0.017 l -0.221,0.363 c -10e-4,0.004 0,0.006 -0.002,0.008 l -0.016,0.026 0.005,0.004 c -0.07,0.154 -0.021,0.34 0.128,0.431 0.148,0.09 0.333,0.049 0.438,-0.083 l 0.007,0.005 0.02,-0.032 C 2.748,11.122 2.75,11.121 2.751,11.12 L 2.85,10.958 3.51,9.885 c 0.284,0.278 0.46,0.665 0.46,1.093 -0.001,0.844 -0.688,1.531 -1.532,1.531 z M 14.73,9.445 c 0.844,0 1.531,0.687 1.531,1.531 0,0.846 -0.688,1.532 -1.531,1.532 -0.632,0 -1.176,-0.385 -1.409,-0.931 h 1.859 v -0.008 h 0.043 c 0.259,0.004 0.472,-0.2 0.475,-0.46 0.005,-0.258 -0.202,-0.47 -0.46,-0.475 l -0.583,-0.007 c -0.03,-0.001 -0.059,0.002 -0.088,0.007 H 13.238 C 13.392,9.955 14.001,9.445 14.73,9.445 Z"
id="path5205" />

</g>
   <g
      id="g5209"
      style="fill:#999999">
</g>
   <g
      id="g5211"
      style="fill:#999999">
</g>
   <g
      id="g5213"
      style="fill:#999999">
</g>
   <g
      id="g5215"
      style="fill:#999999">
</g>
   <g
      id="g5217"
      style="fill:#999999">
</g>
   <g
      id="g5219"
      style="fill:#999999">
</g>
   <g
      id="g5221"
      style="fill:#999999">
</g>
   <g
      id="g5223"
      style="fill:#999999">
</g>
   <g
      id="g5225"
      style="fill:#999999">
</g>
   <g
      id="g5227"
      style="fill:#999999">
</g>
   <g
      id="g5229"
      style="fill:#999999">
</g>
   <g
      id="g5231"
      style="fill:#999999">
</g>
   <g
      id="g5233"
      style="fill:#999999">
</g>
   <g
      id="g5235"
      style="fill:#999999">
</g>
   <g
      id="g5237"
      style="fill:#999999">
</g>
 </g>
 <g
    id="g6780"
    transform="matrix(0.19197075,0,0,0.18299841,1.1214208,10.686659)"
    style="fill:#cccccc">
   <g
      id="g6723"
      style="fill:#cccccc">
     <g
id="g6721"
style="fill:#cccccc">
             <path
d="m 7.592,16.86 c -1.77,0 -3.203,1.434 -3.203,3.204 0,1.77 1.434,3.204 3.203,3.204 1.768,0 3.203,-1.434 3.203,-3.204 0,-1.77 -1.435,-3.204 -3.203,-3.204 z m 0,4.172 c -0.532,0 -0.968,-0.434 -0.968,-0.967 0,-0.533 0.436,-0.967 0.968,-0.967 0.531,0 0.966,0.434 0.966,0.967 0,0.533 -0.434,0.967 -0.966,0.967 z"
id="path6715"
style="fill:#cccccc" />

             <path
d="M 30.915,17.439 30.391,13.177 C 30.288,12.359 29.573,11.759 28.748,11.804 L 27.6,11.868 24.036,8.657 C 23.692,8.348 23.249,8.178 22.787,8.178 L 15.546,8.177 c -1.625,0 -3.201,0.555 -4.468,1.573 l -4.04,3.246 -5.433,1.358 c -0.698,0.174 -1.188,0.802 -1.188,1.521 v 1.566 C 0.187,17.44 0,17.626 0,17.856 v 2.071 c 0,0.295 0.239,0.534 0.534,0.534 h 3.067 c -0.013,-0.133 -0.04,-0.26 -0.04,-0.396 0,-2.227 1.804,-4.029 4.03,-4.029 2.226,0 4.029,1.802 4.029,4.029 0,0.137 -0.028,0.264 -0.041,0.396 h 8.493 c -0.012,-0.133 -0.039,-0.26 -0.039,-0.396 0,-2.227 1.804,-4.029 4.029,-4.029 2.227,0 4.028,1.802 4.028,4.029 0,0.137 -0.026,0.264 -0.04,0.396 h 2.861 c 0.295,0 0.533,-0.239 0.533,-0.534 V 17.974 C 31.449,17.68 31.21,17.439 30.915,17.439 Z M 20.168,12.202 10.066,12.713 12,11.158 c 1.051,-0.845 2.357,-1.305 3.706,-1.305 h 4.462 z m 1.678,-0.085 V 9.854 h 0.657 c 0.228,0 0.447,0.084 0.616,0.237 l 2.062,1.856 z"
id="path6717"
style="fill:#cccccc" />

             <path
d="m 24.064,16.86 c -1.77,0 -3.203,1.434 -3.203,3.204 0,1.77 1.434,3.204 3.203,3.204 1.769,0 3.203,-1.434 3.203,-3.204 0,-1.77 -1.434,-3.204 -3.203,-3.204 z m 0,4.172 c -0.533,0 -0.967,-0.434 -0.967,-0.967 0,-0.533 0.434,-0.967 0.967,-0.967 0.531,0 0.967,0.434 0.967,0.967 0,0.533 -0.435,0.967 -0.967,0.967 z"
id="path6719"
style="fill:#cccccc" />

     </g>

</g>
   <g
      id="g6725"
      style="fill:#cccccc">
</g>
   <g
      id="g6727"
      style="fill:#cccccc">
</g>
   <g
      id="g6729"
      style="fill:#cccccc">
</g>
   <g
      id="g6731"
      style="fill:#cccccc">
</g>
   <g
      id="g6733"
      style="fill:#cccccc">
</g>
   <g
      id="g6735"
      style="fill:#cccccc">
</g>
   <g
      id="g6737"
      style="fill:#cccccc">
</g>
   <g
      id="g6739"
      style="fill:#cccccc">
</g>
   <g
      id="g6741"
      style="fill:#cccccc">
</g>
   <g
      id="g6743"
      style="fill:#cccccc">
</g>
   <g
      id="g6745"
      style="fill:#cccccc">
</g>
   <g
      id="g6747"
      style="fill:#cccccc">
</g>
   <g
      id="g6749"
      style="fill:#cccccc">
</g>
   <g
      id="g6751"
      style="fill:#cccccc">
</g>
   <g
      id="g6753"
      style="fill:#cccccc">
</g>
 </g>
 <path
    d="m 3.8848935,18.734804 1.5755267,-2.034617 c 0.052137,-0.06742 0.1486369,-0.08739 0.2254491,-0.04654 0.069144,0.03631 0.1030434,0.111946 0.085632,0.183397 l -0.00757,0.02314 -0.974523,2.352168 c -0.1057624,0.255219 -0.4085796,0.380509 -0.6763627,0.279692 -0.021011,-0.0021 -0.041459,-0.0166 -0.061267,-0.02716 C 3.7998973,19.331796 3.708893,19.02925 3.8485106,18.789139 l 0.017297,-0.02713 v 0 l 0.01925,-0.02636 1.5755305,-2.034564 z m 2.1555804,-1.922023 c 0.1900028,0.146738 0.3619684,0.320909 0.5092156,0.521384 0.1320779,0.179821 0.2592512,0.397564 0.3323845,0.575682 0.03799,0.09261 -0.00997,0.197021 -0.1070548,0.233281 -0.097132,0.03618 -0.2066858,-0.0097 -0.2446919,-0.10203 -0.024462,-0.05949 -0.057185,-0.126352 -0.095002,-0.194932 l -0.5160896,0.284035 c -0.09033,0.04951 -0.205835,0.01984 -0.257987,-0.06582 -0.047841,-0.0789 -0.025817,-0.177978 0.047824,-0.232328 l 0.021345,-0.01325 0.5082224,-0.280121 -0.058004,-0.07534 C 6.0990692,17.361966 6.0098533,17.269087 5.9142879,17.185009 l 0.095728,-0.231452 c 0.00959,-0.023 0.016854,-0.04624 0.02193,-0.06984 l 0.00626,-0.03581 z M 5.3785666,16.438049 c -0.037541,0.0203 -0.072102,0.04707 -0.1023816,0.0789 l -0.028716,0.03304 -0.1362201,0.17591 c -0.1767152,-0.05869 -0.360228,-0.09641 -0.5461732,-0.112907 l -6.19e-5,0.641593 c 0,0.09944 -0.084556,0.180062 -0.1888563,0.180062 -0.095612,0 -0.1746328,-0.06787 -0.187136,-0.155598 l -0.00106,-0.02391 -9.53e-5,-0.645546 c -0.402063,0.02679 -0.8017965,0.155446 -1.156001,0.39185 -0.2054644,0.137178 -0.3846115,0.317432 -0.5335238,0.529215 L 3.022673,17.81924 c 0.090326,0.04953 0.1212778,0.159843 0.069144,0.245903 -0.047841,0.07894 -0.1488444,0.110332 -0.2349307,0.07654 l -0.02307,-0.0103 -0.5223079,-0.28738 c -0.032129,0.06386 -0.062035,0.129705 -0.089549,0.197197 -0.037795,0.09264 -0.1472261,0.138559 -0.2444477,0.102522 -0.097217,-0.03607 -0.1453942,-0.14029 -0.1076099,-0.23297 0.2030753,-0.498062 0.5235894,-0.922435 0.9453217,-1.203923 0.7785795,-0.519703 1.7461575,-0.590185 2.5640579,-0.26828 z"
    id="🎨-Color"
    style="fill:#cccccc;fill-rule:nonzero;stroke:none;stroke-width:0.245853" />
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="7.1723428"
    y="3.9579642"
    id="text10474"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_bike"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="7.1723428"
      y="3.9579642">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="7.1723428"
    y="9.2537889"
    id="text10634"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_motocycle"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="7.1723428"
      y="9.2537889">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="7.1723428"
    y="14.669972"
    id="text10638"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_car"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="7.1723428"
      y="14.669972">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="22.698736"
    y="3.596885"
    id="text10642"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_van"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="22.698736"
      y="3.596885">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="22.698736"
    y="8.6519909"
    id="text10646"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_truck"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="22.698736"
      y="8.6519909">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="22.698736"
    y="14.91069"
    id="text10650"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_bigTruck"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="22.698736"
      y="14.91069">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="8.9777365"
    y="19.357441"
    id="text10876"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="text_speed"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="8.9777365"
      y="19.357441">100</tspan></text>
 <text
    xml:space="preserve"
    style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke:#333333;stroke-width:0.101455;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    x="17.162191"
    y="19.357441"
    id="text11000"
    transform="scale(1.0242215,0.97635132)"><tspan
      id="tspan10998"
      style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:3.04606px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;stroke:#333333;stroke-width:0.101455;stroke-dasharray:none;stroke-opacity:1"
      x="17.162191"
      y="19.357441">km/h</tspan></text>
 <path
    style="fill:#ffffff;fill-opacity:1;stroke:#818385;stroke-width:0.524746;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
    d="M 14.800742,20.530814 V 38.316098"
    id="path4642" />
</g>
</svg>`

export const camIcon=`<svg
width="44.310345"
height="38"
viewBox="0 0 11.723778 10.054167"
version="1.1"
id="svg5"
xml:space="preserve"
xmlns="http://www.w3.org/2000/svg"
xmlns:svg="http://www.w3.org/2000/svg"><defs
  id="defs2" /><g
  id="layer1"
  transform="translate(-0.08955327,-0.11390755)"><g
    id="g185"
    transform="matrix(0.03935649,0,0,0.03935649,0.08955327,-0.72092232)"><path
      d="m 297.789,199.131 c -0.52,-3.729 -3.063,-6.936 -6.977,-8.797 L 147.847,122.366 c -2.021,-0.961 -4.178,-1.448 -6.412,-1.448 -5.776,0 -11.105,3.357 -13.576,8.555 L 121.066,143.761 91.573,129.7 c -2.44,-9.558 -9.474,-17.502 -17.474,-21.892 V 56.212 h 25.506 c 9.665,0 17.5,-7.835 17.5,-17.5 0,-9.665 -7.835,-17.5 -17.5,-17.5 H 17.5 c -9.665,0 -17.5,7.835 -17.5,17.5 0,9.665 7.835,17.5 17.5,17.5 h 21.599 v 54.156 c -9,6.163 -14.46,16.296 -14.46,27.738 0,18.744 15.21,33.993 33.954,33.993 8.646,0 16.523,-3.25 22.529,-8.585 l 24.928,11.856 -8.185,17.206 c -3.552,7.47 -0.366,16.437 7.104,19.987 l 108.051,51.37 c 2.409,1.146 5.264,1.751 8.257,1.751 4.392,0 8.751,-1.312 12.071,-3.555 l 27.754,13.195 c 1.886,0.897 3.899,1.352 5.984,1.352 5.391,0 10.364,-3.135 12.67,-7.985 l 13.247,-27.862 c 3.315,-6.973 0.338,-15.341 -6.634,-18.654 l -4.744,-2.256 11.859,-10.417 c 3.255,-2.862 4.825,-6.642 4.305,-10.371 z"
      id="path132" /></g></g></svg>`

export const camIcon_highlight=`<svg
width="44.310345"
height="38"
viewBox="0 0 11.723778 10.054167"
version="1.1"
id="svg5"
xml:space="preserve"
xmlns="http://www.w3.org/2000/svg"
xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs2" /><g
   id="layer1"
   transform="translate(-0.08955327,-0.11390755)"><g
      id="g185"
      transform="matrix(0.03935649,0,0,0.03935649,0.08955327,-0.72092232)"
      style="fill:#ff00ff"><path
      d="m 297.789,199.131 c -0.52,-3.729 -3.063,-6.936 -6.977,-8.797 L 147.847,122.366 c -2.021,-0.961 -4.178,-1.448 -6.412,-1.448 -5.776,0 -11.105,3.357 -13.576,8.555 L 121.066,143.761 91.573,129.7 c -2.44,-9.558 -9.474,-17.502 -17.474,-21.892 V 56.212 h 25.506 c 9.665,0 17.5,-7.835 17.5,-17.5 0,-9.665 -7.835,-17.5 -17.5,-17.5 H 17.5 c -9.665,0 -17.5,7.835 -17.5,17.5 0,9.665 7.835,17.5 17.5,17.5 h 21.599 v 54.156 c -9,6.163 -14.46,16.296 -14.46,27.738 0,18.744 15.21,33.993 33.954,33.993 8.646,0 16.523,-3.25 22.529,-8.585 l 24.928,11.856 -8.185,17.206 c -3.552,7.47 -0.366,16.437 7.104,19.987 l 108.051,51.37 c 2.409,1.146 5.264,1.751 8.257,1.751 4.392,0 8.751,-1.312 12.071,-3.555 l 27.754,13.195 c 1.886,0.897 3.899,1.352 5.984,1.352 5.391,0 10.364,-3.135 12.67,-7.985 l 13.247,-27.862 c 3.315,-6.973 0.338,-15.341 -6.634,-18.654 l -4.744,-2.256 11.859,-10.417 c 3.255,-2.862 4.825,-6.642 4.305,-10.371 z"
      id="path132"
      style="fill:#ff00ff" /></g></g></svg>`