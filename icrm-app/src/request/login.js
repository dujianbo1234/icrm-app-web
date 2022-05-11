import { request } from "./request.js";

// 用户登录
export const login = (params,fun) => {request("login.login", params, fun)}
// 用户注销登录
export const loginout = (params,fun) => {request("login.loginout", params, fun)}
// 用户密码修改
export const editPwd = (params,fun) => {request("login.editPwd", params, fun)}
// 用户密码修改
export const resetPassword = (params,fun) => {request("login.resetPassword", params, fun)}
// 获取用户角色列表
export const getRoleList = (params,fun) => {request("login.getRoleList", params, fun)}
// 获取用户角色列表
export const roleSwitch = (params,fun) => {request("login.roleSwitch", params, fun)}
// 获取用户多元登录标识
export const getEmpMultLoginFlag = (params,fun) => {request("login.getEmpMultLoginFlag", params, fun)}
// 修改用户多元登录标识
export const updateEmpMultLoginFlag = (params,fun) => {request("login.updateEmpMultLoginFlag", params, fun)}
// 更新首次签约保密协议标识
export const updateFirstSignFlag = (params,fun) => {request("login.updateFirstSignFlag", params, fun)}
// 获取系统配置信息
export const getIcrmConfigInfo = (params,fun) => {request("login.getIcrmConfigInfo", params, fun)}