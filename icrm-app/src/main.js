import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VConsole from 'vconsole'

import Vant from 'vant';
import 'vant/lib/index.css';

import * as echarts from 'echarts';

import navBar from "./components/common/navbar.vue";
import orgList from "./components/common/orglist.vue";
import custList from "./components/common/custlist.vue";

import AES from "./api/AES.js";

const app = createApp(App)

app.use(store)
app.use(Vant)
app.use(router)

app.config.globalProperties.$echarts = echarts

app.component('navBar', navBar)
app.component('orgList', orgList)
app.component('custList', custList)

app.mount("#app");

// 添加环境变量的判断
if(process.env.NODE_ENV == 'development'){
	const vConsole = new VConsole()
	app.use(vConsole)
}

// import AMapLoader from '@amap/amap-jsapi-loader';

// AMapLoader.load({
// 	"key": "72d1649946bff1cf01ae6511543e985a", // 申请好的Web端开发者Key，首次调用 load 时必填
// 	"version": "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
// 	"plugins": [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
// }).then((AMap) => {
// 	map = new AMap.Map('container');
// }).catch(e => {
// 	console.log(e);
// })
