<template>
	<div>
		<nav-bar title="统计报表" leftIcon />
		<van-dropdown-menu class="topMenu" :close-on-click-outside="false" active-color="#1989fa">
			<van-dropdown-item ref="dateDrop" :title="dataDate" @open="showDate=true" @close="showDate=false" />
			<van-dropdown-item ref="orgDrop" :title="chooseOrg.text" @open="$refs.orgList.showPopup()"
				@close="$refs.orgList.cancle()" />
			<van-dropdown-item ref="custDrop" :title="chooseCust.custManagerName" @open="$refs.custList.showPopup()"
				@close="$refs.custList.cancle()" />
		</van-dropdown-menu>
		<div style="width: 100%;height: 0.5rem;"></div>
		<van-popup v-model:show="showDate" :overlay="false" position="bottom">
			<van-datetime-picker v-model="currentDate" type="date" title="选择日期" :min-date="minDate" :max-date="maxDate"
				@cancel="$refs.dateDrop.toggle(false)" @confirm="activeDate" />
		</van-popup>
		<org-list ref="orgList" type="2" :overlay="false" @close="closeOrg" @activeOrg="activeOrg" />
		<cust-list ref="custList" :overlay="false" :orgId="chooseOrg.value" @close="closeCust"
			@activeCust="activeCust" />
		<div class="modelBox"
			v-for="(list,i) in chooseCust.custManagerID?[qzCustList,clCustList]:[qzCustList,clCustList,loginDataList]"
			:key="'list'+i">
			<div class="modelTitle">{{list.title}}</div>
			<div class="modelDataBox">
				<div class="modelData" v-for="(item,j) in list.list" :key="'item'+j" @click="checkCard(item)">
					<div class="dataIcon" :style="{'background-image': 'url('+item.icon+')'}"></div>
					<div class="dataBox">
						<div class="dataName">{{item.name}}</div>
						<div class="dataValue" :class="list.title=='登录数据统计'?'canClick':''">{{item.value||"-"}}</div>
					</div>
				</div>
			</div>
		</div>
		<van-dialog v-model:show="showDetail" title="详情">
			<div class="detailItem" style="position: absolute;top: 0.5rem;left: 0;background-color: #77BBFF;">
				<div class="detailValue1" style="color: #FFFFFF;">机构</div>
				<div class="detailValue2" style="color: #FFFFFF;">工号</div>
				<div class="detailValue3" style="color: #FFFFFF;">姓名</div>
			</div>
			<div style="height: 0.4rem;"></div>
			<van-list :style="{'max-height': '3rem','overflow': 'auto'}" v-model:loading="detailLoading"
				:finished="detailFinished" :finished-text="detailList.length?'已加载全部':'暂无详情数据'" @load="getDetailData">
				<div class="detailItem" v-for="(detailItem,i) of detailList" :key="'detailItem'+i">
					<div class="detailValue1">{{detailItem.orgName}}</div>
					<div class="detailValue2">{{detailItem.userId}}</div>
					<div class="detailValue3">{{detailItem.userName}}</div>
				</div>
			</van-list>
		</van-dialog>
	</div>
</template>

