<template>
    <div id="map" ref="rootmap">
        <div
            id="mouse-position"
            style="width:180px;height:30px;position:absolute;right:30px;z-index:999;"
        ></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/map';
import View from 'ol/view';
import Feature from 'ol/feature';
import TileLayer from 'ol/layer/tile';
import OSM from 'ol/source/osm';
import XYZ from 'ol/source/xyz';
import Projection from 'ol/proj/projection';
import MousePosition from 'ol/control/mouseposition';
import Coordinate from 'ol/coordinate';
import Control from 'ol/control';

import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Text from 'ol/style/text';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Circle from 'ol/style/circle';
import Point from 'ol/geom/point';
import LineString from 'ol/geom/linestring';
import Polygon from 'ol/geom/polygon';

import extent from 'ol/extent';
import proj from 'ol/proj';

import 'ol-ext/control/LayerSwitcher.css';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import 'ol-ext/control/GeoBookmark.css';
import GeoBookmark from 'ol-ext/control/GeoBookmark';
import OverviewMap from 'ol/control/overviewmap';

export default {
    data() {
        return {
            map: null,
            features: [],
            flagLayer: null,
            lineLayer: null,
            polygonLayer: null,
            coordinates: [
                {
                    x: 66.871978,
                    y: 22.220855
                },
                {
                    x: 72.872001,
                    y: 25.225383
                }
            ]
        };
    },
    methods: {
        initMap() {
            var mapcontainer = this.$refs.rootmap;
            // 创建MousePosition控件
            var mousePositionControl = new MousePosition({
                coordinateFormat: Coordinate.createStringXY(5), // 将坐标保留4位小数位，并转换为字符串
                projection: 'EPSG:4326', // 定义投影
                //className: 'custom-mouse-position',                     // 控件的CSS类名
                target: 'mouse-position', // 将控件渲染在该DOM元素中
                undefinedHTML: '&nbsp;' // 鼠标离开地图时，显示空格
            });

            var osmLayer = new TileLayer({
                title: 'OSM Map',
                type: 'base',
                visible: true,
                source: new OSM({})
            });

            var baidusource = new XYZ({
                tilePixelRatio: 2,
                tileUrlFunction: function(tileCoord) {
                    var z = tileCoord[0];
                    var x = tileCoord[1];
                    var y = tileCoord[2];
                    //计算当前层级下瓦片总数的一半，用于定位整个地图的中心点
                    var halfTileNum = Math.pow(2, z - 1);
                    //原点移到中心点后，计算xy方向上新的坐标位置
                    var baiduX = x - halfTileNum;
                    var baiduY = y + halfTileNum;
                    if (baiduX < 0) {
                        baiduX = 'M' + -baiduX;
                    }
                    if (baiduY < 0) {
                        baiduY = 'M' + -baiduY;
                    }
                    // return (
                    //     'http://online2.map.bdimg.com/onlinelabel/?qt=tile&x=' +
                    //     baiduX +
                    //     '&y=' +
                    //     baiduY +
                    //     '&z=' +
                    //     z +
                    //     '&styles=pl&udt=20170809&scaler=2&p=0'
                    // );
                    return (
                        'http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=' +
                        baiduX +
                        '&y=' +
                        baiduY +
                        '&z=' +
                        z +
                        '&styles=pl&udt=20170809&scaler=1&p=1' //20151021   20160321
                    );
                }
            });

            this.map = new Map({
                target: 'map',
                controls: Control.defaults().extend([mousePositionControl]),
                layers: [
                    new TileLayer({
                        source: new OSM({})//baidusource
                    })
                ],
                view: new View({
                    center: [66.46, 20.92], //[116.46, 39.92]该位置地图左移、下移//[56.46, 20.92],5,china在中间
                    zoom: 6,
                    projection: 'EPSG:4326' //4326  3857
                })
            });

            //this.map.addControl(mousePositionControl);

            var layerSwitcher = new LayerSwitcher({
                tipLabel: 'Legend', // Optional label for button
                groupSelectStyle: 'children' // Can be "children" [default], "group" or "none"
            });

            var bookmark = new GeoBookmark({
                marks: {
                    lagos: { position: [3.3686, 6.5028], zoom: 12, permanent: true },
                    lagos1: { position: [3.3686, 6.5028], zoom: 12, permanent: true },
                    lagos2: { position: [3.3686, 6.5028], zoom: 12, permanent: true },
                    lagos3: { position: [3.3686, 6.5028], zoom: 12, permanent: true },
                    lagos4: { position: [3.3686, 6.5028], zoom: 12, permanent: true }
                }
            });

            this.map.addControl(layerSwitcher);
            this.map.addControl(bookmark);
            this.map.addControl(new OverviewMap());
        },
        /**
         * 变换XY坐标
         * @param e
         */
        changeXY(e) {
            const _that = this;
            _that.x = e.coordinate[0];
            _that.y = e.coordinate[1];
            console.log(_that.x, _that.y);
        },
        /**
         * 批量添加坐标点
         */
        handleAddBatchFeature() {
            const _that = this;
            // 设置图层lineLayer
            _that.flagLayer = new VectorLayer({
                source: new VectorSource()
            });
            // 添加图层
            _that.map.addLayer(_that.flagLayer);
            // 循环添加feature
            console.log('点数据量：' + this.coordinates.length);
            for (let i = 0; i < this.coordinates.length; i++) {
                // 创建feature
                let feature = new Feature({
                    geometry: new Point([_that.coordinates[i].x, _that.coordinates[i].y])
                });
                // 设置ID
                feature.setId(i);
                // 设置样式
                feature.setStyle(_that.getStyls(feature));
                // 放入features
                _that.features.push(feature);
            } // for 结束
            // 批量添加feature
            _that.flagLayer.getSource().addFeatures(_that.features);
        },
        /**
         * 设置Style
         */
        getStyls(feature) {
            let Styles = [];
            Styles.push(
                new Style({
                    image: new Icon({
                        //src: 'https://icon.qiantucdn.com/static/intro/ogc-entrance.png',   //'./static/icon/green_24px.png',
                        //src:'https://preview.qiantucdn.com/58pic/33/62/07/40W58PIC6IiefSf7b8wMj_PIC2018.png!qt324new_nowater',
                        src:
                            'data:image/png;base64,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',
                        anchor: [1, 1]
                    })
                })
            );
            // 绘制圆角矩形
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let length = (feature.id_ + '标记点').length + 1;
            canvas.width = length * 15;
            canvas.height = 35;
            let x = 0;
            let y = 0;
            let w = canvas.width;
            let h = canvas.height;
            let r = 15;
            // 缩放
            context.scale(0.8, 0.8);
            context.fillStyle = 'rgba(255,255,255,1)';
            // 绘制圆角矩形
            context.beginPath();
            context.moveTo(x + r, y);
            context.arcTo(x + w, y, x + w, y + h, r);
            context.arcTo(x + w, y + h, x, y + h, r);
            context.arcTo(x, y + h, x, y, r);
            context.arcTo(x, y, x + w, y, r);
            // 设置阴影
            context.shadowColor = 'rgba(0, 0, 0, 0.2)'; // 颜色
            context.shadowBlur = 5; // 模糊尺寸
            context.shadowOffsetX = 2; // 阴影Y轴偏移
            context.shadowOffsetY = 2; // 阴影X轴偏移
            // ----
            context.closePath();
            // 填充u
            context.fill();
            // 设置style
            Styles.push(
                new Style({
                    image: new Icon({
                        img: canvas,
                        imgSize: [w, h],
                        anchor: [0, 1]
                    }),
                    text: new Text({
                        textAlign: 'center',
                        text: '标记点' + feature.id_,
                        offsetX: 28,
                        offsetY: -17
                    })
                })
            );
            return Styles;
        },

        //line style
        linestyle_withname(name) {
            return new Style({
                fill: new Fill({
                    //矢量图层填充颜色，以及透明度
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new Stroke({
                    //边界样式
                    color: '#',
                    width: 1
                }),
                text: new Text({
                    //文本样式
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({
                        color: '#FF0000'
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    }),
                    text: name
                })
            });
        },

        addlineFeature() {
            const _that = this;
            // 设置图层
            _that.lineLayer = new VectorLayer({
                source: new VectorSource()
            });
            // 添加图层
            _that.map.addLayer(_that.lineLayer);
            // 循环添加feature
            console.log('line点数据量：' + this.coordinates.length);

            var _geometrie2 = [];

            for (let i = 0; i < this.coordinates.length; i++) {
                var temp = [_that.coordinates[i].x, _that.coordinates[i].y];
                //_geometrie[i] = temp;
                _geometrie2[i] = temp;
                //_geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
            } // for 结束
            // 创建feature
            var lineFeature = new Feature({
                //路线
                geometry: new LineString(_geometrie2, 'XY')
            });
            // 设置ID
            lineFeature.setId(66666);
            //console.log(lineFeature.getId);
            // 设置样式
            lineFeature.setStyle(_that.linestyle_withname('hhhh'));
            _that.lineLayer.getSource().addFeature(lineFeature); //注意addFeatures与addFeature
            var bbb = _that.lineLayer.getSource();
            var bbb2 = 0;
        },

        addPolygonFeature() {
            const _that = this;
            var polygonstyles = new Style({
                fill: new Fill({
                    //color: 'green'
                    color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new Stroke({
                    color: 'red',
                    width: 1
                }),
                image: new Circle({
                    radius: 3,
                    fill: new Fill({
                        color: 'red'
                    })
                })
            });

            // 设置图层
            _that.polygonLayer = new VectorLayer({
                source: new VectorSource()
            });
            // 添加图层
            _that.map.addLayer(_that.polygonLayer);
            // 循环添加feature
            console.log('polygon点数据量：' + this.coordinates.length);

            var _geometrie2 = [];

            var _geometrie = [
                [120.97, 23.1],
                [115.97, 15.1],
                [118.97, 13.1],
                [120.97, 20.1],
                [120.97, 23.1]
            ];

            var dx = -60;
            var dy = 10;

            var geostr =
                '119.770018137127 35.6861849265931,119.770061508732 35.6861799605368,119.770061423296 35.6861790980869,119.770486352064 35.686151050031,119.770779051712 35.6861317289961,119.771277812121 35.6860836242599,119.771463839585 35.6860656818857,119.771556160389 35.6860526399175,119.771929255831 35.6859999333503,119.772030568056 35.6859856206399,119.772030626512 35.6858998019343,119.772030791988 35.6856563743423,119.772030837853 35.6855884215685,119.771915587035 35.6856561549077,119.77150272627 35.685898795593,119.770881589714 35.6859834271934,119.770776601959 35.6859977309106,119.770165069263 35.6860499770249,119.770067058448 35.686063007302,119.769931382228 35.686081044105,119.769658729367 35.6861295778178,119.769548230566 35.6861492477896,119.76894122146 35.6861769406134,119.768923078537 35.686177768889,119.768816891986 35.6861826126375,119.768815118523 35.6861775602463,119.768739028683 35.6859607498887,119.768646427291 35.6856968932971,119.768629917537 35.6856498497608,119.768605397521 35.6854453727058,119.768574828665 35.685190451778,119.768422950259 35.6847688235225,119.768366900912 35.6846132237213,119.768364314462 35.6846060435341,119.768331650186 35.6845153639929,119.768248381058 35.6842841968582,119.768242336714 35.6842674173075,119.768451784322 35.6839647666607,119.768503341556 35.6838902659231,119.768542721969 35.6835956462222,119.768560892771 35.683459705601,119.768505314669 35.6833114118922,119.768405663491 35.683045521034,119.768378434717 35.6830101336108,119.768319961697 35.6829341399986,119.768102598256 35.6827590204125,119.768002575658 35.6826784366606,119.767598858301 35.6825236957121,119.767155005099 35.6824876230054,119.766900820716 35.6821559089681,119.766754262699 35.6819646465513,119.766087625843 35.6810946576924,119.765803715269 35.6807241352107,119.765786978886 35.6807022933762,119.765496652549 35.6803588926488,119.765434693756 35.6802717024771,119.764448957653 35.6802455897622,119.764467439621 35.6802698040083,119.764533994848 35.6803570031732,119.76479605999 35.6807003508406,119.764812731622 35.6807221926751,119.765095540527 35.6810927151568,119.765759592731 35.681962704915,119.765905583276 35.6821539673318,119.766158782002 35.6824856813691,119.766185698711 35.6825209437866,119.766303391189 35.682675131652,119.766364845461 35.6827556416596,119.766187289612 35.682929994124,119.76611016825 35.6830057233355,119.766092388653 35.6830410235245,119.765958697236 35.683306460225,119.765939555166 35.6834546091429,119.765921989608 35.6835905506634,119.76599690943 35.6838853933962,119.766015874333 35.6839600299315,119.766247549585 35.6842635385315,119.766260368521 35.6842803315721,119.766625393447 35.6845120499912,119.766929975838 35.6846032601324,119.766954093856 35.6846104816884,119.767256156347 35.6846360080454,119.767490064615 35.6846115240027,119.767557366279 35.6846044796131,119.767560590349 35.684611661599,119.767630455082 35.6847672874804,119.767755361021 35.6851888653739,119.767830915764 35.6854438726367,119.767853234239 35.6856483460944,119.76785836757 35.6856953680468,119.767887154868 35.6859591005321,119.767894641724 35.6861757786893,119.767894816193 35.6861808283826,119.767896577965 35.6862318235399,119.767901490062 35.6863739793757,119.767904732118 35.6864677903563,119.767916042891 35.6867951417824,119.767913746922 35.6869820991446,119.767912058894 35.6871196252706,119.767909978763 35.6872890080813,119.768757250747 35.6873437066468,119.76875151577 35.6872906367535,119.768733207372 35.6871212143726,119.768718343377 35.6869836567704,119.768742116056 35.6867967398777,119.768783737579 35.6864694918736,119.768944374483 35.6863759974544,119.769580136714 35.6862350754884,119.770018137127 35.6861849265931';
            var _geometrie3 = [];
            var point_arr = geostr.split(',');

            var points = [];

            var dx3 = 0;//-48.181;
            var dy3 = 0;//-13.538;

            for (var i = 0; i < point_arr.length; i++) {
                var point_sub_arr = point_arr[i].split(' ');
                var temp = [parseFloat(point_sub_arr[0]) + dx3, parseFloat(point_sub_arr[1]) + dy3];
                _geometrie3[i] = temp;

                points.push([temp[0], temp[1]]);
            }

            ////[116.46, 39.92]该位置地图左移、下移//[56.46, 20.92],5,china在中间

            for (let i = 0; i < _geometrie.length; i++) {
                var temp = [_geometrie[i][0] + dx, _geometrie[i][1] + dy];
                _geometrie2[i] = temp;
                //_geometrie2[i] = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
            } // for 结束
            // 创建feature
            var polygon = new Polygon([_geometrie2]).transform('EPSG:4326', this.map.getView().getProjection());
            var polygon3 = new Polygon([_geometrie3]).transform('EPSG:4326', this.map.getView().getProjection());
            console.log(this.map.getView().getProjection());
            var proper = { type: '火点' };

            var geoMarkerFeature = new Feature({
                geometry: polygon3 //(new ol.geom.Point([120.97, 23.1])).transform('EPSG:4326', map.getView().getProjection())
            });

            geoMarkerFeature.setProperties(proper, true);

            //geoMarkerFeature.setStyle(_that.linestyle_withname('polygon1'));
            //polygonstyles
            geoMarkerFeature.setStyle(polygonstyles);
            _that.polygonLayer.getSource().addFeature(geoMarkerFeature); //注意addFeatures与addFeature

            _that.getMaxExtent_simple_point(this.map, points);

            //this.map.getView().setCenter(extent.getCenter(polygonstyles.getGeometry().getExtent()));//getExtent nofound
        },

        getMaxExtent_simple_point(map, poisList) {
            var _lonArr = new Array();
            var _latArr = new Array();
            for (var i = 0; i < poisList.length; i++) {
                _lonArr[i] = poisList[i][0];
                _latArr[i] = poisList[i][1];
            }
            _lonArr.sort(this.sortNumber);
            _latArr.sort(this.sortNumber);
            var _poiTemp = [_lonArr[0], _latArr[0]];
            //_poiTemp=this.LonlatCorrect(_poiTemp);
            var _lonlat = _poiTemp; //ol.proj.transform(_poiTemp, 'EPSG:4326', 'EPSG:3857');//_poiTemp; //
            var _poiTemp2 = [_lonArr[poisList.length - 1], _latArr[poisList.length - 1]];
            //_poiTemp2=this.LonlatCorrect(_poiTemp2);
            var _lonlat2 = _poiTemp2; //ol.proj.transform(_poiTemp2, 'EPSG:4326', 'EPSG:3857');//_poiTemp2; //
            var minx = _lonlat[0];
            var miny = _lonlat[1];
            var maxx = _lonlat2[0];
            var maxy = _lonlat2[1];
            if (minx == maxx) {
                minx = minx - 1000.0;
                minx = minx + 1000.0;
            }
            if (miny == maxy) {
                miny = miny - 1000.0;
                miny = miny + 1000.0;
            }
            var size = map.getSize();
            var _extent = [minx, miny, maxx, maxy];
            if (maxx > minx) {
                map.getView().fit(_extent, size, { padding: [300, 300, 300, 300], constrainResolution: false });
            }
            if (poisList.length == 1) {
                map.getView().setCenter(_lonlat);
                map.getView().setZoom(16);
            }
        },

        sortNumber(a, b) {
            //a,b表示数组中的任意两个元素，若return > 0 b前a后；reutrn < 0 a前b后；a=b时存在浏览器兼容
            return a - b; //升序
        }
    },
    mounted() {
        this.initMap();
        this.handleAddBatchFeature();
        //this.addlineFeature();
        this.addPolygonFeature();
        this.map.on('singleclick', this.changeXY);
    }
};
</script>

<style>
#map {
    width: 100%;
    height: 100%;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
    display: none;
}
</style>