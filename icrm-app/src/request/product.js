import { request } from "./request.js";

// 查询事件提醒汇总
export const queryWarningRmdMgtSum = (params,fun) => {request("product.queryWarningRmdMgtSum", params, fun)}
// 查询事件提醒列表
export const queryWarningRmdMgtList = (params,fun) => {request("product.queryWarningRmdMgtList", params, fun)}