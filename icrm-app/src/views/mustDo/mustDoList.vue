<template>
	<div class="home">
		<nav-bar type="2" title="必办" leftIcon />
		<van-tabs class="tabBarStyle" v-model:active="active" line-width="0" color="#0088FF" title-active-color="#026DFF"
				title-inactive-color="#262626" @click-tab="onClickTab">
				<van-tab title="全部" />
				<van-tab title="商户管理" />
				<van-tab title="机关调研" />
		</van-tabs>
		<div class="list">
            <van-tabs class="month" v-model:active="tageListActive" type="card" @change="tageListChange">
				<van-tab v-for="item in tageList" :key="item.key" :title="item.title">
				</van-tab>
            </van-tabs>
        </div>
        <div class="dateRow">
            <div style="font-size:0.13rem">到期日</div>
            <div class="dateGroup">
                <div @click="startDateShow" class="dateInput" :class="beginDate?'dateInputSelect':''">{{beginDate||"开始时间"}}<van-icon :name="require('../../assets/image/common_date.png')" style="margin-left:0.08rem"/></div>
                <div class="dateLineContent"><div class="dateLine"></div></div>
                <div @click="endDateShow" class="dateInput" :class="endDate?'dateInputSelect':''">{{endDate||"结束时间"}}<van-icon :name="require('../../assets/image/common_date.png')" style="margin-left:0.08rem" /></div>
            </div>
        </div>
		<van-calendar color="#1D70F5" v-model:show="dateShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
		<div class="total">
			<div>筛选结果：共{{total}}条数据</div>
		</div>
		<van-list id="listHeight" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="vanList" :style="{height:listHeight+'px'}">
			<div v-for="(mustDoItem, i) in mustDoList" :key="'mustDoItem' + i" class="msgCardOutBox">
				<div class="msgCardBox" @click="openDetail(mustDoItem)">
					<div class="msgCard">
						<div class="msgValue1">
							<div class="msgValue1Left ycsl">{{ mustDoItem.tplNm }}</div>
							<div class="msgValue1Right">
								<div class="msgValue1RightItem"
									:style="{'background-color':mustDoItem.exapSt == '审批通过'? '#52C41A': mustDoItem.exapSt == '审批中'? '#026DFF': '#FF3A3A',}">
									{{ mustDoItem.exapSt }}
								</div>
							</div>
						</div>
						<div class="msgValue2">
							<div class="msgValue2Left ycsl">
								<span class="msgTitleColor">到期日：</span>
								<span class="msgContent">{{ mustDoItem.shrtmsgNum }}</span>
							</div>
							<div class="msgValue3Right">
								<van-icon v-if="mustDoItem.aplyTm == '1'" :name="require('@/assets/image/yiban.png')" size="24"/>
								<van-icon v-else-if="mustDoItem.aplyTm == '2'" :name="require('@/assets/image/daiban.png')" size="24"/>
								<van-icon v-else :name="require('@/assets/image/daiban_gray.png')" size="24"/>
							</div>
						</div>
						<div class="msgValue3"></div>
						<div class="msgValue4">
							<div class="msgValue4Left ycsl">
								<span class="msgTitleColor">机构名称：</span>
								<span class="msgContent">{{ mustDoItem.belongOrgName }}</span>
							</div>
							<div class="msgValue4Right ycsl">
								<span class="msgTitleColor">客户经理：</span>
								<span class="msgContent">{{ mustDoItem.aplyUsrName }}</span>
							</div>
						</div>
					</div>
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
		queryMessageApproveList,
		approveMessageSendApply
	} from "../../request/market.js";
	export default {
		data() {
			return {
				listHeight:'',
				finished:false,
				loading:false,
				beginDate:'',
				endDate:'',
                tageListActive: 0,
				dateShow:false,
				isStartDate:false,
				isEndDate:false,
				minDate:new Date(2010, 0, 1),
				maxDate:new Date(),
                tageList: [
                    { key: '', title: "全部" },
                    { key: 0, title: "商户长期未交易" },
                    { key: 1, title: "调研" },
                ],
				showApprove: false,
				finished: false,
				pageIndex: 0,
				approveIndex: null,
				shrtmsgCntnt: '',
				exapOpnn: '',
				formData: {

				},
				approveTypeList: [{
						codeName: "审批通过",
						codeValue: "2",
					},
					{
						codeName: "审批拒绝",
						codeValue: "3",
					},
				],
				mustDoList: [
					{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},
					{
						tplNm:'商户长期未交易',	
						exapSt:'待办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},
					{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},
					{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					},
					{
						tplNm:'商户长期未交易',	
						exapSt:'已办',
						shrtmsgNum:'2022-05-18',
						aplyTm:'1',
						belongOrgName:'九江XXXXXX支行',
						aplyUsrName:'魏涵',

					}
					

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
			startDateShow(){
				console.log(this.endDate)
				this.dateShow=true
				this.isStartDate=true
				this.isEndDate=false
				if(this.endDate){
					this.maxDate=new Date(this.endDate)
					this.minDate==new Date(2010, 0, 1)
				}
			},
			endDateShow(){
				console.log(this.beginDate)

				this.dateShow=true
				this.isStartDate=false
				this.isEndDate=true
				if(this.beginDate){
					this.minDate=new Date(this.beginDate)
					this.maxDate=new Date(2099,0,1)

				}
			},
			onConfirm(date){
				this.dateShow=false
				const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
				if(this.isStartDate){
					this.beginDate=formatDate(date)
				}else if(this.isEndDate){
					this.endDate=formatDate(date)

				}
			},
			onClickTab(el){
                console.log(el)
                if(el.name=='0'){
                    this.tageList=[
                        { key: '', title: "全部" },
                        { key: 0, title: "商户长期未交易" },
                        { key: 1, title: "调研" },
                    ]
                }else if(el.name=='1'){
                    this.tageList=[
                        { key: '', title: "全部" },
                        { key: 0, title: "商户长期未交易" },
                    ] 
                }else{
                    this.tageList=[
                        { key: '', title: "全部" },
                        { key: 0, title: "调研" },
                    ] 
                }
            },
			onLoad() {
				this.finished = true;
				// Toast.loading({
				// 	message: "正在加载",
				// 	forbidClick: true,
				// 	duration: 0,
				// });
				// this.pageIndex++;
				// let params = {
				// 	pageNum: this.pageIndex.toString(),
				// 	pageSize: "10",
				// 	tplNo: "",
				// 	exapSt: "1",
				// 	belongOrg: "",
				// 	userId: "",
				// };
				// this.params = JSON.stringify(params);
				// queryMessageApproveList(params, (res) => {
				// 	if (res.data && res.data.records) {
				// 		Toast.clear();
				// 		this.allNum = res.data.total.toLocaleString();
				// 		this.msgList = this.msgList.concat(res.data.records);
				// 		if (this.msgList.length >= this.allNum) this.finished = true;
				// 	} else {
				// 		Toast.fail("短信审批列表为空");
				// 		this.finished = true;
				// 	}
				// 	this.loading = false;
				// });
			},
		},
		mounted() {
			this.getHeight()

		},
	};
</script>

<style scoped lang="less">
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
	.tabBarStyle{
		padding-top: 0.2rem;
	}
	.list {
      width: 100%;
      padding: 0.1rem 0 0.15rem;
      background: #fff;
      &:deep(.month) {
        .van-tabs__nav--card {
          border: none;
        }
        .van-tab--card,
        .van-tab--active {
          margin: 0 0.1rem;
          border-radius: 0.15rem;
        }
        .van-tab--card {
          background: rgba(245, 245, 245, 1);
          border-right: none;
          color: #8c8c8c;
        }
        .van-tab--active {
          background: rgba(2, 109, 255, 0.12);
          color: #026dff;
        }
      }
    }
	.dateRow{
		display: flex;
		align-items: center;
		margin-left: 0.32rem;
		margin-bottom: 0.16rem;
	}
	.dateLineContent{
		display: flex;
		align-items: center;
		margin: 0 0.1rem;
	}
	.dateLine{
		width: 0.12rem;
		height: 0.01rem;
		background-color: #8C8C8C;
	}
	.dateGroup{
		display: flex;
		justify-content: space-around;
		margin-left: 0.08rem;
	}
	.dateInput{
		width: 1.26rem;
		height: 0.3rem;
		background: #F5F5F5;
		border-radius: 0.32rem;
		font-size: 0.13rem;
		color: #8C8C8C;
		line-height: 0.3rem;
	}
		.total {
		font-size: 0.1rem;
		color: #262626;
		height: 0.35rem;
		padding: 0 0.15rem;
		background-color: #F5F5F5;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}
	.vanList {
		// margin-top: 0.09rem;
		overflow: auto;
		background-color: #F5F5F5;

	}
	.msgCardOutBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
	}
	.msgCardBox {
		width: 100%;
		padding: 0.06rem 3%;
	}
	.msgCard {
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0 0 0.08rem -0.02rem #e0e0e0;
		border-radius: 0.1rem;
		font-size: 0.16rem;
		padding: 0.1rem 0.15rem;
	}
	.msgValue1 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.12rem;
	}

	.msgValue1Left {
		font-size: 0.16rem;
		font-weight: 500;
		flex-shrink: 1;
	}

	.msgValue1Right {
		display: flex;
		flex-shrink: 0;
	}

	.msgValue1RightItem {
		background-color: #2c3e50;
		color: #ffffff;
		font-size: 0.11rem;
		padding: 0.01rem 0.05rem;
		margin-left: 0.05rem;
		border-top-left-radius: 0.05rem;
		border-bottom-right-radius: 0.05rem;
	}

	.msgValue2,
	.msgValue3,
	.msgValue4 {
		width: 100%;
		font-size: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		margin-bottom: 0.08rem;
		justify-content: space-between;
	}
	.msgValue2Left,
	.msgValue3Left,
	.msgValue4Left {
		text-align: left;
		width: 60%;
		flex-shrink: 1;
	}

	.msgValue2Right,
	.msgValue3Right {
		text-align: left;
		// width: 40%;
		flex-shrink: 1;
		font-weight: 400;
	}
	.msgContent{
		font-weight: 400;
	}
	.msgValue3 {
		border-bottom: solid 0.01rem #f5f5f5;
		padding-bottom: 0.08rem;
	}

	.msgValue4 {
		margin: 0.1rem 0 0;
	}

	.msgValue4Right {
		text-align: left;
		width: 40%;
		flex-shrink: 1;
	}

	.msgTitleColor {
		font-size: 00.12rem;
		color: #999999;
	}
	.dateInputSelect {
		background: #E0EDFF;
		color: #026DFF;
	}
</style>
