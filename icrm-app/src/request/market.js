import { request } from "./request.js";

// 查询商机总数
export const queryCommercialOpportunityCount = (params,fun) => {request("market.queryCommercialOpportunityCount", params, fun)}
// 查询商机列表
export const queryCommercialOpportunityList = (params,fun) => {request("market.queryCommercialOpportunityList", params, fun)}
// 查询短信审批列表
export const queryMessageApproveList = (params,fun) => {request("market.queryMessageApproveList", params, fun)}
// 查询商机汇总
export const queryCmrcOpportunitySum = (params,fun) => {request("market.queryCmrcOpportunitySum", params, fun)}
// 查询商机汇总列表
export const queryCmrcOpportunitySumList = (params,fun) => {request("market.queryCmrcOpportunitySumList", params, fun)}
// 查询商机列表
export const queryCmrcOpportunityList = (params,fun) => {request("market.queryCmrcOpportunityList", params, fun)}
// 查询商机详情
export const queryCmrcOpportunityDetail = (params,fun) => {request("market.queryCmrcOpportunityDetail", params, fun)}
// 查询商机实用度
export const queryOpportPractialInfo = (params,fun) => {request("market.queryOpportPractialInfo", params, fun)}
// 保存商机实用度
export const saveOpportPractialInfo = (params,fun) => {request("market.saveOpportPractialInfo", params, fun)}