<script>
	import {
		querySysDate
	} from "../../request/index.js";
	import {
		queryCustMgrSticReport,
		queryCustMgrSticLoginDtl
	} from "../../request/report.js"
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				dataDate: "",
				showDate: false,
				currentDate: "",
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(2025, 10, 1),
				chooseOrg: {
					text: "选择机构",
					value: ""
				},
				chooseCust: {
					custManagerName: "客户经理",
					custManagerID: ""
				},
				qzCustList: {
					title: "潜在客户维护",
					list: [{
							name: "新增客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_xzkhs.png')
						},
						{
							name: "领取客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_lqkhs.png')
						},
						{
							name: "待跟进客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_dgjkhs.png')
						},
						{
							name: "拜访客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_bfkhs.png')
						},
						{
							name: "潜在客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_qzkhs.png')
						},
						{
							name: "意向客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_yxkhs.png')
						},
						{
							name: "促成客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_cckhs.png')
						},
						{
							name: "审批客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_spkhs.png')
						},
						{
							name: "成交客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_cjkhs.png')
						}
					]
				},
				clCustList: {
					title: "存量客户维护",
					list: [{
							name: "贷款到期客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_dkdqkhs.png')
						},
						{
							name: "贷款拜访客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_dkbfkhs.png')
						},
						{
							name: "理财到期客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_lcdqkhs.png')
						},
						{
							name: "理财拜访客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_lcbfkhs.png')
						},
						{
							name: "定期到期客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_dqdqkhs.png')
						},
						{
							name: "定期拜访客户数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_dqbfkhs.png')
						}
					]
				},
				loginDataList: {
					title: "登录数据统计",
					list: [{
							name: "登录人数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_loginNum.png')
						},
						{
							name: "未登录人数",
							value: "",
							icon: require('../../assets/image/cust_tjbb_nologNum.png')
						}
					]
				},
				showDetail: false,
				detailLoading: true,
				detailFinished: false,
				detailList: [],
				detailPageIndex: 0,
				isLogin: "",
			}
		},
		methods: {
			getData() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.qzCustList.list.forEach(item => item.value = "");
				this.clCustList.list.forEach(item => item.value = "");
				this.loginDataList.list.forEach(item => item.value = "");
				var params = {
					dataDate: this.dataDate.split(".").join("")
				}
				if (this.chooseCust.custManagerID) {
					params.custManager = this.chooseCust.custManagerID;
				} else if (this.chooseOrg.value) {
					params.orgID = this.chooseOrg.value;
				}
				queryCustMgrSticReport(params, (res) => {
					if (res.data) {
						Toast.clear();
						for (let item of this.qzCustList.list) {
							switch (item.name) {
								case "新增客户数":
									item.value = res.data.addCustCnt.toLocaleString();
									break;
								case "领取客户数":
									item.value = res.data.drawCustCnt.toLocaleString();
									break;
								case "待跟进客户数":
									item.value = res.data.prprFollowUpCustCnt.toLocaleString();
									break;
								case "拜访客户数":
									item.value = res.data.visitCustCnt.toLocaleString();
									break;
								case "潜在客户数":
									item.value = res.data.ptntlCustCnt.toLocaleString();
									break;
								case "意向客户数":
									item.value = res.data.ofstCustCnt.toLocaleString();
									break;
								case "促成客户数":
									item.value = res.data.procureCustCnt.toLocaleString();
									break;
								case "审批客户数":
									item.value = res.data.exapCustCnt.toLocaleString();
									break;
								case "成交客户数":
									item.value = res.data.tranxCustCnt.toLocaleString();
									break;
							}
						}
						for (let item of this.clCustList.list) {
							switch (item.name) {
								case "贷款到期客户数":
									item.value = res.data.loanExpCustCnt.toLocaleString();
									break;
								case "贷款拜访客户数":
									item.value = res.data.loanVisitCustCnt.toLocaleString();
									break;
								case "理财到期客户数":
									item.value = res.data.cftExpCustCnt.toLocaleString();
									break;
								case "理财拜访客户数":
									item.value = res.data.cftVisitCustCnt.toLocaleString();
									break;
								case "定期到期客户数":
									item.value = res.data.fxExpCustCnt.toLocaleString();
									break;
								case "定期拜访客户数":
									item.value = res.data.fxVisitCustCnt.toLocaleString();
									break;
							}
						}
						for (let item of this.loginDataList.list) {
							switch (item.name) {
								case "登录人数":
									item.value = res.data.loginCnt.toLocaleString();
									break;
								case "未登录人数":
									item.value = res.data.noLoginCnt.toLocaleString();
									break;
							}
						}
					} else {
						Toast.fail("统计报表数据为空")
					}
				})
			},
			closeOrg() {
				this.$refs.orgDrop.toggle(false)
			},
			closeCust() {
				this.$refs.custDrop.toggle(false)
			},
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.chooseOrg = orgValue
				} else {
					this.chooseOrg = {
						text: "选择机构",
						value: ""
					}
				};
				this.chooseCust = {
					custManagerName: "客户经理",
					custManagerID: ""
				};
				this.$refs.custList.clear();
				this.$refs.orgDrop.toggle(false);
				this.getData();
			},
			activeCust(custMsg) {
				if (custMsg.custManagerID) {
					this.chooseCust = custMsg
				} else {
					this.chooseCust = {
						custManagerName: "客户经理",
						custManagerID: ""
					};
				};
				this.getData();
			},
			activeDate(val) {
				var dateArr = val.toLocaleString().split(" ")[0].split("/");
				dateArr[1].length < 2 ? dateArr[1] = '0' + dateArr[1].toString() : '';
				dateArr[2].length < 2 ? dateArr[2] = '0' + dateArr[2].toString() : '';
				this.dataDate = dateArr.join(".");
				this.$refs.dateDrop.toggle(false);
				this.getData();
			},
			checkCard(item) {
				if (item.name != "登录人数" && item.name != "未登录人数") return;
				this.isLogin = item.name == "登录人数" ? "1" : "0";
				this.detailPageIndex = 0;
				this.detailLoading = true;
				this.detailFinished = false;
				this.detailList = [];
				this.showDetail = true;
				this.getDetailData();
			},
			getDetailData() {
				this.detailPageIndex++;
				queryCustMgrSticLoginDtl({
					etlDt: this.dataDate ? this.dataDate.split(".").join("") : "",
					orgID: this.chooseOrg.value ? this.chooseOrg.value : "",
					isLogin: this.isLogin,
					pageSize: "10",
					pageNum: this.detailPageIndex
				}, (res) => {
					if (res.data && res.data.records) {
						this.detailList = this.detailList.concat(res.data.records);
						if (this.detailList.length >= res.data.total) this.detailFinished = true;
						this.detailLoading = false;
					} else {
						Toast.fail("详情数据为空")
					}
				});
			},
		},
		mounted() {
			querySysDate({}, (res) => {
				if (res.data) {
					this.dataDate = res.data.slice(0, 4) + "." + res.data.slice(4, 6) + "." + res.data.slice(6,
						8);
					var nowDateArr = this.dataDate.split(".");
					var date = new Date(this.dataDate.split(".").join("/"));
					date.setMonth(date.getMonth() - 3);
					date.toLocaleDateString();
					this.minDate = date;
					this.maxDate = this.currentDate = new Date(Number(nowDateArr[0]), Number(nowDateArr[1]) -
						1, Number(
							nowDateArr[2]));
					this.getData();
				} else {
					Toast.fail("系统跑批日期数据为空")
				}
			})
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.topMenu {
		width: 100%;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 0.5rem);
		top: calc(env(safe-area-inset-top) + 0.5rem);
		left: 0;
		z-index: 3;
	}

	.modelBox {
		width: 93%;
		margin: 0.2rem auto;
		border-radius: 0.1rem;
	}

	.modelTitle {
		width: 100%;
		line-height: 0.4rem;
		font-size: 0.18rem;
		font-weight: 600;
		text-align: left;
		padding: 0 0.05rem;
	}

	.modelDataBox {
		width: 100%;
		margin: 0 auto;
		background-color: #FFFFFF;
		border-radius: 0.1rem;
		padding: 0.05rem 0;
		box-shadow: 0 0 0.05rem 0 #CCCCCC;
		display: flex;
		flex-wrap: wrap;
	}

	.modelData {
		width: 50%;
		height: 0.8rem;
		padding: 0 0.1rem;
		/* border: solid 1px #000000; */
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.dataIcon {
		width: 0.4rem;
		height: 0.4rem;
		background-image: url(../../assets/image/cust_tjbb_cckhs.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 60%;
	}

	.dataBox {
		width: calc(100% - 0.4rem);
	}

	.dataName,
	.dataValue {
		text-align: left;
		color: #666666;
	}

	.dataName {
		font-size: 0.15rem;
		font-weight: 600;
	}

	.dataValue {
		font-size: 0.15rem;
	}

	.detailItem {
		width: 100%;
		height: 0.4rem;
		border-bottom: solid 1px #EFEFEF;
		display: flex;
		flex-wrap: nowrap;
	}

	.detailItem>div {
		line-height: 0.4rem;
		text-align: center;
		font-size: 0.15rem;
		color: #888888;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.detailValue1 {
		width: 45%
	}

	.detailValue2 {
		width: 25%
	}

	.detailValue3 {
		width: 30%
	}

	.canClick {
		text-decoration: underline;
		color: #0088FF;
	}
</style>
