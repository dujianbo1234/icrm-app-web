<template>
	<div class="home">
		<nav-bar title="短信审批列表" leftIcon />
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="vanList">
				<div v-for="(msgItem,i) in msgList" :key="'msgItem'+i" class="msgCardOutBox">
                    <div class="msgCardBox" @click="openDetail(msgItem)">
                        <div class="msgCard">
                            <div class="msgValue1">
                                <div class="msgValue1Left ycsl">{{msgItem.cstName}}</div>
                                <div class="msgValue1Right">
                                    <div class="msgValue1RightItem" style="background-color: #026DFF;">
                                        {{msgItem.busiTypeNm}}
                                    </div>
                                    <div class="msgValue1RightItem"
                                        :style="{'background-color':msgItem.curTage=='1'?'#FF8500':msgItem.curTage=='2'?'#FFBA00':msgItem.curTage=='3'?'#52C41A':'#026DFF'}">
                                        {{msgItem.curTageNm}}
                                    </div>
                                </div>
                            </div>
                            <div class="msgValue2">
                                <div class="msgValue2Left ycsl">
                                    <span class="msgTitleColor">短信条数：</span>
                                    <span>{{msgItem.messageNum}}</span>
                                </div>
                                <div class="msgValue3Right">{{msgItem.newMarkTime}}</div>
                            </div>
                            <div class="msgValue3">
										
										
									</div>
                            <div class="msgValue4">
                                <div class="msgValue4Left ycsl">
                                    <span class="msgTitleColor">机构名称：</span>
                                    <span>{{msgItem.orgName}}</span>
                                </div>
                                <div class="msgValue4Right ycsl">
                                    <span class="msgTitleColor">客户经理：</span>
                                    <span>{{msgItem.cstMagName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
		</van-list>
        <van-dialog v-model:show="show" title="标题" theme='round-button' show-cancel-button>
            
        </van-dialog>
	</div>
</template>

<script>
	import {
		Toast,
		Dialog
	} from "vant";
	import {
		queryMessageApproveList
	} from "../../request/market.js";
	export default {
		data() {
			return {
				finished:false,
				pageIndex: 0,

                msgList:[
                    {
                        cstName:'元宵赠礼祝福短信',
                        busiTypeNm:'节日祝福信息',
                        curTageNm:'待审批',
                        curTage:'1',
                        messageNum:'34',
                        orgName:'青原支行',
                        newMarkTime:'2022-04-26 20:21:15',
                        cstMagName:'*君*'
                    },
                    {
                        cstName:'零花钱拉新短信',
                        busiTypeNm:'贷款营销信息',
                        curTageNm:'审批拒绝',
                        curTage:'2',
                        messageNum:'36',
                        orgName:'九江XXXX支行',
                        newMarkTime:'2022-04-26 20:21:15',
                        cstMagName:'*君*'
                    },
                    {
                        cstName:'元宵赠礼祝福短信',
                        busiTypeNm:'节日祝福信息',
                        curTageNm:'已审批',
                        curTage:'3',
                        messageNum:'34',
                        orgName:'青原支行',
                        newMarkTime:'2022-04-26 20:21:15',
                        cstMagName:'*君*'
                    },
                    {
                        cstName:'元宵赠礼祝福短信',
                        busiTypeNm:'节日祝福信息',
                        curTageNm:'审批拒绝',
                        curTage:'2',
                        messageNum:'34',
                        orgName:'青原支行',
                        newMarkTime:'2022-04-26 20:21:15',
                        cstMagName:'*君*'
                    },

                ]
			}
		},
		components: {
		},
		methods: {
            openDetail(elment){
                // this.
            },
			onLoad() {
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				let params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					tplNo: "",
					exapSt: "",
					belongOrg: "",
					userId:""
				}
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
				})
				
			},
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
		overflow: hidden;
		background-color: #F5F5F5;
	}
    .vanList{
        margin-top: 0.20rem;
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
		background-color: #FFFFFF;
		box-shadow: 0 0 0.08rem -0.02rem #E0E0E0;
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
		font-size: 0.18rem;
		font-weight: 500;
		flex-shrink: 1;
	}

	.msgValue1Right {
		display: flex;
		flex-shrink: 0;
	}

	.msgValue1RightItem {
		background-color: #2C3E50;
		color: #FFFFFF;
		font-size: 0.1rem;
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
		width: 40%;
		flex-shrink: 1;
	}

	.msgValue3 {
		border-bottom: solid 0.01rem #F5F5F5;
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
		color: #999999;
	}
</style>
