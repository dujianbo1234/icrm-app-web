import { request } from "./request.js";

// 查询商机总数
export const queryCommercialOpportunityCount = (params,fun) => {request("market.queryCommercialOpportunityCount", params, fun)}
// 查询商机列表
export const queryCommercialOpportunityList = (params,fun) => {request("market.queryCommercialOpportunityList", params, fun)}


// 查询商机汇总
export const queryCmrcOpportunitySum = (params,fun) => {request("market.queryCmrcOpportunitySum", params, fun)}
// 查询商机汇总列表
export const queryCmrcOpportunitySumList = (params,fun) => {request("market.queryCmrcOpportunitySumList", params, fun)}