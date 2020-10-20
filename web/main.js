import Vue from 'vue'
import App from './App.vue'
import OlMapWeb from './OlMapWeb.vue'
import '@/assets/index.scss'
import ZmapVue from '@'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(ZmapVue)
new Vue({
  el: '#app',
  render: h => h(App)
})
