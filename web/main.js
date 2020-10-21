import Vue from 'vue'
import App from './App.vue'
import '@/assets/index.scss'
import ZmapUI from '@'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import Defined from '@/components/zmapConfig.js'
Vue.prototype.$def = Defined

import ol from '@/ol/ol.js';
import '@/ol/ol.css'
import '@/ol/ole.css'
Vue.prototype.$ol = ol;

Vue.use(ZmapUI)
new Vue({
  el: '#app',
  render: h => h(App)
})
