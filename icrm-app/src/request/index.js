import { request } from "./request.js";

// 查询首页数据日期
export const queryBusiDt = (params,fun) => {request("index.queryBusiDt", params, fun)}
// 查询首页客户经理日报
export const queryHomeDayReportList = (params,fun) => {request("index.queryHomeDayReportList", params, fun)}
// 查询首页机构日报
export const queryHomeOrgDayReportList = (params,fun) => {request("index.queryHomeOrgDayReportList", params, fun)}
// 查询首页客户概貌
export const queryHomPeCstAum = (params,fun) => {request("index.queryHomPeCstAum", params, fun)}
// 查询首页客户aum余额分布图
export const queryHomPeCstBalDgrm = (params,fun) => {request("index.queryHomPeCstBalDgrm", params, fun)}
// 查询首页客户资产等级分布图
export const queryAst = (params,fun) => {request("index.queryAst", params, fun)}
// 查询首页客户服务等级分布图
export const queryHomPeCstSvrLvlDgrm = (params,fun) => {request("index.queryHomPeCstSvrLvlDgrm", params, fun)}
// 查询首页VIP客户数
export const queryHomCusts = (params,fun) => {request("index.queryHomCusts", params, fun)}
// 查询系统跑批日期
export const querySysDate = (params,fun) => {request("index.querySysDate", params, fun)}
// 查询业绩排名-机构
export const queryOrgSaleRankList = (params,fun) => {request("index.queryOrgSaleRankList", params, fun)}
// 查询当前用户的业绩排名-机构、团队
export const querySaleRankByEmpID = (params,fun) => {request("index.querySaleRankByEmpID", params, fun)}
// 查询业绩排名-团队
export const queryGroupSaleRankList = (params,fun) => {request("index.queryGroupSaleRankList", params, fun)}
// 查询业绩排名-团战详情
export const queryGroupRankDetails = (params,fun) => {request("index.queryGroupRankDetails", params, fun)}
// 查询业绩排名-直营中心
export const queryDirectSaleRankList = (params,fun) => {request("index.queryDirectSaleRankList", params, fun)}
// 查询业绩排名-直营中心团队详情
export const queryDirectRankDetails = (params,fun) => {request("index.queryDirectRankDetails", params, fun)}
// 查询当前登录人所属直营中心团队
export const queryDirectSaleRankByEmpID = (params,fun) => {request("index.queryDirectSaleRankByEmpID", params, fun)}
// 查询业绩排名-团战分享
export const queryGroupSaleRankShareList = (params,fun) => {request("index.queryGroupSaleRankShareList", params, fun)}
// 首页业绩排名-搜索
export const querySaleRankSearchList = (params,fun) => {request("index.querySaleRankSearchList", params, fun)}
// 客户增长趋势图
export const queryCustomertrends = (params,fun) => {request("index.queryCustomertrends", params, fun)}
// AUM增长趋势图
export const queryAUMGrowthTrend = (params,fun) => {request("index.queryAUMGrowthTrend", params, fun)}
// 贷款增长趋势
export const queryLoanGrowthTrend = (params,fun) => {request("index.queryLoanGrowthTrend", params, fun)}