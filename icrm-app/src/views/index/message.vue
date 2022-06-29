<template>
	<div class="home">
		<nav-bar title="提醒消息" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="whiteBG">
				<div class="plate1" v-if="$store.state.userMsg.roleId!='00000004'">
					<div class="plate1_1" @click="$refs.orgList.showPopup();openOrgList=true;">
						<div class="plate1_1_value ycsl">{{chooseOrg.text}}</div>
						<van-icon v-if="openOrgList" name="arrow-up" size="14" color="#8C8C8C" />
						<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
					</div>
					<div class="plate1_1" @click="$refs.custList.showPopup();openCustList=true;">
						<div class="plate1_1_value ycsl">{{chooseCust.empName}}</div>
						<van-icon v-if="openCustList" name="arrow-up" size="14" color="#8C8C8C" />
						<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
					</div>
				</div>
				<div class="plate2">
					<van-tabs v-model:active="tab1Index" color="#026DFF" line-height="0.02rem" line-width="0.56rem"
						title-active-color="#026DFF" title-inactive-color="#262626" @change="changeTab1">
						<van-tab v-for="(tab1Item,i) in codeList1" :key="'tab1'+i" :title="tab1Item.text"></van-tab>
					</van-tabs>
				</div>
				<div class="plate3">
					<div class="plate3_child" v-for="(tab2Item,i) in codeList2" :key="'tab2'+i"
						:class="tab2Index==i?'plate3_child_a':''" @click="changeTab2(i)"
						v-show="i==0||codeList1[tab1Index].value==''||tab2Item.pValue==codeList1[tab1Index].value">
						{{tab2Item.text}}
					</div>
				</div>
				<div class="plate4">
					<div class="plate4_title">服务等级</div>
					<div class="plate4_childBox">
						<div class="plate4_child" v-for="(tab3Item,i) in codeList3" :key="'tab3'+i"
							:class="tab3Item.choose?'plate4_child_a':''" @click="changeTab3(i)">
							{{tab3Item.text}}
						</div>
					</div>
				</div>
				<div class="plate4">
					<div class="plate4_title">重要星级</div>
					<div class="plate4_childBox">
						<div class="plate4_child" v-for="(tab4Item,i) in codeList4" :key="'tab4'+i"
							:class="tab4Index==i?'plate4_child_a':''" @click="changeTab4(i)">
							{{tab4Item.text}}
						</div>
					</div>
				</div>
				<div class="plate4" v-show="openTop">
					<div class="plate4_title">阅读状态</div>
					<div class="plate4_childBox">
						<div class="plate4_child" v-for="(tab5Item,i) in codeList5" :key="'tab5'+i"
							:class="tab5Index==i?'plate4_child_a':''" @click="changeTab5(i)">
							{{tab5Item.text}}
						</div>
					</div>
				</div>
				<div class="plate4" v-show="openTop">
					<div class="plate4_title">推送日期</div>
					<div class="plate4_childBox">
						<div class="plate4_child" :class="beginDate?'plate4_child_a':''" style="min-width: 1.05rem;"
							@click="dateShow1 = true">
							<span style="margin-right: 0.06rem;">{{beginDate||"开始时间"}}</span>
							<van-icon :name="require('../../assets/image/common_date.png')"
								style="margin-bottom: 0.03rem;" />
						</div>
						<div style="font-size: 0.12rem;margin-right: 0.1rem;color: #8C8C8C">—</div>
						<div class="plate4_child" :class="endDate?'plate4_child_a':''" style="min-width: 1.05rem;"
							@click="dateShow2 = true">
							<span style="margin-right: 0.06rem;">{{endDate||"结束时间"}}</span>
							<van-icon :name="require('../../assets/image/common_date.png')"
								style="margin-bottom: 0.03rem;" />
						</div>
					</div>
				</div>
				<div class="plate5" @click="openTop=!openTop;resetTop();">
					<van-icon v-if="openTop" name="arrow-up" size="20" color="#999999" />
					<van-icon v-else name="arrow-down" size="20" color="#999999" />
				</div>
			</div>
			<div class="totalPlace">
				<span class="totalPlace1">筛选结果：共{{total}}条数据</span>
				<span class="totalPlace2" v-if="openPLFS" @click="cancleCheck">取消批量发送</span>
				<span class="totalPlace2" v-else @click="checked=[];checkAll=false;openPLFS=true;">批量发送</span>
			</div>
		</div>
		<div :style="{height: fixedHeight}"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
			:immediate-check="false">
			<van-checkbox-group v-model="checked" ref="checkboxGroup">
				<div v-for="(msgItem,i) in msgList" :key="'msgItem'+i" class="msgCardBox"
					:style="{'margin-left':openPLFS?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="msgItem.sysId" @click="checkAll=false"></van-checkbox>
					</div>
					<div class="msgCard">
						<div class="msgCard1">
							<div class="msgCard1_1 ycsl">{{msgItem.evName}}</div>
							<div class="msgCard1_2">{{moment(msgItem.rmdDt).format('YYYY-MM-DD')}}</div>
							<div class="msgCard1_3">
								<div class="msgCard1_3_item" v-for="i of Number(msgItem.impScore)"></div>
							</div>
							<div class="msgCard1_4" :style="{color: msgItem.stat=='0'?'#E93030':'#026DFF'}">
								{{msgItem.stat=="0"?"未读":"已读"}}
							</div>
						</div>
						<div class="msgCard2">
							<div class="msgCard2_1">
								<div class="msgCard2_1_1">
									<div class="msgCard2_1_1_1">{{msgItem.rmdCntnt}}</div>
									<div class="msgCard2_1_1_2" @click="checkItem=msgItem;showCall=true">
										<van-icon :name="require('../../assets/image/callPhone.png')" size="24" />
									</div>
									<div class="msgCard2_1_1_2" @click="openMbox([msgItem],false)">
										<van-icon :name="require('../../assets/image/sendMessage.png')" size="24" />
									</div>
								</div>
								<div class="msgCard2_1_2">
									<div class="msgCount2_1_2_item ycsl">
										<span style="color: #8C8C8C;">机构名称：</span>
										<span>{{msgItem.orgName}}</span>
									</div>
									<div class="msgCount2_1_2_item">
										<span style="color: #8C8C8C;">客户经理：</span>
										<span>{{msgItem.custMgrNm}}</span>
									</div>
								</div>
							</div>
							<div class="msgCard2_2" @click="toCustView(msgItem)">
								<van-icon name="arrow" color="#D8D8D8" size="16" />
							</div>
						</div>
						<div class="msgCard3" v-if="$store.state.userMsg.roleId=='00000004'&&msgItem.stat=='0'"
							@click="changeStat(msgItem)">标记已读
						</div>
					</div>
				</div>
			</van-checkbox-group>
		</van-list>
		<van-popup v-model:show="openPLFS" position="bottom" :overlay="false" :lock-scroll="false"
			safe-area-inset-bottom>
			<div class="bottomBox">
				<div></div>
				<!-- <van-checkbox v-model="checkAll" ref="checkAll" @click="chooseAll">全选</van-checkbox> -->
				<div class="btnBox">
					<div class="bottomBtn" @click="confirmCheck">批量发送</div>
					<div class="bottomBtn" @click="openMbox([],true)">全部发送</div>
				</div>
			</div>
		</van-popup>
		<div class="bottomZW"></div>
		<org-list ref="orgList" :type="2" @close="openOrgList=false" @activeOrg="activeOrg" />
		<customer-list ref="custList" :orgId="chooseOrg.value" @close="openCustList=false" @activeCust="activeCust" />
		<van-calendar v-model:show="dateShow1" :show-confirm="false" :show-cancle="false" color="#026DFF"
			:min-date="minDate" :max-date="maxDate" @confirm="chooseDate1">
			<template #title>
				<div class="calendarTitle">
					<div class="calendarTitle1" @click="dateShow1=false">取消</div>
					<div class="calendarTitle2" @click="resetDate1">重置</div>
				</div>
			</template>
		</van-calendar>
		<van-calendar v-model:show="dateShow2" :show-confirm="false" color="#026DFF" :max-date="maxDate"
			:min-date="minDate" @confirm="chooseDate2" title="结束时间">
			<template #title>
				<div class="calendarTitle">
					<div class="calendarTitle1" @click="dateShow2=false">取消</div>
					<div class="calendarTitle2" @click="resetDate2">重置</div>
				</div>
			</template>
		</van-calendar>
		<van-overlay :show="showCall">
			<div class="plate6">
				<div class="plate6_1">提示</div>
				<div class="plate6_5">是否拨打电话：{{checkItem.phoneNo}}</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showCall=false">取消</div>
					<div class="palte6_4_2" @click="callCust">确定</div>
				</div>
			</div>
		</van-overlay>
		<send-message ref="sendMessage" @commitSuccess="afterSend" />
	</div>
