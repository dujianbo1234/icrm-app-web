//引入刚才的http.js文件
import https from './http.js';

/* 获取列表 */
//查询列表，详情就是get
/* /api/getlist是请求接口地址，有http.js里面的Ip加上，如：http:192.168.0.1:9090//api/getlist  */
export const getlist = function(params) {
	return https.get('/api/getlist', params)
}

/* 新增保存检查计划 */
//保存都是post
export const saveJcInfo = function(params) {
	return https.post('/api/saveJcInfo', params)
}

export const opportCustServUpload = (params) => {return https.post('/api/marketing/opportCustServUpload', params)}
