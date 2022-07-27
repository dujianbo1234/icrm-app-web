<template>
	<div class="home">
		<nav-bar title="筛选结果" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="plate1_1">选客策略</div>
				<div class="plate1_2">
					<div class="plate1_2_item" v-for="(filterItem,i) in filterArr" :key="'filterItem'+i">
						<div class="plate1_2_item_text ycsl">#{{filterItem.name.split("#")[0]}}#</div>
						<div class="plate1_2_item_text ycsl" v-if="filterItem.value">{{filterItem.value}}</div>
						<div class="plate1_2_item_text ycsl" v-else-if="filterItem.minValue&&filterItem.maxValue">
							({{filterItem.minValue}},{{filterItem.maxValue}}]</div>
						<div class="plate1_2_item_text ycsl" v-else-if="filterItem.minValue">≥{{filterItem.minValue}}</div>
						<div class="plate1_2_item_text ycsl" v-else-if="filterItem.maxValue">＜{{filterItem.maxValue}}</div>
						<div class="plate1_2_item_text ycsl" v-else-if="filterItem.values">{{filterItem.values}}</div>
					</div>
				</div>
			</div>
			<div class="plate2">
				<div class="plate2_item">筛选结果：共{{formatNums(total || 0)}}位客户</div>
				<div class="plate2_item"></div>
				<div class="plate2_item">AUM总额：{{aumBal=="正在获取..."?aumBal:formatNumW(aumBal || 0)+"万元"}}</div>
				<div class="plate2_item">贷款总额：{{loanBal=="正在获取..."?loanBal:formatNumW(loanBal || 0)+"万元"}}</div>
			</div>
		</div>
		<div style="height: 1.98rem;"></div>
		<van-list class="vanListStyle" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
			@load="onLoad" :immediate-check="false">
			<van-checkbox-group v-model="chooseItems" ref="checkboxGroup">
				<div class="custItem" v-for="(item,i) in custList" :key="'item'+i"
					:style="{'margin-left':showChecked?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="item.custNum"></van-checkbox>
					</div>
					<div class="custItem1">
						<div class="custItem1_2">
							<div class="custItem1_2_1">{{item.cstNm}}</div>
							<div class="custItem1_2_2"
								:style="`background-image:url(${require(`@/assets/image/business_chooseCust_type${item.svcLvl || 0}.png`)})`">
							</div>
							<div class="custItem1_2_3">
								<template
									v-for="(text, j) in ['vipCstFlg','agentPayCstFlg', 'newCstFlg', 'merntCstFlg', 'ioinHoldLoan', 'crdtCrdCstFlg']">
									<div :class="text" v-if="item[text] =='1'" :key="j">{{['财','代','新','商','贷','信'][j]}}
									</div>
								</template>
								<template
									v-for="(text, s) in ['ioinSgnMobbank','ioinSgnAlpy','ioinSgnWchtPymt', 'ioinSgnYsf']"
									:key="s">
									<van-icon
										:name="require(`@/assets/image/business_chooseCust_${['jjyh','zfb','wx','ysf'][s]}${['.png','_a.png'][item[text] || 0]}`)"
										size="16" style="margin-right: 0.04rem;" />
								</template>
							</div>
						</div>
					</div>
					<div class="custItem2">
						<template v-for="cust in custItemArr" :key="cust.key">
							<div class="custItem2_child">
								<span class="custItem2_childName">{{cust.value}}：</span>
								<span class="custItem2_childValue">{{formatNumW(item[cust.key] || 0)}}万元</span>
							</div>
						</template>
					</div>
				</div>
			</van-checkbox-group>
		</van-list>
		<div style="height: 0.6rem;"></div>
		<div class="bottomZW"></div>
		<div class="bottomBtns" v-if="showChecked">
			<div class="bottomBtn_c bottomBtn_c1" @click="showChecked=false">取消</div>
			<div class="bottomBtn_c bottomBtn_c2" @click="allIn">全部加入</div>
			<div class="bottomBtn_c bottomBtn_c2" @click="someIn">加入</div>
			<div style="width: 0.1rem;"></div>
			<div class="bottomZW" style="width: 100%;"></div>
		</div>
		<div class="bottomBtns" v-else>
			<div class="bottomBtn" @click="checkShare">
				<div class="bottomBtnIcon bottomBtnIcon1"></div>
				<div class="bottomBtnName">分享</div>
			</div>
			<div class="bottomBtn" @click="showChecked=false;createType='dt';showCreate=true;">
				<div class="bottomBtnIcon bottomBtnIcon2"></div>
				<div class="bottomBtnName">动态群组</div>
			</div>
			<div class="bottomBtn_popup">
				<van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="top"
					:show-arrow="false" :offset="[-15,11]">
					<template #reference>
						<div class="bottomBtnIcon bottomBtnIcon3"></div>
						<div class="bottomBtnName">固定群组</div>
					</template>
				</van-popover>
			</div>
			<div class="bottomZW" style="width: 100%;"></div>
		</div>
		<van-popup v-model:show="showCreate" :close-on-click-overlay="false">
			<div class="createBox">
				<div class="createTitle">{{createType=="dt"?"创建动态群组":"创建固定群组"}}</div>
				<div class="titleLine"></div>
				<div class="filterBox" v-if="createType=='dt'">
					<template v-for="(filterItem,i) in filterArr" :key="'filterItem'+i">
						<span>#</span>
						<span>{{filterItem.name.split("#")[0]}}&nbsp;</span>
						<span v-if="filterItem.value">{{filterItem.value}}</span>
						<span v-else-if="filterItem.minValue&&filterItem.maxValue">
							({{filterItem.minValue}},{{filterItem.maxValue}}]</span>
						<span v-else-if="filterItem.minValue">≥{{filterItem.minValue}}</span>
						<span v-else-if="filterItem.maxValue">＜{{filterItem.maxValue}}</span>
						<span v-else-if="filterItem.values">＜{{filterItem.values}}</span>
						<span># </span>
					</template>
				</div>
				<van-field v-model="groupName" type="text" label="群组名称" maxlength="10" required placeholder="请输入名称" />
				<van-field v-model="groupRemark" type="textarea" label="客群描述" placeholder="请输入说明" rows="1" autosize
					maxlength="30" show-word-limit />
				<div class="createBtns">
					<div class="createBtn createBtn1" @click="showCreate=false">取消</div>
					<div class="createBtn createBtn2" @click="createGroup">创建</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		formatNumW,
		formatNums
	} from "@/api/common.js";
	import {
		custServiceAdd,
		queryCustSearchList
	} from "@/request/custinfo.js";
	import {
		Toast
	} from "vant";
	import {
		queryFilterResultList,
		saveGroupActiveInfo,
		queryFilterResultSum,
		saveGroupFixCust
	} from "../../request/market.js";
	export default {
		data() {
			return {
				filterArr: [],
				loading: false,
				finished: false,
				pageIndex: 0,
				chooseItems: [],
				custList: [],
				showChecked: false,
				custItemArr: [{
						key: 'aumDifVal',
						value: '极差值'
					},
					{
						key: 'aumHistHestVal',
						value: '历史最高资产'
					},
					{
						key: 'aumBal',
						value: 'AUM资产'
					},
					{
						key: 'timeDpsitBal',
						value: '定期'
					},
					{
						key: 'currDpsitBal',
						value: '活期'
					},
					{
						key: 'loanBal',
						value: '贷款'
					},
				],
				total: 0,
				aumBal: "正在获取...",
				loanBal: "正在获取...",
				pageReady: false,
				showPopover: false,
				actions: [{
					text: "加入已有群组",
					color: "#026DFF"
				}, {
					text: "创建固定群组",
					color: "#026DFF"
				}],
				showCreate: false,
				createType: "dt",
				groupName: "",
				groupRemark: "",
				newGroup: false,
				gdParams: {},
			}
		},
		watch: {
			showCreate() {
				if (this.showCreate) {
					this.groupName = "";
					this.groupRemark = "";
				}
			},
			showChecked() {
				if (this.showChecked) {
					this.chooseItems = [];
				}
			}
		},
		methods: {
			formatNumW,
			formatNums,
			onLoad() {
				if (!this.pageReady) return;
				this.finished = false;
				this.loading = true;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				queryFilterResultList({
					pageSize: "10",
					pageNum: this.pageIndex.toString(),
					listCustFilter: this.filterArr
				}, (res) => {
					if (res.data && res.data.records) {
						this.total = res.data.total;
						this.custList = this.custList.concat(res.data.records);
						if (this.custList.length >= this.total || res.data.records.length <= 0) this.finished =
							true;
					} else {
						this.finished = true;
					}
					Toast.clear();
					this.loading = false;
				});
			},
			checkShare() {
				this.showChecked = false;
				Toast("功能开发中");
			},
			onSelect(action) {
				switch (action.text) {
					case "加入已有群组":
						this.newGroup = false;
						this.showChecked = true;
						break;
					case "创建固定群组":
						this.newGroup = true;
						this.createType = "gd";
						this.showChecked = true;
						break;
				}
			},
			allIn() {
				this.gdParams = {
					listCustFilter: this.filterArr,
				};
				if (this.newGroup) {
					this.showCreate = true;
				} else {
					localStorage.setItem("newGroupSearchResult", "0")
					this.$router.push({
						name: 'myGroup',
						params: {
							active: 1,
							gdParams: JSON.stringify(this.gdParams),
						}
					})
				}
			},
			someIn() {
				if (this.chooseItems.length) {
					this.gdParams = {
						custNums: this.chooseItems,
					};
					if (this.newGroup) {
						this.showCreate = true;
					} else {
						localStorage.setItem("newGroupSearchResult", "0")
						this.$router.push({
							name: 'myGroup',
							params: {
								active: 1,
								gdParams: JSON.stringify(this.gdParams),
							}
						})
					}
				} else {
					Toast("请至少选择1项")
				}
			},
			createGroup() {
				if (!this.groupName) {
					Toast("请输入群组名称");
					return;
				};
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				switch (this.createType) {
					case "dt":
						saveGroupActiveInfo({
							listCustFilter: this.filterArr,
							acGroupNm: this.groupName,
							rmk: this.groupRemark
						}, (res) => {
							if (res.data == "操作成功") {
								Toast.success("创建成功");
								this.showCreate = false;
								setTimeout(() => {
									this.$router.push({
										name: 'myGroup',
									})
								}, 800)
							} else {
								Toast.fail(res.msg)
							}
						})
						break;
					case "gd":
						this.gdParams.acGroupNm = this.groupName;
						this.gdParams.rmk = this.groupRemark;
						saveGroupFixCust(this.gdParams, (res) => {
							if (res.data == "操作成功") {
								Toast.success("创建成功");
								this.showCreate = false;
								setTimeout(() => {
									this.$router.push({
										name: 'myGroup',
										params: {
											active: 1
										}
									})
								}, 800)
							} else {
								Toast.fail(res.msg)
							}
						})
						break;
				}
			},
			mounted_m() {
				this.filterArr = JSON.parse(this.$route.params.filterArr);
				this.pageReady = true;
				queryFilterResultSum({
					listCustFilter: this.filterArr
				}, (res) => {
					this.aumBal = res.data.aumBal || 0;
					this.loanBal = res.data.loanBal || 0;
				})
				this.onLoad()
			}
		},
		mounted() {
			localStorage.setItem("newGroupSearchResult", "0");
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("newGroupSearchResult") == "0") {
				localStorage.setItem("newGroupSearchResult", "1")
			} else {
				this.filterArr = [];
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.chooseItems = [];
				this.custList = [];
				this.showChecked = false;
				this.total = 0;
				this.aumBal = "正在获取...";
				this.loanBal = "正在获取...";
				this.pageReady = false;
				this.showPopover = false;
				this.showCreate = false;
				this.groupName = "";
				this.groupRemark = "";
				this.newGroup = false;
				this.gdParams = {};
				this.mounted_m();
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

	.home {
		background: #F8F8F8;
	}

	.fixedPlace {
		background: #F8F8F8;
		width: 100%;
		position: fixed;
		padding: 0 0.12rem;
		z-index: 9;
	}

	.plate1 {
		width: 100%;
		margin: 0.15rem 0 0.07rem;
		background: #FFFFFF;
		box-shadow: 0rem 0.02rem 0.1rem 0rem rgba(217, 229, 242, 0.6000);
		border-radius: 0.08rem;
		padding: 0 0.12rem;
	}

	.plate1_1 {
		width: 100%;
		height: 0.48rem;
		line-height: 0.48rem;
		text-align: left;
		font-size: 0.17rem;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #262626;
		border-bottom: solid 0.01rem #EFEFEF;
	}

	.plate1_2 {
		width: 100%;
		height: 0.68rem;
		overflow-x: auto;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	.plate1_2::-webkit-scrollbar {
		display: none;
	}

	.plate1_2_item {
		height: 0.4rem;
		max-width: 60%;
		background: #F2F8FF;
		border-radius: 0.2rem;
		padding: 0.05rem 0.14rem;
		flex-shrink: 0;
		margin-right: 0.1rem;
	}

	.plate1_2_item_text {
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.15rem;
	}

	.plate2 {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.plate2_item {
		width: 50%;
		height: 0.3rem;
		line-height: 0.3rem;
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
	}

	.plate2_item:nth-child(odd) {
		text-align: left;
	}

	.plate2_item:nth-child(even) {
		text-align: right;
	}

	.bottomBtns {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		background-color: #FFFFFF;
		border-top: solid 0.01rem #F8F8F8;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9;
	}

	.bottomBtn {
		width: calc(100% / 3);
		height: 0.6rem;
		padding: 0.11rem 0;
	}

	.bottomBtn_popup {
		width: calc(100% / 3);
		height: 0.6rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.bottomBtnIcon {
		width: 0.24rem;
		height: 0.24rem;
		margin: 0 auto;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}

	.bottomBtnIcon1 {
		background-image: url(../../assets/image/group_res_bottom_share.png);
	}

	.bottomBtnIcon2 {
		background-image: url(../../assets/image/group_res_bottom_dt.png);
	}

	.bottomBtnIcon3 {
		background-image: url(../../assets/image/group_res_bottom_gd.png);
	}

	.bottomBtnName {
		width: 100%;
		height: 0.14rem;
		text-align: center;
		font-size: 0.1rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #026DFF;
		line-height: 0.14rem;
	}

	.home>:deep(.van-popup) {
		width: 91.47%;
		background-color: transparent;
	}

	.createBox {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		padding-bottom: 0.22rem;
	}

	.createTitle {
		width: 100%;
		height: 0.45rem;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.45rem;
		text-align: center;
	}

	.titleLine {
		width: 100%;
		height: 0.07rem;
		box-shadow: inset 0rem 0.01rem 0rem 0rem #E7E9EC;
		margin-bottom: 0.04rem;
	}

	.filterBox {
		width: 89.5%;
		max-height: 0.7rem;
		overflow-y: auto;
		background: #F2F8FF;
		padding: 0.08rem 0.05rem;
		border-radius: 0.05rem;
		margin: 0.12rem auto 0;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.18rem;
		text-align: left;
	}

	.createBox :deep(.van-cell) {
		width: calc(100% - 0.72rem);
		margin: 0.19rem auto 0.29rem;
	}

	.createBox :deep(.van-cell:after) {
		border-bottom: 0;
	}

	.createBox :deep(.van-cell__title) {
		text-align: right;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		width: 0.68rem;
		line-height: 0.4rem;
		white-space: nowrap;
	}

	.createBox :deep(.van-cell__value) {
		width: 100%;
		background-color: #F5F5F5;
		border-radius: 0.05rem;
	}

	.createBox :deep(.van-field__body) {
		min-height: 0.4rem;
		padding: 0 0.12rem;
	}

	.createBox :deep(.van-field__word-limit) {
		padding-right: 0.06rem;
	}

	.createBox :deep(.van-field__label--required:before) {
		color: #026DFF;
	}

	.createBtns {
		height: 0.3rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.createBtn {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 0.3rem;
		text-align: center;
		margin: 0 0.1rem;
	}

	.createBtn1 {
		border: solid 0.01rem #026DFF;
		color: #026DFF;
	}

	.createBtn2 {
		background: #026DFF;
		color: #FFFFFF;
	}

	.bottomBtn_c {
		width: 0.88rem;
		height: 0.4rem;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 0.4rem;
		margin: 0.12rem 0.05rem 0.12rem 0;
	}

	.bottomBtn_c1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}

	.bottomBtn_c2 {
		background: #026DFF;
		color: #FFFFFF;
	}
</style>

<style lang="less" scoped>
	.vanListStyle {
		padding: 0 0.12rem;
		max-width: 100%;
		overflow: hidden;

		.custItem {
			width: 100%;
			margin: 0.12rem auto 0;
			background: #FFFFFF;
			box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
			border-radius: 0.08rem;
			padding: 0.12rem;
			position: relative;
			transition: margin-left 0.3s;

			.leftCheckBox {
				width: 0.2rem;
				height: 0.2rem;
				flex-shrink: 0;
				position: absolute;
				top: 50%;
				left: -12.5%;
				transform: translateY(-50%);
				display: flex;
				justify-content: flex-end;
			}

			.custItem1 {
				width: 100%;
				height: 0.44rem;
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;

				.custItem1_2 {
					display: flex;
					flex-wrap: wrap;

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

						.vipCstFlg,
						.agentPayCstFlg,
						.newCstFlg,
						.merntCstFlg,
						.ioinHoldLoan,
						.crdtCrdCstFlg {
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

						.vipCstFlg {
							background-color: rgba(2, 109, 255, 0.08);
							color: #026DFF;
						}

						.agentPayCstFlg {
							background-color: rgba(255, 133, 0, 0.08);
							color: #FF8500;
						}

						.newCstFlg {
							background-color: rgba(255, 58, 58, 0.08);
							color: #FF3A3A;
						}

						.merntCstFlg {
							background-color: rgba(68, 107, 161, 0.08);
							color: #446BA1;
						}

						.ioinHoldLoan {
							background-color: rgba(55, 205, 55, 0.08);
							color: #13AD13;
						}

						.crdtCrdCstFlg {
							background-color: rgba(176, 177, 255, 0.08);
							color: #B0B1FF
						}
					}
				}

				.playFrom {
					display: flex;
					justify-content: space-around;
				}
			}

			.custItem2 {
				display: flex;
				flex-wrap: wrap;
				margin-top: 0.12rem;

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
					margin-top: 0.04rem;
				}

				.custItem2_childName {
					color: #8C8C8C;
				}

				.custItem2_childValue {
					color: #262626;
				}
			}

			.custItem3 {
				width: 100%;
				margin: 0 auto 0.1rem;
				height: 0.01rem;
				box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
			}

			.bottomText {
				display: flex;
				font-size: 0.12rem;

				&>div {
					width: 50%;
					text-align: left;
					letter-spacing: 0;
				}
			}
		}
	}
</style>
