import {createApp} from 'vue';
import App from './App.vue';
import changePwd from './changePwd.vue';
import router from './router';
import store from './store';

import VConsole from 'vconsole'
const vConsole = new VConsole()
const app = createApp();
app.use(vConsole)

import Vant from 'vant';
import 'vant/lib/index.css';

import * as echarts from 'echarts'

import navBar from "./components/common/navbar.vue";
import orgList from "./components/common/orglist.vue";
import custList from "./components/common/custlist.vue";
import AES from "./api/AES.js";


AlipayJSBridge.call('getAPDataStorage', {
	type: "common",
	business: "business_userInfo",
	key: "kUserInfo",
}, (res) => {
	if (res && res.success && res.data) {
		var firstLoginFlag = AES.decrypt(JSON.parse(res.data).firstLoginFlag);
		if (firstLoginFlag == "0") {
			const app = createApp(changePwd)

			app.use(store)
			app.use(Vant)
			app.use(router)

			app.config.globalProperties.$echarts = echarts

			app.component('navBar', navBar)
			app.component('orgList', orgList)
			app.component('custList', custList)

			app.mount("#changePwd");
		} else if (firstLoginFlag == "1") {
			const app = createApp(App)

			app.use(store)
			app.use(Vant)
			app.use(router)

			app.config.globalProperties.$echarts = echarts

			app.component('navBar', navBar)
			app.component('orgList', orgList)
			app.component('custList', custList)

			app.mount("#app");
		}else{
			alert("获取用户登录信息失败")
			AlipayJSBridge.call('popWindow');
		}
	} else {
		alert("获取用户登录信息失败")
		AlipayJSBridge.call('popWindow');
	}
});
