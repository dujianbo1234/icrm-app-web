<template>
	<div class="home">
		<nav-bar :title="baseMsg.value0" @touchRight="onClickRight" type="2" leftIcon rightText="添加客户"
			rightColor="#026DFF" />
		<div class="fixedPlace">
			<div class="baseMsgPlace">
				<div class="baseMsg1">
					<div class="baseMsg1_1">{{baseMsg.value0}}</div>
					<div class="baseMsg1_2">{{baseMsg.value1?baseMsg.value1.toLocaleString():"-"}}人</div>
				</div>
				<div class="baseMsg2">选客策略</div>
				<div class="baseMsg3">
					<span v-for="(clItem, i) in baseMsg.value5" :key="'clItem'+i">{{clItem}}</span>
				</div>
				<div class="baseMsg2">客群描述</div>
				<div class="baseMsg3">{{baseMsg.value6}}</div>
				<div class="baseMsg4">
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">AUM总额：</span>
						<span class="baseMsg4_childValue">{{formatNum(baseMsg.value2/10000)}}万元</span>
					</div>
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">贷款总额：</span>
						<span class="baseMsg4_childValue">{{formatNum(baseMsg.value7/10000)}}万元</span>
					</div>
				</div>
				<div class="baseMsg5">
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">归属人：</span>
						<span class="baseMsg4_childValue">{{baseMsg.value3}}</span>
					</div>
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">机构：</span>
						<span class="baseMsg4_childValue">{{baseMsg.value4}}</span>
					</div>
				</div>
			</div>
		</div>
		<div :style="{height: fixedHeight}"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
			@load="onLoad">
			<div class="custItem" v-for="(custItem,i) in custList" :key="'custItem'+i">
				<div class="custItem1">
					<div class="custItem1_2">
						<div class="custItem1_2_1">{{custItem.custNm}}</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='0'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type0.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='1'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='2'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='3'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='4'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='5'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="custItem.svcLvl=='6'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}">
						</div>
						<div class="custItem1_2_3">
							<div class="custItem1_2_3_item" v-if="custItem.vipCstFlg=='1'"
								style="background-color: rgba(2,109,255,0.08);color: #026DFF;">财</div>
							<div class="custItem1_2_3_item" v-if="custItem.agentPayCstFlg=='1'"
								style="background-color: rgba(255,133,0,0.08);color: #FF8500;">代</div>
							<div class="custItem1_2_3_item" v-if="custItem.newCstFlg=='1'"
								style="background-color: rgba(255,58,58,0.08);color: #FF3A3A;">新</div>
							<div class="custItem1_2_3_item" v-if="custItem.merntCstFlg=='1'"
								style="background-color: rgba(68,107,161,0.08);color: #446BA1;">商</div>
							<div class="custItem1_2_3_item" v-if="custItem.ioinHoldLoan=='1'"
								style="background-color: rgba(55,205,55,0.08);color: #13AD13;">贷</div>
							<div class="custItem1_2_3_item" v-if="custItem.crdtCrdCstFlg=='1'"
								style="background-color: rgb(245,245,255);color: #B0B1FF;">信</div>
							<van-icon v-if="custItem.ioinSgnMobbank=='1'"
								:name="require('../../assets/image/business_chooseCust_jjyh_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_jjyh.png')"
								size="16" style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.ioinSgnAlpy=='1'"
								:name="require('../../assets/image/business_chooseCust_zfb_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_zfb.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.ioinSgnWchtPymt=='1'"
								:name="require('../../assets/image/business_chooseCust_wx_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_wx.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.ioinSgnYsf=='1'"
								:name="require('../../assets/image/business_chooseCust_ysf_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_ysf.png')" size="16"
								style="margin-right: 0.04rem;" />
						</div>
						<div class="custItem1_3" @click="delCust(custItem)">
							<van-icon :name="require('../../assets/image/group_delete.png')" size="18" />
						</div>
					</div>
				</div>
				<div class="custItem2">
					<div class="custItem2_child">
						<span class="custItem2_childName">极差值：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumDifVal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">历史最高资产：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumHistHestVal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">AUM资产：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">定期：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.timeDpsitBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">活期：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.currDpsitBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">贷款：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.loanBal/10000)}}万元</span>
					</div>
				</div>
			</div>
		</van-list>
		<div class="bottomZW"></div>
		<van-overlay :show="showDelete" z-index="11">
			<div class="plate6">
				<div class="plate6_5">确定将该客户从群组移除？</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showDelete=false">取消</div>
					<div class="palte6_4_2" @click="checkDelete">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		formatNum
	} from "../../api/common.js";
	export default {
		data() {
			return {
				baseMsg: {},
				fixedHeight: "",
				loading: false,
				finished: false,
				pageIndex: 0,
				custList: [],
				checkCust: {},
				showDelete: false,
			}
		},
		methods: {
			formatNum,
			onLoad() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.custList.push({
							sysId: "E2296E21EF0532A4E053E75D190A435D",
							merntCstFlg: "1",
							cmrcOpptSubclass: "400003",
							aumBal: 33333333,
							ioinHoldLoan: "1",
							cmrcOpptDsc: "信用卡激活超3个月，无我行借记卡，未绑定我行借记卡还款",
							cmrcOpptExpDay: "20220601",
							followUpPrsnNm: "*君*",
							svcLvlNm: "未达标",
							belongOrgNm: "青原支行",
							aumDifVal: 33333333,
							timeDpsitBal: 33333333,
							keyWords: "信用卡客户/未开借记卡",
							currDpsitBal: 33333333,
							newCstFlg: "1",
							cmrcOpptSubclassNm: "借记卡开卡-信用卡客户-短信营销",
							svcLvl: "6",
							cmrcOpptBclass: "40000",
							aumHistHestVal: 33333333,
							loanBal: 33333333,
							cmrcOpptStNm: "已跟进",
							ioinSgnAlpy: "1",
							belgCustMgr: "001343",
							belongOrg: "75708",
							cmrcOpptNm: "借记卡开卡-信用卡客户-短信营销+*绍*",
							cmrcOpptId: "IC20220501400003",
							followUpPrsn: "001343",
							ioinSgnWchtPymt: "1",
							ctcTel: "",
							custNo: "P900010001601261",
							recomRea: "客户为我行信用卡客户，未绑定借记卡还款，可营销转化为基础客户",
							belgCustMgrNm: "*君*",
							cmrcOpptSt: "4",
							ioinSgnYsf: "1",
							agentPayCstFlg: "1",
							basicCstCnt: "1",
							followUpDt: "20220624",
							custNm: "*绍*" + (i + 1),
							vipCstFlg: "1",
							openRecomRea: false,
							crdtCrdCstFlg: "1",
							ioinSgnMobbank: "1",
						});
					}
					Toast.clear();
					this.loading = false;
					if (this.custList.length >= 40) {
						this.finished = true;
					}
				}, 1000);
			},
			onClickRight() {
				this.$router.push({
					name: 'groupAddCust'
				})
			},
			delCust(item) {
				this.checkCust = item;
				this.showDelete = true;
			},
			checkDelete() {
				alert("移除客户：" + this.checkCust.custNm);
				this.showDelete = false;
				this.checkCust = {};
			}
		},
		mounted() {
			this.baseMsg = this.$route.params.groupItem ? JSON.parse(this.$route.params.groupItem) : JSON.parse(
				localStorage.getItem("groupDetail"));
			this.$nextTick(() => {
				var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName(
					"fixedPlace")[0], null);
				this.fixedHeight = fixedPlace.height;
			})
			this.onLoad();
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

	.fixedPlace {
		width: 100%;
		position: fixed;
		z-index: 9;
		background-color: #f5f5f5;
	}

	.baseMsgPlace {
		width: 93.6%;
		margin: 0.15rem auto;
		padding: 0.07rem 0.1rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}

	.baseMsg1 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-end;
		justify-content: space-between;
		padding-right: 0.1rem;
		margin: 0.05rem 0;
	}

	.baseMsg1_1 {
		height: 0.27rem;
		font-size: 0.18rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.27rem;
	}

	.baseMsg1_2 {
		height: 0.18rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.18rem;
	}

	.baseMsg2 {
		margin-top: 0.07rem;
		height: 0.18rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.18rem;
		text-align: left;
	}

	.baseMsg3 {
		max-width: calc(100% + 0.05rem);
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.18rem;
		text-align: left;
	}

	.baseMsg3>span {
		margin-right: 0.05rem;
	}

	.baseMsg4 {
		width: 100%;
		height: 0.42rem;
		margin-bottom: 0.05rem;
		border-bottom: solid 0.01rem #F5F5F5;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.baseMsg4_child {
		min-width: 50%;
		line-height: 0.18rem;
		text-align: left;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
	}

	.baseMsg4_child_wrap {
		white-space: wrap;
	}

	.baseMsg4_child_nowrap {
		white-space: nowrap;
	}

	.baseMsg4_childTitle {
		color: #8C8C8C;
	}

	.baseMsg4_childValue {
		color: #262626;
	}

	.baseMsg5 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-start;
	}

	.custItem {
		width: 93.6%;
		margin: 0 auto 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
	}

	.custItem1 {
		width: 100%;
		height: 0.44rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem1_1 {
		width: 0.4rem;
		height: 0.4rem;
		background: url(../../assets/image/mine_main_userIcon.png) no-repeat center;
		background-size: contain;
		border-radius: 0.2rem;
		overflow: hidden;
		margin-right: 0.12rem;
	}

	.custItem1_2 {
		display: flex;
		flex-wrap: wrap;
	}

	.custItem1_2_1 {
		height: 0.24rem;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
		margin: 0 0.08rem 0.04rem 0;
	}

	.custItem1_2_2 {
		width: 0.6rem;
		height: 0.16rem;
		margin: 0.04rem 0 0.08rem;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: contain;
	}

	.custItem1_2_3 {
		width: calc(100%);
		height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem1_2_3_item {
		width: 0.19rem;
		height: 0.16rem;
		border-radius: 0.02rem;
		text-align: center;
		line-height: 0.16rem;
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		font-weight: 400;
		margin-right: 0.04rem;
	}

	.custItem1_3 {
		position: absolute;
		top: 0.17rem;
		right: 0.3rem;
		width: 0.18rem;
		height: 0.18rem;
		border-radius: 0.09rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
	}

	.custItem2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.12rem;
		margin-bottom: 0.04rem;
	}

	.custItem2_child {
		width: 50%;
		flex-shrink: 0;
		height: 0.18rem;
		line-height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		text-align: left;
		letter-spacing: 0;
		font-weight: 400;
		margin-bottom: 0.04rem;
	}

	.custItem2_childName {
		color: #8C8C8C;
	}

	.custItem2_childValue {
		color: #262626;
	}

	.custItem3 {
		width: 100%;
		margin: 0 auto 0.12rem;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.custItem4 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem4_1 {
		width: 90%;
		font-family: PingFangSC-Regular;
		text-align: left;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.custItem4_2 {
		width: 10%;
		height: 0.16rem;
		display: flex;
		justify-content: flex-end;
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
		margin-bottom: 0.28rem;
		margin-top: 0.15rem;
	}
</style>
