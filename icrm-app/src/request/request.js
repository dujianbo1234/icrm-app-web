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
			Toast.fail(res.msg)
			return;
		} else if (res.code == 2) {
			Toast.clear()
			alert("登录失效，请重新登录")
			AlipayJSBridge.call('popWindow');
			return;
		}else{
			Toast.fail("当前接口出错")
		}
	})
}
