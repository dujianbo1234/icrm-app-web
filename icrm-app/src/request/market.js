import { request } from "./request.js";

// 查询商机总数
export const queryCommercialOpportunityCount = (params,fun) => {request("market.queryCommercialOpportunityCount", params, fun)}
// 查询商机列表
export const queryCommercialOpportunityList = (params,fun) => {request("market.queryCommercialOpportunityList", params, fun)}
// 短信审批发送
export const approveMessageSendApply = (params,fun) => {request("market.approveMessageSendApply", params, fun)}
// 查询短信审批列表
export const queryMessageApproveList = (params,fun) => {request("market.queryMessageApproveList", params, fun)}
// 查询商机汇总
export const queryCmrcOpportunitySum = (params,fun) => {request("market.queryCmrcOpportunitySum", params, fun)}
// 查询商机汇总信息
export const queryCmrcOpportunitySumInfo = (params,fun) => {request("market.queryCmrcOpportunitySumInfo", params, fun)}
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
// 查询商机跟进记录
export const queryOpportCustServList = (params,fun) => {request("market.queryOpportCustServList", params, fun)}
// 保存商机跟进记录
export const saveOpportCustServInfo = (params,fun) => {request("market.saveOpportCustServInfo", params, fun)}
// 商机跟进上传图片
export const opportCustServUploadMpaas = (params,fun) => {request("market.opportCustServUpload", params, fun)}
//商机排行榜
export const queryCmrcOpportRankList = (params,fun) => {request("market.queryCmrcOpportRankList", params, fun)}
//必办列表查询
export const queryEmployeeMustDoList = (params,fun) => {request("market.queryEmployeeMustDoList", params, fun)}
//客户拜访详情
export const queryCustomeServicFollow = (params,fun) => {request("custserv.queryCustomeServicFollow", params, fun)}
//必办现场定位
export const followEmployeeMustDo = (params,fun) => {request("market.followEmployeeMustDo", params, fun)}

