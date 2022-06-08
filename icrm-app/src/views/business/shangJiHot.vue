<template>
	<div class="home">
		<nav-bar type="2" title="商机榜单" leftIcon />
        <van-tabs class="tabBarStyle" v-model:active="active" line-width="80" color="#0088FF" title-active-color="#026DFF"
				title-inactive-color="#262626" @click-tab="onClickTab">
				<van-tab title="热榜" />
				<van-tab title="成交榜" />
				<van-tab title="好评榜" />
		</van-tabs>
		<van-list id="listHeight" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="vanList" :style="{height:listHeight+'px'}">
			<div v-for="(shangJiItem, i) in shangJiList.slice(0,3)" :key="'shangJiItem' + i" class="shangJiCardOutBox">
				<div style="display:flex;justify-content: space-between;align-items: center;">
					<div class="shangJiHeader">
						<van-icon style="margin-left:0.04rem" :name="require('../../assets/image/tabbar_cust_main_bdTop'+(i+1)+'.png')" size="12" />
						<span class="shangJiTitle" style="margin-left: 0.12rem;">{{shangJiItem.modelName}}</span>
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='2')||(chengJiaoBang && shangJiItem.dealNumFlag=='2')||(haoPingBang && shangJiItem.laimScoreFlag=='2')" style="margin-left:0.04rem" :name="require('../../assets/image/up.png')" size="12" />
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='1')||(chengJiaoBang && shangJiItem.dealNumFlag=='1')||(haoPingBang && shangJiItem.laimScoreFlag=='1')" style="margin-left:0.04rem" :name="require('../../assets/image/down.png')" size="12" />
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='0')||(chengJiaoBang && shangJiItem.dealNumFlag=='0')||(haoPingBang && shangJiItem.laimScoreFlag=='0')" style="margin-left:0.04rem" :name="require('../../assets/image/line.png')" size="12" />
					</div>
					<div style="display:flex">
						<van-icon v-if="reBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/huore.png')" size="12" />
						<van-icon  v-if="chengJiaoBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/chengjiao.png')" size="12" />
						<van-icon  v-if="haoPingBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/dianzan.png')" size="12" />
						<span v-if="reBang" class="textStyle">{{shangJiItem.hotList}}</span>
						<span v-if="chengJiaoBang" class="textStyle">{{(Number(shangJiItem.dealNum)*100).toFixed(1)}}%</span>
						<span v-if="haoPingBang" class="textStyle">{{Number(shangJiItem.laimScore).toFixed(1)}}</span>
					</div>
				</div>
                <div class="shangJiCreator">
					创建人：{{shangJiItem.crtUsrName}}
				</div>

			</div>
            <div v-for="(shangJiItem, i) in shangJiList.slice(3)" :key="'shangJiItem' + i" class="shangJiCardOutBox">
				<div style="display:flex;justify-content: space-between;align-items: center;">
					<div class="shangJiHeader">
						<div class="sjIcon">{{i+4}}</div>
						<span class="shangJiTitle" style="margin-left: 0.12rem;">{{shangJiItem.modelName}}</span>
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='2')||(chengJiaoBang && shangJiItem.dealNumFlag=='2')||(haoPingBang && shangJiItem.laimScoreFlag=='2')" style="margin-left:0.04rem" :name="require('../../assets/image/up.png')" size="12" />
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='1')||(chengJiaoBang && shangJiItem.dealNumFlag=='1')||(haoPingBang && shangJiItem.laimScoreFlag=='1')" style="margin-left:0.04rem" :name="require('../../assets/image/down.png')" size="12" />
						<van-icon v-if="(reBang && shangJiItem.hotListFlag=='0')||(chengJiaoBang && shangJiItem.dealNumFlag=='0')||(haoPingBang && shangJiItem.laimScoreFlag=='0')" style="margin-left:0.04rem" :name="require('../../assets/image/line.png')" size="12" />
					</div>
					<div style="display:flex">
						<van-icon v-if="reBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/huore_gray.png')" size="12" />
						<van-icon  v-if="chengJiaoBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/chengjiao_gray.png')" size="12" />
						<van-icon  v-if="haoPingBang" style="margin-right:0.04rem;margin-top: 0.02rem;" :name="require('../../assets/image/dianzan_gray.png')" size="12" />
						<span v-if="reBang" class="textStyle1">{{shangJiItem.hotList}}</span>
						<span v-if="chengJiaoBang" class="textStyle1">{{(Number(shangJiItem.dealNum)*100).toFixed(1)}}%</span>
						<span v-if="haoPingBang" class="textStyle1">{{Number(shangJiItem.laimScore).toFixed(1)}}</span>
					</div>
				</div>
				
                 <div class="shangJiCreator">
					创建人：{{shangJiItem.crtUsrName}}

				</div>

			</div>
		</van-list>
		
	</div>
