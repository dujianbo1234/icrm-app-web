import { request } from "./request.js";

// 查询存量客户列表
export const queryCustSearchList = (params,fun) => {request("custinfo.queryCustSearchList", params, fun)}
// 客户基础信息查询
export const queryCustBaseInfo = (params,fun) => {request("custinfo.queryCustBaseInfo", params, fun)}
// 客户联系列表查询
export const queryCustContactList = (params,fun) => {request("custinfo.queryCustContactList", params, fun)}
// 客户联系保存
export const saveCustContactInfo = (params,fun) => {request("custinfo.saveCustContactInfo", params, fun)}
// 客户联系删除
export const delCustContactInfo = (params,fun) => {request("custinfo.delCustContactInfo", params, fun)}
// 客户地址列表查询
export const queryCustAddressList = (params,fun) => {request("custinfo.queryCustAddressList", params, fun)}
// 客户地址保存
export const saveCustAddressInfo = (params,fun) => {request("custinfo.saveCustAddressInfo", params, fun)}
// 客户地址删除
export const delCustAddressInfo = (params,fun) => {request("custinfo.delCustAddressInfo", params, fun)}
// 资产分析负债查询
export const queryCustAssetAnalyInfo = (params,fun) => {request("custinfo.queryCustAssetAnalyInfo", params, fun)}
// 客户服务新增(打电话)
export const custServiceAdd = (params,fun) => {request("custserv.custServiceAdd", params, fun)}
// 查询资产总览(AUM趋势图) 
export const queryAssetsAUMGrowthTrend = (params,fun) => {request("custinfo.queryAssetsAUMGrowthTrend", params, fun)}
// 客户标签信息查询
export const queryCustTagInfo = (params,fun) => {request("custinfo.queryCustTagInfo", params, fun)}
// 自定义签信息查询
export const queryCustDefinedLabel = (params,fun) => {request("custinfo.queryCustDefinedLabel", params, fun)}
// 自定义签保存/修改
export const saveCustDefinedLabel = (params,fun) => {request("custinfo.saveCustDefinedLabel", params, fun)}
// 自定义签删除
export const delCustDefinedLabel = (params,fun) => {request("custinfo.delCustDefinedLabel", params, fun)}
// 客户持有产品查询
export const queryCustHoldPrdInfo = (params,fun) => {request("custinfo.queryCustHoldPrdInfo", params, fun)}
// 定期存款产品明细
export const queryCustTimeDepAcctInfo = (params,fun) => {request("custinfo.queryCustTimeDepAcctInfo", params, fun)}
// 活期存款产品明细
export const queryCustCurrDepAcctInfo = (params,fun) => {request("custinfo.queryCustCurrDepAcctInfo", params, fun)}
// 贷款产品明细查询
export const queryCustLoanAcctInfo = (params,fun) => {request("custinfo.queryCustLoanAcctInfo", params, fun)}
// 理财产品明细查询
export const queryCustFinaAcctInfo = (params,fun) => {request("custinfo.queryCustFinaAcctInfo", params, fun)}
// 理财交易明细查询
export const queryCustFinaTranInfo = (params,fun) => {request("custinfo.queryCustFinaTranInfo", params, fun)}
// 基金产品明细查询
export const queryCustFundAcctInfo = (params,fun) => {request("custinfo.queryCustFundAcctInfo", params, fun)}
// 保险产品明细查询
export const queryCustBassAcctInfo = (params,fun) => {request("custinfo.queryCustBassAcctInfo", params, fun)}
// 信托产品明细查询
export const queryCustTrustAcctInfo = (params,fun) => {request("custinfo.queryCustTrustAcctInfo", params, fun)}
// 推荐产品信息查询
export const queryRecommendProdList = (params,fun) => {request("custinfo.queryRecommendProdList", params, fun)}
// 交易行为分析查询
export const queryCustTranFlowInfo = (params,fun) => {request("custinfo.queryCustTranFlowInfo", params, fun)}
// 客户签约产品查询
export const queryCustSignPrdInfo = (params,fun) => {request("custinfo.queryCustSignPrdInfo", params, fun)}
// 签约产品明细查询
export const queryCustSignPrdList = (params,fun) => {request("custinfo.queryCustSignPrdList", params, fun)}
// 图片上传
export const custServUpload = (params,fun) => {request("custserv.custServUpload", params, fun)}
// 查询商机列表
export const queryCmrcOpportunityList = (params,fun) => {request("custinfo.queryCustViewOpportunityList", params, fun)}  
// 查询潜在客户列表
export const queryCustBaseInfoList = (params,fun) => {request("custinfo.queryCustBaseInfoList", params, fun)}
// 查询客户经理
export const queryCustManagers = (params,fun) => {request("custinfo.queryCustManagers", params, fun)}
// 查询客户经理列表
export const queryCustManagerList = (params,fun) => {request("custinfo.queryCustManagerList", params, fun)}
// 查询潜在客户统计数量
export const queryCustOrgMangerCount = (params,fun) => {request("custinfo.queryCustOrgMangerCount", params, fun)}
// 查询重要潜客列表
export const queryCustomersInfoList = (params,fun) => {request("custinfo.queryCustomersInfoList", params, fun)}
// 新增重要潜客信息
export const saveCustomersInfo = (params,fun) => {request("custinfo.saveCustomersInfo", params, fun)}
// 分配重要潜客信息
export const updatePoteCustomersInfo = (params,fun) => {request("custinfo.updatePoteCustomersInfo", params, fun)}
// 删除重要潜客信息
export const deleteCustomersMarketing = (params,fun) => {request("custinfo.deleteCustomersMarketing", params, fun)}
// 获取重要潜客营销信息列表
export const queryPoteCustomersMarketing = (params,fun) => {request("custinfo.queryPoteCustomersMarketing", params, fun)}
// 新增重要潜客营销信息
export const saveCustomersMarketing = (params,fun) => {request("custinfo.saveCustomersMarketing", params, fun)}
// 查询短信模板列表
export const queryMessageTemplateListForOption = (params,fun) => {request("custinfo.queryMessageTemplateListForOption", params, fun)}
// 查询短信敏感词列表
export const queryMessageKeyWordList = (params,fun) => {request("custinfo.queryMessageKeyWordList", params, fun)}
// 查询短信关键字校验
export const queryMessageKeyWordCheck = (params,fun) => {request("custinfo.queryMessageKeyWordCheck", params, fun)}
// 添加实时短信发送信息
export const addEsbMessageSendInfo = (params,fun) => {request("custinfo.addEsbMessageSendInfo", params, fun)}
// 添加短信发送信息
export const addMessageSendInfo = (params,fun) => {request("custinfo.addMessageSendInfo", params, fun)}
// 添加短信全部发送
export const addCustSearchMessageSend = (params,fun) => {request("custinfo.addCustSearchMessageSend", params, fun)}
// 预估获客数和预估成交额汇总
export const queryCustBaseSummary = (params,fun) => {request("custinfo.queryCustBaseSummary", params, fun)}