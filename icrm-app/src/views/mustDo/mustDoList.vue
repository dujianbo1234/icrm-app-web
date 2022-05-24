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
                <div @click="startDateShow" class="dateInput">{{beginDate}}<van-icon name="calendar-o" size="0.14rem" color="#026DFF" style="margin-left:0.08rem"/></div>
                <div class="dateLineContent"><div class="dateLine"></div></div>
                <div @click="endDateShow" class="dateInput">{{endDate}}<van-icon name="calendar-o" size="0.14rem" color="#026DFF" style="margin-left:0.08rem" /></div>
            </div>
        </div>
		<!-- <van-calendar v-model:show="dateShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/> -->
		<van-calendar v-model:show="dateShow" @confirm="onConfirm" />
		<!-- <van-calendar v-model:show="endDateShow" @confirm="onEndConfirm" /> -->
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
				beginDate:'开始时间',
				endDate:'结束时间',
                tageListActive: 0,
				dateShow:false,
				isStartDate:false,
				isEndDate:false,
				minDate:'',
				maxDate:'',
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
				msgList: [],
			};
		},
		components: {},
		methods: {
			startDateShow(){
				this.dateShow=true
				this.isStartDate=true
				this.isEndDate=false
				if(this.endDate){
					this.maxDate=new Date(this.endDate)
				}
			},
			endDateShow(){
				this.dateShow=true
				this.isStartDate=false
				this.isEndDate=true
				if(this.startDate){
					this.minDate=new Date(this.startDate)
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
					tplNo: "",
					exapSt: "1",
					belongOrg: "",
					userId: "",
				};
				this.params = JSON.stringify(params);
				queryMessageApproveList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.allNum = res.data.total.toLocaleString();
						this.msgList = this.msgList.concat(res.data.records);
						if (this.msgList.length >= this.allNum) this.finished = true;
					} else {
						Toast.fail("短信审批列表为空");
						this.finished = true;
					}
					this.loading = false;
				});
			},
		},
		mounted() {},
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
</style>
