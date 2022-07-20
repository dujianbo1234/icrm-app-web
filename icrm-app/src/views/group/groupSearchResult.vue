<template>
	<div class="home">
		<nav-bar title="筛选结果" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="plate1_1">选客策略</div>
				<div class="plate1_2">
					<div class="plate1_2_item" v-for="(filterItem,i) in filterArr" :key="'filterItem'+i">
						<div class="plate1_2_item_text">#{{filterItem.name.split("#")[0]}}#</div>
						<div class="plate1_2_item_text" v-if="filterItem.value">{{filterItem.value}}</div>
						<div class="plate1_2_item_text" v-else-if="filterItem.minValue&&filterItem.maxValue">({{filterItem.minValue}},{{filterItem.maxValue}}]</div>
						<div class="plate1_2_item_text" v-else-if="filterItem.minValue">≥{{filterItem.minValue}}</div>
						<div class="plate1_2_item_text" v-else-if="filterItem.maxValue">＜{{filterItem.maxValue}}</div>
					</div>
				</div>
			</div>
			<div class="plate2">
				<div class="plate2_item">筛选结果：共{{formatNums(total || 0)}}位客户</div>
				<div class="plate2_item"></div>
				<div class="plate2_item">AUM总额：1,935,165.89万元</div>
				<div class="plate2_item">贷款总额：1,935,165.89万元</div>
			</div>
		</div>
		<div style="height: 1.98rem;"></div>
		<van-list class="vanListStyle" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
			@load="onLoad" :immediate-check="false">
			<van-checkbox-group v-model="chooseItems" ref="checkboxGroup">
				<div class="custItem" v-for="(item,i) in custList" :key="'item'+i"
					:style="{'margin-left':showChecked?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="item"></van-checkbox>
					</div>
					<div class="custItem1">
						<div class="custItem1_2">
							<div class="custItem1_2_1">{{item.cstName}}</div>
							<div class="custItem1_2_2"
								:style="`background-image:url(${require(`@/assets/image/business_chooseCust_type${item.svcLvlCount || 0}.png`)})`">
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
		<div class="bottomBtns">
			<div class="bottomBtn" @click="checkShare">
				<div class="bottomBtnIcon bottomBtnIcon1"></div>
				<div class="bottomBtnName">分享</div>
			</div>
			<div class="bottomBtn" @click="checkShare">
				<div class="bottomBtnIcon bottomBtnIcon2"></div>
				<div class="bottomBtnName">动态群组</div>
			</div>
			<div class="bottomBtn_popup">
				<van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" placement="top" :show-arrow="false" :offset="[-15,11]">
					<template #reference>
						<div class="bottomBtnIcon bottomBtnIcon3"></div>
						<div class="bottomBtnName">固定群组</div>
					</template>
				</van-popover>
			</div>
			<div class="bottomZW" style="width: 100%;"></div>
		</div>
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
				pageReady: false,
				showPopover: false,
				actions: [{
					text: "加入已有群组",
					color: "#026DFF"
				}, {
					text: "创建固定群组",
					color: "#026DFF"
				}]
			}
		},
		methods: {
			formatNumW,
			formatNums,
			onLoad() {
				if (!this.pageReady) return;
				this.finished = false;
				this.loading = true;
				// Toast.loading({
				// 	message: "正在加载",
				// 	forbidClick: true,
				// 	duration: 0,
				// });
				this.pageIndex++;
				var params = {
					pageSize: "10",
					pageNum: this.pageIndex.toString(),
					belgCustMgr: '',
					cstName: "",
					svcLvl: "",
					ctcTel: "",
					certNum: "",
					cstLvl: "",
					belongOrg: ""
				};
				queryCustSearchList(params, (res) => {
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
				Toast("功能开发中");
			},
			onSelect(action) {
				Toast(action.text);
			},
		},
		mounted() {
			this.filterArr = JSON.parse(this.$route.params.filterArr);
			this.pageReady = true;
			this.onLoad()
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
