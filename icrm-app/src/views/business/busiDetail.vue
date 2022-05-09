<template>
	<div class="home">
		<nav-bar title="商机详情" type="2" leftIcon />
		<div class="plate1">
			<div class="plate1_1 ycsl">{{baseMsg.cmrcOpptSubclassNm}}</div>
			<div class="plate1_2">
				<div class="plate1_2_child">
					<div class="plate1_2_childName">客户</div>
					<div class="plate1_2_childValue" style="display: flex;">
						<div class="plate1_2_childValue1">{{baseMsg.custNm}}</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='1'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='2'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='3'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='4'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='5'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='6'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}"></div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='7'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type7.png')+')'}"></div>
					</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">联系电话</div>
					<div class="plate1_2_childValue">{{baseMsg.ctcTel}}</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">跟进人</div>
					<div class="plate1_2_childValue plate1_2_childValue1">{{baseMsg.followUpPrsnNm}}（{{baseMsg.followUpPrsn}}）</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">归属机构</div>
					<div class="plate1_2_childValue">{{baseMsg.belongOrgNm}}</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">极差值</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumDifVal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">历史最高资产</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumHistHestVal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">AUM资产</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">定期</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.timeDpsitBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">活期</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.currDpsitBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">贷款</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.loanBal/10000)}}万元</div>
				</div>
			</div>
			<div class="plate1_2">
				<div class="plate1_2_child" style="width: 100%;">
					<div class="plate1_2_childName">商机描述</div>
					<div class="plate1_2_childValue">{{baseMsg.cmrcOpptDsc}}</div>
				</div>
			</div>
			<div class="plate1_3"></div>
			<div class="plate1_4">
				<span style="color: #026DFF;font-weight: 500;">#推荐理由#</span>
				<span>{{baseMsg.recomRea}}</span>
			</div>
			<div class="plate1_5" v-if="haveScore">
				<div class="plate1_5_1">我评</div>
				<van-rate v-model="score" :size="18" color="#FFBA00" void-icon="star" readonly void-color="#E0E0E0" allow-half />
				<div class="plate1_5_2">{{score}}</div>
				<div class="plate1_5_3" @click="changeScore=true">
					<van-icon :name="require('../../assets/image/common_edit.png')" size="12"/>
					<span style="margin-left: 0.02rem;">修改</span>
				</div>
			</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='2'" style="background-color: #026DFF;">待跟进</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='4'" style="background-color: #FFBA00;">已跟进</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='5'" style="background-color: #52C41A;">已成交</div>
		</div>
		<div class="plate2" v-if="!haveScore&&showScore">
			<div class="plateTitle">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">请您对该商机实用度进行评价</div>
			</div>
			<div class="plate2_1" :style="{'background': score?'#026DFF':'#B3D3FF'}" @click="saveScore">发布</div>
			<div class="plate2_2">
				<div class="plate2_2_1">实用度</div>
				<van-rate v-model="score" :size="27" color="#FFBA00" void-icon="star" void-color="#E0E0E0" allow-half />
				<div class="plate2_2_2" v-if="score">{{score}}</div>
				<div class="plate2_2_3" v-if="score">较好</div>
			</div>
			<div class="plate2_3"></div>
			<div class="plate2_4">
				<span style="margin-right: 0.02rem;">看看大家都怎么评</span>
				<van-icon name="arrow" color="#026DFF"/>
			</div>
		</div>
		<div class="plate3">
			<div class="plateTitle">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">跟进记录</div>
			</div>
		</div>
		<div class="plate4">
			<div class="plateTitle">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">他的其他商机</div>
			</div>
		</div>
		<div class="bottomZW"></div>
		<div style="height: 0.66rem;"></div>
		<div class="plate5">
			
		</div>
		<van-overlay :show="changeScore">
			<div class="plate6">
				<div class="plate6_1">修改评分</div>
				<div class="plate6_2">
					<van-rate v-model="score" :size="27" color="#FFBA00" void-icon="star" void-color="#E0E0E0" allow-half />
				</div>
				<div class="plate6_3">
					<span class="plate6_3_1">{{score}}</span>
					<span class="plate6_3_2">较好</span>
				</div>
				<div class="plate6_4">
					<div class="palte6_4_1">取消</div>
					<div class="palte6_4_2">提交</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		formatNum
	} from "../../api/common.js";
	import {
		queryCmrcOpportunityDetail,
		queryOpportPractialInfo,
		saveOpportPractialInfo
	} from "../../request/market.js";
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				baseMsg: {
					aumDifVal: 0,
					aumHistHestVal: 0,
					aumBal: 0,
					timeDpsitBal: 0,
					currDpsitBal: 0,
					loanBal: 0,
				},
				score: 0,
				haveScore: false,
				showScore: false,
				changeScore: false,
			}
		},
		methods: {
			formatNum,
			saveScore() {
				saveOpportPractialInfo({
					sysId: this.baseMsg.sysId,
					cmrcOpptId: this.baseMsg.cmrcOpptId,
					score: this.score
				}, (res) => {
					if(res.data=="操作成功"){
						this.haveScore = true;
						Toast.success("操作成功");
					}
				});
			}
		},
		mounted() {
			queryCmrcOpportunityDetail({
				sysId: this.$route.params.sysId
			}, (res) => {
				this.baseMsg = res.data;
			});
			queryOpportPractialInfo({
				sysId: this.$route.params.sysId
			}, (res) => {
				if(res.data&&res.data.score){
					this.score = res.data.score;
					this.haveScore = true;
				}
				this.showScore = true;
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
	
	.home {
		background-color: #F8F8F8;
	}
	
	.plate1 {
		width: 93.6%;
		margin: 0.12rem auto;
		padding: 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217,229,242,0.6);
		border-radius: 0.08rem;
		position: relative;
	}
	
	.plate1_1 {
		width: 85%;
		height: 0.27rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.27rem;
		font-weight: 500;
		margin-bottom: 0.08rem;
	}
	
	.plate1_2 {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
	
	.plate1_2_child {
		width: 50%;
	}
	
	.plate1_2_childName {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.02rem;
	}
	
	.plate1_2_childValue {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.08rem;
	}
	
	.plate1_2_childValue1 {
		color: #026DFF;
	}
	
	.plate1_2_childValue2 {
		width: 0.6rem;
		height: 0.16rem;
		margin-left: 0.08rem;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: contain;
	}
	
	.plate1_3 {
		width: 100%;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0,0,0,0.04);
		margin: 0.04rem 0 0.12rem;
	}
	
	.plate1_4 {
		width: 100%;
		font-family: PingFangSC-Regular;
		text-align: left;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}
	
	.plate1_5 {
		width: 100%;
		height: 0.32rem;
		background: #F8F8F8;
		border-radius: 0.04rem;
		margin-top: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding: 0 0.12rem;
		position: relative;
	}
	
	.plate1_5_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
		margin-right: 0.12rem;
	}
	
	.plate1_5_2 {
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		font-weight: 500;
		margin-left: 0.12rem;
	}
	
	.plate1_5_3 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
		position: absolute;
		right: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}
	
	.plate1_6 {
		position: absolute;
		top: 0.18rem;
		right: 0.12rem;
		width: 0.41rem;
		text-align: center;
		height: 0.16rem;
		line-height: 0.16rem;
		border-radius: 0.02rem;
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		color: #FFFFFF;
		font-weight: 400;
	}
	
	.plate2 {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
		position: relative;
		padding-bottom: 0.12rem;
	}
	
	.plate2_1 {
		position: absolute;
		top: 0.09rem;
		right: 0.16rem;
		width: 0.52rem;
		height: 0.26rem;
		border-radius: 0.04rem;
		line-height: 0.26rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #FFFFFF;
		letter-spacing: 0;
		font-weight: 400;
	}
	
	.plate2_2 {
		width: 100%;
		height: 0.72rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		padding: 0 0.12rem;
	}
	
	.plate2_2_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 400;
		margin-right: 0.12rem;
	}
	
	.plate2_2_2,.plate6_3_1 {
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		color: #FFBA00;
		letter-spacing: 0;
		font-weight: 500;
		margin-left: 0.09rem;
	}
	
	.plate2_2_3,.plate6_3_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #595959;
		letter-spacing: 0;
		font-weight: 400;
		margin-left: 0.09rem;
	}
	
	.plate2_3 {
		width: 93.6%;
		height: 0.01rem;
		margin: 0 auto 0.12rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0,0,0,0.04);
	}
	
	.plate2_4 {
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #026DFF;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		padding: 0 0.12rem;
		text-align: left;
	}
	
	.plate3 {
		width: 100%;
		height: 4.46rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
	}
	
	.plate4 {
		width: 100%;
		height: 1.77rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}
	
	.plate5 {
		width: 100%;
		height: calc(constant(safe-area-inset-bottom) + 0.56rem);
		height: calc(env(safe-area-inset-bottom) + 0.56rem);
		background: rgba(0,255,255,0.94);
		box-shadow: 0 -0.005rem 0 0 rgba(0,0,0,0.3);
		position: fixed;
		bottom: 0;
		left: 0;
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
	





	
	.plateTitle {
		width: 100%;
		height: 0.44rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0,0,0,0.04);
		padding: 0 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
	}
	
	.plateTitle1 {
		width: 0.02rem;
		height: 0.14rem;
		background: #026DFF;
		border-radius: 0.02rem;
		margin-right: 0.05rem;
	}
	
	.plateTitle2 {
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 500;
	}
</style>
