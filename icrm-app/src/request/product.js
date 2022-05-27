import { request } from "./request.js";

// 查询事件提醒汇总
export const queryWarningRmdMgtSum = (params,fun) => {request("product.queryWarningRmdMgtSum", params, fun)}
// 查询事件提醒列表
export const queryWarningRmdMgtList = (params,fun) => {request("product.queryWarningRmdMgtList", params, fun)}
// 事件提醒列表短信全部发送
export const addWarningMgtMessageSend = (params,fun) => {request("product.addWarningMgtMessageSend", params, fun)}
// 更新事件提醒状态
export const updateWarningRmdMgtStatus = (params,fun) => {request("product.updateWarningRmdMgtStatus", params, fun)}