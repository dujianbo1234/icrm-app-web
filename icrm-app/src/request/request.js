import store from "../store/index.js";
import {
	Toast
} from "vant";

export const request = (url, params, fun) => {
	var operationType = "com.pactera.madp.JJbank." + url,
		requestData = [{
			"_requestBody": params
		}],
		headers = {};
	AlipayJSBridge.call("rpc", {
		operationType,
		requestData,
		headers
	}, (res) => {
		if (res.code == 0) {
			fun(res)
		} else if (res.code == 1) {
			if(process.env.NODE_ENV == 'development'){
				console.log('传值',params,'报错信息',res)
			}
			Toast.fail(res.msg)
			return;
		} else if (res.code == 2) {
			Toast.clear()
			alert("登录失效，请重新登录")
			AlipayJSBridge.call('popWindow');
			return;
		}else{
			if(process.env.NODE_ENV == 'development'){
				console.log('传值',params,'报错信息',res)
			}
			Toast.fail("当前接口出错")
		}
	})
}
