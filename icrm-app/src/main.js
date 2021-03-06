import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VConsole from 'vconsole'
// 全局引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
// 全局引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 全局引入echarts
import * as echarts from 'echarts';

import navBar from "./components/common/navbar.vue";
import orgList from "./components/common/orglist.vue";
import custList from "./components/common/custlist.vue";

// import AES from "./api/AES.js";

const app = createApp(App)

app.use(store)
app.use(Vant)
app.use(router)
app.use(ElementPlus)
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

