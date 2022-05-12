import {createApp} from 'vue';
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