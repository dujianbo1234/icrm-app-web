<template>
	<div class="home">
		<nav-bar title="我的商机" type="2" />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="palte1_1">商机进度：{{'78.95%'}}</div>
				<van-progress color="#026DFF" track-color="#EBEBEB" pivot-text="" :percentage="78.95" />
				<div class="plate1_2">
					<div class="plate1_2_child"
						v-for="(item,i) in [{name:'总数',value:'145'},{name:'已跟进',value:'113'},{name:'成交率',value:'16.85%'},{name:'逾期未跟进率',value:'18.74%'}]"
						:key="'plate1_2_child'+i">
						<span class="plate1_2_childName">{{item.name}}：</span>
						<span class="plate1_2_childValue">{{item.value}}</span>
					</div>
				</div>
			</div>
			<div class="plate2">
				<div class="plate2_child" v-for="(orderItem,i) in orderList" :key="'orderItem'+i"
					@click="changeOrder(i)">
					<span>{{orderItem}}</span>
					<van-icon v-if="i!=orderIndex" :name="require('../../assets/image/common_order_none.png')"
						size="20" />
					<van-icon v-else-if="orderType" :name="require('../../assets/image/common_order_down.png')"
						size="20" />
					<van-icon v-else :name="require('../../assets/image/common_order_up.png')" size="20" />
				</div>
			</div>
			<div class="plate3">
				<div class="plate3_father">
					<div :class="i==kequnIndex?'plate3_child_a':'plate3_child'" v-for="(kequnItem,i) in kequnList"
						:key="'kequnItem'+i" @click="changeKequn(i)">
						{{kequnItem.text}}
					</div>
				</div>
			</div>
		</div>
		<div style="height: 2.33rem;"></div>
		<div class="businessItem" v-for="(item,i) in msgList" :key="'item'+i" @click="openDetail(item)">
			<div class="itemPlate1">{{item.value0}}</div>
			<div class="itemPlate2">
				<van-rate v-model="item.value1" :size="18" color="#FFBA00" void-icon="star" readonly
					void-color="#E0E0E0" allow-half />
				<div class="itemPlate2_value">{{item.value1}}</div>
			</div>
			<div class="itemPlate3">{{item.value2}}/{{item.value3}}/{{item.value4}}</div>
			<div class="itemPlate4">
				<div class="itemPlate4_child">
					<span class="itemPlate4_childName">客户数：</span>
					<span class="itemPlate4_childValue" style="color: #FF3A3A;">{{item.value5}}人</span>
				</div>
				<div class="itemPlate4_child">
					<span class="itemPlate4_childName">到期日期：</span>
					<span class="itemPlate4_childValue">{{item.value6}}</span>
				</div>
				<div class="itemPlate4_child">
					<span class="itemPlate4_childName">跟进率：</span>
					<span class="itemPlate4_childValue">{{item.value7}}</span>
				</div>
				<div class="itemPlate4_child">
					<span class="itemPlate4_childName">成交率：</span>
					<span class="itemPlate4_childValue">{{item.value8}}</span>
				</div>
			</div>
			<div class="itemPlate5">
				{{item.value9}}
			</div>
		</div>
		<div class="bottomZW"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				orderIndex: null,
				orderType: true,
				orderList: ["跟进率", "成交率", "好评率", "到期日期"],
				kequnIndex: 0,
				kequnList: [{
					text: "全部",
					value: ""
				}, {
					text: "基础客群",
					value: ""
				}, {
					text: "财富客群",
					value: ""
				}, {
					text: "贷款客群",
					value: ""
				}, {
					text: "代发客群",
					value: ""
				}, {
					text: "商户客群",
					value: ""
				}, {
					text: "其他",
					value: ""
				}],
				msgList: [{
					value0: "商户客户提升",
					value1: 3.5,
					value2: "年交易笔数",
					value3: "年交易额",
					value4: "AUM年日均",
					value5: "2",
					value6: "2022-05-31",
					value7: "100%",
					value8: "100%",
					value9: "商户客群",
					value10: "近一个月交易天数>12，交易额>10万，广义AUM月日均/近12个月累计交易金额小于10%",
				}],
			}
		},
		methods: {
			changeOrder(i) {
				if (i == this.orderIndex) {
					this.orderType = !this.orderType;
				} else {
					this.orderIndex = i;
					this.orderType = true;
				}
			},
			changeKequn(i) {
				this.kequnIndex = i;
			},
			openDetail(item) {
				localStorage.setItem("lastPageParams",JSON.stringify(item));
				this.$router.push({
					name: 'chooseCust',
					params: {item: JSON.stringify(item)}
				})
			}
		},
		mounted() {
			
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
		background-color: #FFFFFF;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		z-index: 9;
	}

	.plate1 {
		width: 93.6%;
		margin: 0.12rem auto;
		padding: 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.1rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
	}

	.palte1_1 {
		width: 100%;
		line-height: 0.28rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.2rem;
		color: rgba(0, 0, 0, 0.85);
		letter-spacing: 0;
		font-weight: 500;
		margin-bottom: 0.04rem;
	}

	.plate1_2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.08rem;
		margin-bottom: -0.07rem;
	}

	.plate1_2_child {
		width: 50%;
		flex-shrink: 0;
		line-height: 0.17rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		text-align: left;
		letter-spacing: 0;
		font-weight: 400;
		margin-bottom: 0.07rem;
	}

	.plate1_2_childName {
		color: #8C8C8C;
	}

	.plate1_2_childValue {
		color: #262626;
	}

	.plate2 {
		display: flex;
		flex-wrap: nowrap;
		height: 0.44rem;
		background: #FFFFFF;
		align-items: center;
		justify-content: space-around;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate2_child {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		flex-shrink: 0;
		line-height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
	}

	.plate3 {
		overflow: auto;
		width: 100%;
		height: 0.56rem;
		background: #FFFFFF;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate3_father {
		width: 6.32rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding: 0.12rem;
		align-items: center;
	}

	.plate3_child,
	.plate3_child_a {
		flex-shrink: 0;
		text-align: center;
		margin-right: 0.08rem;
		width: 0.8rem;
		line-height: 0.32rem;
		border-radius: 0.08rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		letter-spacing: 0;
	}

	.plate3_child {
		background: #F5F5F5;
		color: #595959;
		font-weight: 400;
	}

	.plate3_child_a {
		background: rgba(2, 109, 255, 0.12);
		color: #026DFF;
		font-weight: 500;
	}

	.plate3::-webkit-scrollbar {
		display: none;
	}

	.businessItem {
		width: 93.6%;
		margin: 0.12rem auto;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.1rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
		overflow: hidden;
	}

	.itemPlate1 {
		width: 100%;
		height: 0.24rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
	}

	.itemPlate2 {
		height: 0.21rem;
		margin-top: 0.02rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.itemPlate2_value {
		width: 0.21rem;
		height: 0.21rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 500;
		margin-left: 0.09rem;
	}

	.itemPlate3 {
		width: 100%;
		height: 0.18rem;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-top: 0.05rem;
	}

	.itemPlate4 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.17rem;
		margin-bottom: -0.04rem;
	}

	.itemPlate4_child {
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

	.itemPlate4_childName {
		color: #8C8C8C;
	}

	.itemPlate4_childValue {
		color: #262626;
	}

	.itemPlate5 {
		width: 1rem;
		height: 0.2rem;
		line-height: 0.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #FFFFFF;
		letter-spacing: 0;
		font-weight: 400;
		background: url(../../assets/image/business_main_tag.png) no-repeat;
		background-size: cover;
		position: absolute;
		top: 0;
		right: 0;
		padding-left: 0.16rem;
	}
</style>
