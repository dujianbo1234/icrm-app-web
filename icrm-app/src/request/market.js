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
// 商机排行榜
export const queryCmrcOpportRankList = (params,fun) => {request("market.queryCmrcOpportRankList", params, fun)}
// 必办列表查询
export const queryEmployeeMustDoList = (params,fun) => {request("market.queryEmployeeMustDoList", params, fun)}
// 客户拜访详情
export const queryCustomeServicFollow = (params,fun) => {request("custserv.queryCustomeServicFollow", params, fun)}
// 客户拜访电话跟进信息
export const custServiceUpdate = (params,fun) => {request("custserv.custServiceUpdate", params, fun)}
// 必办现场定位
export const followEmployeeMustDo = (params,fun) => {request("market.followEmployeeMustDo", params, fun)}
// 必办详情查询
export const queryEmployeeMustDoDetail = (params,fun) => {request("market.queryEmployeeMustDoDetail", params, fun)}
// 查询客户维护信息
export const queryCustMaintainInfo = (params,fun) => {request("market.queryCustMaintainInfo", params, fun)}
// 分配商机信息
export const distributeCmrcOpport = (params,fun) => {request("market.distributeCmrcOpport", params, fun)}
// 查询商机客户持有产品
export const queryOpportCustHoldPrd = (params,fun) => {request("market.queryOpportCustHoldPrd", params, fun)}
// 定期存款产品明细查询
export const queryCustTimeDepAcctInfo = (params,fun) => {request("market.queryCustTimeDepAcctInfo", params, fun)}
// 活期存款产品明细查询
export const queryCustCurrDepAcctInfo = (params,fun) => {request("market.queryCustCurrDepAcctInfo", params, fun)}
// 贷款产品明细查询
export const queryCustLoanAcctInfo = (params,fun) => {request("market.queryCustLoanAcctInfo", params, fun)}
// 理财产品明细查询
export const queryCustFinaAcctInfo = (params,fun) => {request("market.queryCustFinaAcctInfo", params, fun)}
// 理财交易明细查询
export const queryCustFinaTranInfo = (params,fun) => {request("market.queryCustFinaTranInfo", params, fun)}
// 基金产品明细查询
export const queryCustFundAcctInfo = (params,fun) => {request("market.queryCustFundAcctInfo", params, fun)}
// 保险产品明细查询
export const queryCustBassAcctInfo = (params,fun) => {request("market.queryCustBassAcctInfo", params, fun)}
// 信托产品明细查询
export const queryCustTrustAcctInfo = (params,fun) => {request("market.queryCustTrustAcctInfo", params, fun)}
// 保存应用浏览记录
export const saveSmAppVisitInfo = (params,fun) => {request("market.saveSmAppVisitInfo", params, fun)}
// 查询应用浏览记录汇总
export const querySmAppVisitSum = (params,fun) => {request("market.querySmAppVisitSum", params, fun)}
// 全部短信发送申请审批
export const approveAllMessageSendApply = (params,fun) => {request("market.approveAllMessageSendApply", params, fun)}
// 商机评分进度条
export const queryOpportunityScoringProgress = (params,fun) => {request("market.queryOpportunityScoringProgress", params, fun)}
// 商机评分人数
export const queryOpportPractialCount = (params,fun) => {request("market.queryOpportPractialCount", params, fun)}
// 查询代发单位列表
export const queryCustAgentCompanyList = (params,fun) => {request("market.queryCustAgentCompanyList", params, fun)}
// 查询筛选结果列表
export const queryFilterResultList = (params,fun) => {request("market.queryFilterResultList", params, fun)}
// 保存动态群组
export const saveGroupActiveInfo = (params,fun) => {request("market.saveGroupActiveInfo", params, fun)}
// 查询筛选结果汇总
export const queryFilterResultSum = (params,fun) => {request("market.queryFilterResultSum", params, fun)}
// 查询动态群组列表
export const queryGroupActiveList = (params,fun) => {request("market.queryGroupActiveList", params, fun)}
// 删除动态群组
export const deleteGroupActiveInfo = (params,fun) => {request("market.deleteGroupActiveInfo", params, fun)}
// 查询动态群组客户
export const queryGroupActiveCust = (params,fun) => {request("market.queryGroupActiveCust", params, fun)}
// 查询筛选结果总数
export const queryFilterResultCount = (params,fun) => {request("market.queryFilterResultCount", params, fun)}
// 查询固定群组列表
export const queryGroupFixList = (params,fun) => {request("market.queryGroupFixList", params, fun)}
// 保存固定群组客户
export const saveGroupFixCust = (params,fun) => {request("market.saveGroupFixCust", params, fun)}
// 查询固定群组客户
export const queryGroupFixCust = (params,fun) => {request("market.queryGroupFixCust", params, fun)}
// 删除固定群组
export const deleteGroupFixInfo = (params,fun) => {request("market.deleteGroupFixInfo", params, fun)}
// 删除固定群组客户
export const deleteGroupFixCust = (params,fun) => {request("market.deleteGroupFixCust", params, fun)}
// 保存动态群组
export const saveGroupFixInfo = (params,fun) => {request("market.saveGroupFixInfo", params, fun)}
// 选择客户列表查询
export const querySelCustList = (params,fun) => {request("market.querySelCustList", params, fun)}
// 添加固定群组客户
export const addGroupFixSelCust = (params,fun) => {request("market.addGroupFixSelCust", params, fun)}
// 添加动态群组批量短信
export const addGroupActiveMessageSend = (params,fun) => {request("market.addGroupActiveMessageSend", params, fun)}
// 添加固定群组批量短信
export const addGroupFixMessageSend = (params,fun) => {request("market.addGroupFixMessageSend", params, fun)}