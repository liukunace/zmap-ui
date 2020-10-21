<template>
  <div id="map" ref="rootmap" @click="clickBtn">
    <slot></slot>
  </div>
</template>

<script>
  import Map from "ol/map";
  import "ol/ol.css";
  import TileLayer from "ol/layer/tile";
  import OSM from "ol/source/osm";
  import XYZ from 'ol/source/xyz';
  import View from "ol/view";
  import MousePosition from "ol/control/mouseposition";
  import Style from 'ol/style/style';
  import Text from 'ol/style/text';
  import Stroke from 'ol/style/stroke';
  import Fill from 'ol/style/fill';
  import Circle from 'ol/style/circle';
  import Point from 'ol/geom/point';
  import LineString from 'ol/geom/linestring';
  import Polygon from 'ol/geom/polygon';
  import Button from "@/components/Button/Button";
  import zmap from "@/components/zmapConfig";
  import LayerSwitcher from "@/components/ol/control/LayerSwitcher";
  import '@/components/ol/control/LayerSwitcher.css';
  import Overview from "@/components/ol/control/Overview";
  import '@/components/ol/control/Overview.css';
  import GeoBookmark from "@/components/ol/control/GeoBookmark";
  import '@/components/ol/control/GeoBookmark.css';
  import Tile from "ol/layer/Tile";
  import Stamen from "ol/source/Stamen";

  export default {
    name: "Map",
    components: {Button},
    display: 'Z地图',
    data() {
      return {
        preCls: 'zmap-map',
        map: null,
        layers:null,
        overLayers:null
      }
    },
    props: {
      isDisabled: Boolean,
      overView: {
        type: String,
        default: '',//'left', 'right'
      },
    },
    methods: {
      initMap() {
        let mousePositionControl = new MousePosition({
          //coordinateFormat: Coordinate.createStringXY(5), // 将坐标保留4位小数位，并转换为字符串(ol4)
          projection: 'EPSG:4326', // 定义投影
          //className: 'custom-mouse-position',                     // 控件的CSS类名
          target: 'mouse-position', // 将控件渲染在该DOM元素中
          undefinedHTML: '&nbsp;' // 鼠标离开地图时，显示空格
        });
        let osmLayer=new TileLayer({
          title: "底图（osm）",
          baseLayer: true,
          source: new OSM({})
        });

        let stamenLayer=new Tile({
          title: "水域（water）",
          baseLayer: false,
          source: new Stamen({layer: 'watercolor'})
        });

        this.overLayers=[osmLayer];

        this.map = new Map({
          target: 'map',
          //controls: Control.defaults().extend([mousePositionControl]),(ol4)
          layers: [ osmLayer,stamenLayer],
          view: new View({
            //center: [66.46, 20.92], //[116.46, 39.92]该位置地图左移、下移//[56.46, 20.92],5,china在中间
            zoom: 15,
            center: [270148, 6247782],
            //projection: 'EPSG:3857'
          })
        });
        zmap.setMap(this.map);
      },
      clickBtn(ev) {
        this.$emit('click', ev);
        console.log("点击地图blabla;");
        ev.preventDefault();
      }
    },
    mounted() {
      let ol=this.$ol;
      this.initMap();
      if(this.overView!=""){
        console.log(this.overView)
        let ov = new Overview({
          layers:this.overLayers,
          collapsed: true,
          minZoom:7,
          maxZoom:13,
          align: this.overView,
          style: [ new Style({
            image: new Circle({
              fill: new Fill({
                color: 'rgba(0,255,102, 1)'
              }),
              stroke: new Stroke({
                width: 7,
                color: 'rgba(0,255,102, 0.8)'
              }),
              radius: 5
            }),
            stroke: new Stroke({
              width: 3,
              color: "rgba(0,255,102,1)",
              lineDash: [5, 5]
            })
          })]
        });
        this.map.addControl(ov);
      }

      let layerSwitcher = new LayerSwitcher({
        tipLabel: 'Legend',
        groupSelectStyle: 'children'
      });
      this.map.addControl(layerSwitcher);
      let bookmark = new GeoBookmark({
        marks:
          {
            北京: {pos:ol.proj.transform([116.399957,39.91582], 'EPSG:4326', 'EPSG:3857'), zoom:12 ,permanent: true},
            巴黎: {pos:ol.proj.transform([2.351828, 48.856578], 'EPSG:4326', 'EPSG:3857'), zoom:11, permanent: true },
            伦敦: {pos:ol.proj.transform([-0.1275,51.507222], 'EPSG:4326', 'EPSG:3857'), zoom:11, permanent: true },
            柏林: {pos:ol.proj.transform([13.383333,52.516667], 'EPSG:4326', 'EPSG:3857'), zoom:12, permanent: true },
            罗马: {pos:ol.proj.transform([12.48657,41.888732], 'EPSG:4326', 'EPSG:3857'), zoom:12 },
          }
      });
      this.map.addControl(bookmark);
    }
  }
</script>
<style>
  /*隐藏ol的一些自带元素*/
  .ol-attribution,
  .ol-zoom {
    display: none;
  }
</style>
