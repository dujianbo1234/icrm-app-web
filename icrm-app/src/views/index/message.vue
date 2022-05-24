<template>
	<div class="home">
		<nav-bar title="提醒消息" type="2" leftIcon />
		<div class="fixedPlace">
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
						@click="showDate1(beginDate)">
						<span style="margin-right: 0.06rem;">{{beginDate||"开始时间"}}</span>
						<van-icon :name="require('../../assets/image/common_date.png')"
							style="margin-bottom: 0.03rem;" />
					</div>
					<div style="font-size: 0.12rem;margin-right: 0.1rem;color: #8C8C8C">—</div>
					<div class="plate4_child" :class="endDate?'plate4_child_a':''" style="min-width: 1.05rem;"
						@click="showDate2(endDate)">
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
		<div :style="{height: fixedHeight}"></div>
		<div
			style="width: 100%;line-height: 0.5rem;border: solid 0.01rem #026DFF;font-size: 0.16rem;background-color: pink;">
			占位框</div>
		<org-list ref="orgList" type="2" @close="openOrgList=false" @activeOrg="activeOrg" />
		<customer-list ref="custList" @close="openCustList=false" @activeCust="activeCust" />
		<van-calendar v-model:show="dateShow1" :show-confirm="false" color="#026DFF" :min-date="minDate"
			:max-date="endDate?(new Date(endDate.split('-').join('/'))):maxDate" @confirm="chooseDate1" />
		<van-calendar v-model:show="dateShow2" :show-confirm="false" color="#026DFF" :max-date="maxDate"
			:min-date="beginDate?(new Date(beginDate.split('-').join('/'))):minDate" @confirm="chooseDate2" />
	</div>
</template>

<script>
	import moment from "moment";
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		Toast
	} from "vant";
	import customerList from "../../components/common/customerList.vue";
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
			}
		},
		components: {
			customerList
		},
		methods: {
			moment,
			changeTab1() {
				this.tab2Index = 0;
			},
			changeTab2(i) {
				if (this.tab2Index == i) return;
				this.tab2Index = i;
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
				}
			},
			changeTab4(i) {
				if (this.tab4Index == i) return;
				this.tab4Index = i;
			},
			changeTab5(i) {
				if (this.tab5Index == i) return;
				this.tab5Index = i;
			},
			showDate1(date) {
				this.dateShow1 = true;
			},
			showDate2(date) {
				this.dateShow2 = true;
			},
			chooseDate1(date) {
				this.beginDate = moment(date).format('YYYY-MM-DD');
				this.dateShow1 = false;
			},
			chooseDate2(date) {
				this.endDate = moment(date).format('YYYY-MM-DD');
				this.dateShow2 = false;
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
				this.openOrgList = false;
				this.pageIndex = 0;
				this.loading = true;
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
				this.loading = true;
				this.msgList = [];
				this.onLoad();
			},
			onLoad() {

			},
		},
		mounted() {
			this.resetTop();
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

	.plate3::-webkit-scrollbar,
	.plate4_childBox::-webkit-scrollbar {
		display: none;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		background-color: #FFFFFF;
		z-index: 9;
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
		margin: 0.04rem auto 0;
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
</style>