</template>

<script>
	import {
		Toast,
		Dialog,
		Overlay,
		Button
	} from "vant";
	import {
		queryCmrcOpportRankList
	} from "../../request/market.js";
	export default {
		data() {
			return {
                active:0,
				showApprove: false,
				finished: false,
				pageIndex: 0,
				orderField:'',
				loading:false,
				reBang:true,
				listHeight:'',
				chengJiaoBang:false,
				haoPingBang:false,
				shangJiList: [
                    
				],
			};
		},
		components: {},
		methods: {
			getHeight(){
				var mainHeight = document.documentElement.clientHeight;
				var listHeight = document.getElementById('listHeight');
				var toTop =  listHeight.offsetTop;
				this.listHeight = mainHeight-toTop
				console.log('列表的高度',this.listHeight)

			},
			onClickTab(el){
				this.pageIndex = 0
				this.shangJiList = []
				console.log(el)
				if(el.name=='0'){
					this.orderField='HOT_LIST_RANK'
					this.reBang=true
					this.chengJiaoBang=false
					this.haoPingBang=false
					
				}else if(el.name=='1'){
					this.orderField='DEAL_NUM_RANK'
					this.reBang=false
					this.chengJiaoBang=true
					this.haoPingBang=false
				}else{
					this.orderField='LAIM_SCORE_RANK'
					this.reBang=false
					this.chengJiaoBang=false
					this.haoPingBang=true
				}
				this.onLoad()

			},
			onLoad() {
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				let params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					etlDt:this.$route.query.etlDt,
					orderField: this.orderField,
				};
				this.params = JSON.stringify(params);
				queryCmrcOpportRankList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.allNum = res.data.total.toLocaleString();
						this.shangJiList = this.shangJiList.concat(res.data.records);
						if (this.shangJiList.length >= this.allNum) this.finished = true;
					} else {
						Toast.fail("商机热榜列表为空");
						this.finished = true;
					}
					this.loading = false;
				});
			},
		},
		mounted() {
			this.getHeight()
			this.orderField='HOT_LIST_RANK'
			// this.active=Number(this.$route.query.busiBdIndex)
			this.active=(this.$route.query.busiBdIndex)*1
			this.onClickTab({name:this.active})
            
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
		overflow: hidden;
		background-color: #fff;
	}

	.vanList {
		margin-top: 0.09rem;
		overflow: auto;
	}
    .tabBarStyle{
        margin-top: 0.15rem;
        border-bottom: 1px solid #F2F2F2;
    }
    .tabBarStyle :deep(.van-tab__text--ellipsis){
        font-weight: 600;
        margin-bottom: 0.14rem;
        font-size: 0.16rem;
    }
	.shangJiHeader{
		display: flex;
        align-items: center;
		font-size: 0.15rem;
		text-align: left;
		max-width: 80%;
	}
	.shangJiCardOutBox {
		border-bottom: solid 1px #F2F2F2;
		padding: 0.15rem 0;
		width: 90%;
		margin: 0 auto;
        
	}

	.shangJiCardOutBox:last-child {
		border: 0;
	}
    .sjIcon{
        width: 0.18rem;
        height: 0.18rem;
        background: #EFEFEF;
        border-radius: 50%;
        text-align: center;
        color: #ccc;
        font-size: 0.11rem;
        line-height: 0.18rem;
    }
	.shangJiCreator{
		/* height: 0.28rem; */
		margin-top: 0.06rem;
		/* margin-bottom: 0.0rem; */
		text-align: left;
		margin-left: 0.26rem;
		font-size: 0.11rem;
		color:#BFBFBF ;
	}
	.textStyle{
		font-size: 0.11rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #E6494E;
	}
	.textStyle1{
		font-size: 0.11rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
	}
	.shangJiTitle{
		font-size: 0.13rem;
		font-weight: 500;
		color: #262626;
	}
</style>
