import { request } from "./request.js";

// 获取用户信息
export const getEmpInfo = (params,fun) => {request("theme.getEmpInfo", params, fun)}
// 添加系统建议信息
export const addSysPrpslInfo = (params,fun) => {request("theme.addSysPrpslInfo", params, fun)}