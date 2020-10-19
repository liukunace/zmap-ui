import Vue from 'vue'
import App from './App.vue'
import '@/assets/index.scss'
import ZmapVue from '@'

Vue.use(ZmapVue)
new Vue({
  el: '#app',
  render: h => h(App)
})
