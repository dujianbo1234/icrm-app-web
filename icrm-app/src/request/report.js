import { request } from "./request.js";

// 查询客户经理统计报表
export const queryCustMgrSticReport = (params,fun) => {request("report.queryCustMgrSticReport", params, fun)}
// 查询客户经理统计报表登录详情
export const queryCustMgrSticLoginDtl = (params,fun) => {request("report.queryCustMgrSticLoginDtl", params, fun)}