</template>

<script>
	import moment from "moment";
	import {
		custServiceAdd
	} from "../../request/custinfo.js";
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryWarningRmdMgtList,
		updateWarningRmdMgtStatus
	} from "../../request/product.js";
	import {
		Toast
	} from "vant";
	import customerList from "../../components/common/customerList.vue";
	import sendMessage from "../../components/common/sendMessage.vue";
	export default {
		data() {
			return {
				openOrgList: false,
				chooseOrg: {
					text: "全部机构",
					value: ""
				},
				openCustList: false,
				chooseCust: {
					empName: "客户经理",
					empId: ""
				},
				fixedHeight: "2.5rem",
				loading: false,
				finished: false,
				pageIndex: 0,
				msgList: [],
				codeList1: [{
					text: "全部",
					value: ""
				}],
				tab1Index: 0,
				codeList2: [{
					text: "全部",
					value: ""
				}],
				tab2Index: 0,
				codeList3: [{
					text: "全部",
					value: "",
					choose: true
				}],
				codeList4: [{
					text: "全部",
					value: ""
				}, {
					text: "5星",
					value: 5
				}, {
					text: "4星",
					value: 4
				}, {
					text: "3星",
					value: 3
				}, {
					text: "2星",
					value: 2
				}, {
					text: "1星",
					value: 1
				}],
				tab4Index: 0,
				codeList5: [{
					text: "全部",
					value: ""
				}],
				tab5Index: 0,
				openTop: false,
				beginDate: "",
				endDate: "",
				dateShow1: false,
				dateShow2: false,
				minDate: new Date(moment().subtract(1, 'year').format('YYYY/MM/DD')),
				maxDate: new Date(),
				total: 0,
				openPLFS: false,
				checked: [],
				checkAll: false,
				showCall: false,
				checkItem: {},
			}
		},
		components: {
			customerList,
			sendMessage
		},
		methods: {
			moment,
			changeTab1() {
				this.tab2Index = 0;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeTab2(i) {
				if (this.tab2Index == i) return;
				this.tab2Index = i;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeTab3(i) {
				if (i == 0) {
					if (this.codeList3[0].choose) return;
					this.codeList3.forEach(item => item.choose = false);
					this.codeList3[0].choose = true;
				} else {
					this.codeList3[0].choose = false;
					this.codeList3[i].choose = !this.codeList3[i].choose;
					let clearAll = true;
					this.codeList3.forEach((item) => {
						if (item.choose) clearAll = false;
					});
					if (clearAll) this.codeList3[0].choose = true;
				};
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeTab4(i) {
				if (this.tab4Index == i) return;
				this.tab4Index = i;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeTab5(i) {
				if (this.tab5Index == i) return;
				this.tab5Index = i;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			chooseDate1(date) {
				var chooseDate = moment(date).format('YYYY-MM-DD');
				if (this.endDate && this.endDate != chooseDate && moment(this.endDate).isBefore(chooseDate)) {
					Toast("开始时间不能晚于结束时间");
					return;
				}
				this.beginDate = moment(date).format('YYYY-MM-DD');
				this.dateShow1 = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			chooseDate2(date) {
				var chooseDate = moment(date).format('YYYY-MM-DD');
				if (this.beginDate && this.beginDate != chooseDate && moment(chooseDate).isBefore(this.beginDate)) {
					Toast("结束时间不能早于开始时间");
					return;
				}
				this.endDate = moment(date).format('YYYY-MM-DD');
				this.dateShow2 = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			resetDate1() {
				this.beginDate = "";
				this.dateShow1 = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			resetDate2() {
				this.endDate = "";
				this.dateShow2 = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			chooseAll() {
				this.$refs.checkboxGroup.toggleAll(this.checkAll);
			},
			cancleCheck() {
				this.openPLFS = false;
				this.$refs.checkboxGroup.toggleAll(false);
			},
			afterSend() {
				this.openPLFS = false;
				this.$refs.checkboxGroup.toggleAll(false);
			},
			confirmCheck() {
				if (!this.checked.length) {
					Toast.fail("请先选择至少1条数据");
					return;
				};
				var list = [];
				this.checked.forEach((item) => {
					list.push(this.msgList.find(msgItem => msgItem.sysId == item))
				});
				this.openMbox(list, false);
			},
			async callCust() {
				this.showCall = false;
				// if (isNaN(this.checkItem.phoneNo)) {
				// 	Toast.fail("电话号码格式有误");
				// 	return;
				// };
				// if (!this.checkItem.phoneNo) {
				// 	Toast.fail("电话号码为空");
				// 	return;
				// }
				Toast.loading({
					message: "正在唤起",
					forbidClick: true,
					duration: 0
				});
				var step = 0;
				custServiceAdd({
					custName: this.checkItem.cstName,
					custNo: this.checkItem.custNum,
					mobileNum: this.checkItem.phoneNo,
					communictionChannel: "02",
					custType: '1',
					serviceChn: "6"
				}, (res2) => {
					step++;
				});
				updateWarningRmdMgtStatus({
					sysId: this.checkItem.sysId
				}, (res) => {
					this.checkItem.stat = "1";
					step++;
				});
				var timer = setInterval(()=>{
					if(step>=2){
						clearInterval(timer);
						timer = "";
						Toast.clear();
						AlipayJSBridge.call('callHandler', {
							phone: this.checkItem.phoneNo
						}, (res1) => {
							
						});
					}
				},100)
			},
			openMbox(list, type) {
				var params = {
					shrtmsgCnl: "6",
					list
				};
				if (type) {
					params.type = "messageListSendAll";
					params.searchData = {
						belongOrg: this.chooseOrg.value,
						belgCustMgr: this.chooseCust.empId,
						evTypeId: this.codeList1[this.tab1Index].value,
						evId: this.codeList2[this.tab2Index].value,
						svcLvlList: this.codeList3[0].choose ? [] : this.codeList3.filter(item => item.choose).map(
							item => item.value),
						impScore: this.codeList4[this.tab4Index].value,
						stat: this.codeList5[this.tab5Index].value,
						rmdDtStart: this.beginDate.split("-").join(""),
						rmdDtEnd: this.endDate.split("-").join("")
					};
				} else {
					params.type = "";
					params.searchData = {};
				};
				console.log(list)
				this.$refs.sendMessage.openMbox(params);
			},
			changeStat(item) {
				Toast.loading({
					message: "正在执行",
					forbidClick: true,
					duration: 0
				});
				updateWarningRmdMgtStatus({
					sysId: item.sysId
				}, (res) => {
					item.stat = "1";
					Toast.success("操作成功");
				})
			},
			resetTop() {
				this.$nextTick(() => {
					var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName(
						"fixedPlace")[0], null);
					this.fixedHeight = fixedPlace.height;
				})
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
					empName: "客户经理",
					empId: ""
				};
				this.openOrgList = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			activeCust(custValue) {
				if (custValue.empId) {
					this.chooseCust = custValue
				} else {
					this.chooseCust = {
						empName: "客户经理",
						empId: ""
					}
				};
				this.openCustList = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			onLoad() {
				this.loading = true;
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				queryWarningRmdMgtList({
					pageSize: "10",
					pageNum: this.pageIndex,
					belongOrg: this.chooseOrg.value,
					belgCustMgr: this.chooseCust.empId,
					evTypeId: this.codeList1[this.tab1Index].value,
					evId: this.codeList2[this.tab2Index].value,
					svcLvlList: this.codeList3[0].choose ? [] : this.codeList3.filter(item => item.choose).map(
						item => item.value),
					impScore: this.codeList4[this.tab4Index].value,
					stat: this.codeList5[this.tab5Index].value,
					rmdDtStart: this.beginDate.split("-").join(""),
					rmdDtEnd: this.endDate.split("-").join("")
				}, (res) => {
					if (res.data && res.data.records) {
						res.data.records.forEach(item => item.checked = false);
						this.msgList = this.msgList.concat(res.data.records);
						this.total = res.data.total;
						if (this.msgList.length >= res.data.total) this.finished = true;
					} else {
						this.finished = true;
					}
					Toast.clear();
					this.loading = false;
				})
			},
			toCustView(item) {
				if (item.custNum[0] == "P") {
					this.$router.push({
						name: 'clCustomerView',
						query: {
							custNum: item.custNum
						}
					})
				} else {
					Toast("非存量客户，无法查看客户视图！")
				}
			},
		},
		mounted() {
			this.resetTop();
			this.onLoad();
			getSysCodeByType({
				codeType: "evtype"
			}, (res) => {
				if (res.data) {
					var arr = res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue
						}
					})
					this.codeList1 = this.codeList1.concat(arr);
				} else {
					Toast.fail("事件类型数据为空")
				}
			});
			getSysCodeByType({
				codeType: "evname"
			}, (res) => {
				if (res.data) {
					var arr = res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue,
							pValue: item.codeValue.slice(0, 3) + "00000"
						}
					})
					this.codeList2 = this.codeList2.concat(arr);
				} else {
					Toast.fail("事件名称数据为空")
				}
			});
			getSysCodeByType({
				codeType: "SVC_LVL_SHOW"
			}, (res) => {
				if (res.data) {
					var arr = res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue,
							choose: false
						}
					})
					this.codeList3 = this.codeList3.concat(arr);
				} else {
					Toast.fail("服务等级数据为空")
				}
			});
			getSysCodeByType({
				codeType: "IS_READ_PC"
			}, (res) => {
				if (res.data) {
					var arr = res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue,
						}
					})
					this.codeList5 = this.codeList5.concat(arr);
				} else {
					Toast.fail("服务等级数据为空")
				}
			});
		},
		activated() {
			if (this.$route.params.newPage && !this.loading) {
				this.openOrgList = false;
				this.chooseOrg = {
					text: "全部机构",
					value: ""
				};
				this.openCustList = false;
				this.chooseCust = {
					empName: "客户经理",
					empId: ""
				};
				this.fixedHeight = "2.5rem";
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.msgList = [];
				this.tab1Index = 0;
				this.tab2Index = 0;
				this.tab4Index = 0;
				this.tab5Index = 0;
				this.openTop = false;
				this.beginDate = "";
				this.endDate = "";
				this.dateShow1 = false;
				this.dateShow2 = false;
				this.minDate = new Date(moment().subtract(1, 'year').format('YYYY/MM/DD'));
				this.maxDate = new Date();
				this.total = 0;
				this.openPLFS = false;
				this.checked = [];
				this.checkAll = false;
				this.showCall = false;
				this.checkItem = {};
				this.resetTop();
				this.onLoad();
			}
		},
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.plate3::-webkit-scrollbar,
	.plate4_childBox::-webkit-scrollbar {
		display: none;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		z-index: 1;
		color: white;
	}

	.whiteBG {
		width: 100%;
		background-color: #FFFFFF;
	}

	.plate1 {
		width: 93.6%;
		margin: 0 auto;
		height: 0.54rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		border-bottom: solid 1px #EFEFEF;
	}

	.plate1_1 {
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		max-width: 40%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-right: 0.24rem;
	}

	.plate1_1_value {
		margin-right: 0.04rem;
	}

	.plate2 {
		width: 93.6%;
		margin: 0 auto;
		padding-top: 0.04rem;
		height: 0.5rem;
		border-bottom: solid 1px #EFEFEF;
		position: relative;
		display: flex;
		align-items: flex-end;
	}

	.plate2 :deep(.van-tabs) {
		margin-bottom: -0.015rem;
	}

	.plate2 :deep(.van-tabs__wrap) {
		height: 0.53rem;
	}

	.plate2 :deep(.van-tabs__nav) {
		background-color: rgba(0, 0, 0, 0);
	}

	.plate3 {
		width: 93.6%;
		margin: 0 auto;
		height: 0.52rem;
		border-bottom: solid 1px #EFEFEF;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		overflow-x: auto;
	}

	.plate3_child,
	.plate4_child {
		flex-shrink: 0;
		height: 0.28rem;
		min-width: 0.76rem;
		background: #F5F5F5;
		border-radius: 0.14rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.28rem;
		padding: 0 0.1rem;
		margin-right: 0.1rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.plate3_child_a,
	.plate4_child_a {
		background: #E0EDFF;
		color: #026DFF;
	}

	.plate4 {
		width: 93.6%;
		margin: 0.1rem auto 0;
		height: 0.28rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.plate4_title {
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		flex-shrink: 0;
		margin-right: 0.1rem;
	}

	.plate4_childBox {
		width: 100%;
		flex-shrink: 1;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		overflow-x: auto;
	}

	.plate5 {
		width: 93.6%;
		margin: 0 auto;
		height: 0.24rem;
		border-top: solid 0.01rem #EFEFEF;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.1rem;
	}

	:deep(.van-calendar__popup .van-popup__close-icon) {
		display: none;
	}

	:deep(.van-calendar__popup) {
		height: 60%;
	}

	.calendarTitle {
		width: 100%;
		padding: 0 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.calendarTitle1 {
		font-size: 0.15rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
	}

	.calendarTitle2 {
		font-size: 0.15rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #1D70F5;
	}

	.totalPlace {
		width: 100%;
		padding: 0.08rem 3.2% 0;
		height: 0.42rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		background-color: #F5F5F5;
	}

	.totalPlace1 {
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
	}

	.totalPlace2 {
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
	}

	.msgCardBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
	}

	.leftCheckBox {
		width: 12%;
		height: 0.2rem;
		flex-shrink: 0;
		position: absolute;
		left: -15%;
		display: flex;
		justify-content: flex-end;
	}

	.msgCard {
		width: 93.6%;
		margin: 0 3.2% 0.1rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		width: 100%;
		padding: 0.12rem 0.15rem;
	}

	:deep(.van-list) {
		overflow: hidden;
	}

	.msgCard1 {
		height: 0.24rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-bottom: 0.08rem;
	}

	.msgCard1_1 {
		width: 100%;
		font-size: 0.16rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		text-align: left;
		flex-shrink: 1;
	}

	.msgCard1_2 {
		margin: 0 0.08rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		text-align: center;
		flex-shrink: 0;
	}

	.msgCard1_3 {
		width: 0.58rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		flex-shrink: 0;
	}

	.msgCard1_3_item {
		width: 0.1rem;
		height: 0.1rem;
		margin-right: 0.02rem;
		background-image: url(../../assets/image/common_star.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}

	.msgCard1_3_item:last-child {
		margin-right: 0;
	}

	.msgCard1_4 {
		margin-left: 0.05rem;
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #E93030;
		flex-shrink: 0;
	}

	.msgCard2 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.msgCard2_1 {
		width: 94%;
	}

	.msgCard2_1_1 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-bottom: 0.1rem;
	}

	.msgCard2_1_1_1 {
		margin-right: 0.1rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.17rem;
		text-align: left;
		flex-shrink: 1;
	}

	.msgCard2_1_1_2 {
		width: 0.42rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.msgCard2_1_2 {
		height: 0.18rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.msgCount2_1_2_item {
		width: 50%;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		text-align: left;
		color: #262626;
	}

	.msgCard2_2 {
		width: 6%;
		height: 0.45rem;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.msgCard3 {
		width: 100%;
		border-top: solid 0.01rem #EFEFEF;
		padding-top: 0.06rem;
		margin: 0.06rem 0 -0.04rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
	}

	.plate6 {
		width: 74.7%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		position: absolute;
		top: calc(50% - 1rem);
		left: 12.65%;
		padding: 0.2rem 0.12rem;
	}

	.plate6_1 {
		width: 100%;
		height: 0.22rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 500;
		margin-bottom: 0.24rem;
	}

	.plate6_2 {
		width: 100%;
		height: 0.24rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.plate6_3 {
		width: 100%;
		height: 0.27rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.08rem;
	}

	.plate6_3_1 {
		margin-left: 0;
	}

	.plate6_3_2 {
		margin-left: 0.125rem;
	}

	.plate6_4 {
		width: 100%;
		height: 0.3rem;
		margin-top: 0.24rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
	}

	.palte6_4_1 {
		width: 1.08rem;
		height: 0.3rem;
		border: 0.01rem solid #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #026DFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.palte6_4_2 {
		width: 1.08rem;
		height: 0.3rem;
		background: #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #FFFFFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.plate6_5 {
		width: 100%;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 400;
		margin-bottom: 0.24rem;
	}

	.bottomBox {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		height: 0.64rem;
		font-size: 0.12rem;
		padding-left: 6.5%;
		padding-right: 3%;
		border-top: solid 1px #F5F5F5;
	}

	.bottomBox :deep(.van-checkbox__label) {
		color: #888888;
	}

	.btnBox {
		display: flex;
		flex-wrap: nowrap;
	}

	.bottomBtn {
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 0.4rem;
		margin-right: 0.1rem;
	}

	:deep(.van-field__left-icon) {
		display: flex;
		align-items: center;
		margin-right: 0.08rem;
	}
</style>
