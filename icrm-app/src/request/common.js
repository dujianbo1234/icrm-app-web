import { request } from "./request.js";

// 获取码值
export const getSysCodeByType = (params,fun) => {request("common.getSysCodeByType", params, fun)}
// 获取机构列表
export const getOrgTree = (params,fun) => {request("common.getOrgTree", params, fun)}
// 获取机构列表（含权限控制）
export const getOrgTreeByAuth = (params,fun) => {request("common.getOrgTreeByAuth", params, fun)}