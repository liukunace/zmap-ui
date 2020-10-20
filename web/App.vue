<template>
  <div id="app">
    <img src="@/assets/zhiyun.png">
    <h1>{{ msg }}</h1>
    <div class="pb48 underline">
      <h2>一.按钮组件</h2>
      <p>1.按钮样式：type</p>
      <zmap-button>default</zmap-button>
      <zmap-button type="success">success</zmap-button>
      <zmap-button type="error">error</zmap-button>
      <zmap-button type="warning">warning</zmap-button>
      <zmap-button type="info" style="min-width:120px">info</zmap-button>
      <p>2.按钮大小：size</p>
      <zmap-button>default</zmap-button>
      <zmap-button size="small">small</zmap-button>
      <zmap-button size="medium">medium</zmap-button>
      <zmap-button size="large">large</zmap-button>
      <p>3.按钮形状：shape</p>
      <zmap-button>default</zmap-button>
      <zmap-button shape="circle" type="info">circle</zmap-button>
      <zmap-button shape="rectangle" type="info">rectangle</zmap-button>
      <p>4.按钮禁用：isDisabled</p>
      <zmap-button isDisabled>default</zmap-button>
      <zmap-button type="success" isDisabled>success</zmap-button>
      <zmap-button type="error" isDisabled>error</zmap-button>
      <zmap-button type="warning" isDisabled>warning</zmap-button>
      <zmap-button type="info" isDisabled>info</zmap-button>
    </div>
    <div class="pt48 underline">
      <h2>二.弹窗组件</h2>
      <p>1.弹窗样式</p>
      <zmap-button @click="show1=true">default</zmap-button>
      <zmap-modal
        @on-ok="show1=false"
        @on-cancel="show1=false"
        :isShow="show1"></zmap-modal>
      <p>2.弹窗自定义内容</p>
      <zmap-button @click="show2=true">自定义内容</zmap-button>
      <zmap-button @click="show3=true">自定义宽度</zmap-button>
      <zmap-modal
        @on-ok="show2=false"
        @on-cancel="show2=false"
        :isShow="show2">
        <template>自定义文字</template>
        <template slot="modal-title">
          <p>Hello World!</p>
        </template>
        <template slot="modal-body">
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </template>
        <template slot="modal-footer">
          <zmap-button type="warning" @click="show2=false">取消</zmap-button>
        </template>
      </zmap-modal>
      <zmap-modal
        @on-ok="show3=false"
        @on-cancel="show3=false"
        :width="300"
        :isShow="show3"></zmap-modal>
      <p>3.弹窗自定义大小</p>
      <zmap-button @click="showSize('small')">small</zmap-button>
      <zmap-button @click="showSize('medium')">medium</zmap-button>
      <zmap-button @click="showSize('large')">large</zmap-button>
      <zmap-button @click="showSize('full')">full</zmap-button>
      <zmap-modal
        @on-ok="show4=false"
        @on-cancel="show4=false"
        :size="size"
        :isShow="show4"></zmap-modal>
      <p></p>
    </div>
    <div class="pt48 underline">
      <h2>三.自定义选择器</h2>
      <p>1.多选选择器</p>
      <zmap-select v-model="data" multiple class="blaba">
        <zmap-option label="测试1" value="test"></zmap-option>
        <zmap-option label="测试2" value="test2"></zmap-option>
        <zmap-option label="测试3" value="test3"></zmap-option>
        <zmap-option label="测试4" value="test4"></zmap-option>
        <zmap-option label="测试5" value="test5"></zmap-option>
      </zmap-select>
      <p></p>
    </div>
  </div>
</template>

<script>
// import Button from '@/components/Button/Button'
// import Modal from '@/components/Modal/Modal'
export default {
  name: 'app',
  // components: {
  //   zmapButton: Button,
  //   zmapModal: Modal,
  // },
  data () {
    return {
      msg: '欢迎使用 zmap-ui，智耘科技',
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      size: '',
      data: ['test'],
    }
  },
  methods: {
    showSize(item) {
      this.size = item
      this.show4 = true
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding-bottom: 200px;
}

.blaba{
  width: 120px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.pt48, .py48 {
  padding-top: 48px;
}
.pb48, py48 {
  padding-bottom: 48px;
}
.underline {border-bottom: 1px solid #ccc;}
</style>
