<template>
	<div class="home">
		<nav-bar title="客户拜访记录" type="2" leftIcon />
		<div class="plate3">
			<div class="plateTitle" style="margin-bottom: 0.2rem;">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">跟进记录</div>
			</div>
			<div class="empty" v-if="!followMsg.length">-暂无跟进记录-</div>
			<van-steps direction="vertical" :active="0">
				<van-step v-for="(followItem,i) in followMsg" :key="'followItem'+i">
					<div class="followItem1">
						<div>{{followItem.communictionChannel=='01'?'登门拜访':followItem.communictionChannel=='02'?'电话跟进':followItem.communictionChannel=='03'?'行内到访':followItem.communictionChannel=='04'?'微信跟进':'短信跟进'}}</div>
						<div v-if="followItem.communictionChannel=='02' && $store.state.userMsg.empid==followItem.createPerson && followItem.serviceContent==''"  @click="saveTelInfo(followItem)">保存</div>
					</div>
					<div class="followItem2" :style="{'-webkit-line-clamp':followItem.showDesc?'100':'15'}"
						@click="followItem.showDesc=!followItem.showDesc">{{followItem.serviceContent}}</div>
					<div class="followItem5" v-if="followItem.communictionChannel=='01'&&followItem.fileList.length">
						<div class="followItem5_1"
							v-for="(file,j) in followItem.fileList.length>4&&!followItem.showAllPhoto?followItem.fileList.slice(0,3):followItem.fileList"
							:key="'file'+j" @click="openPhoto(this.$store.state.baseUrl + file.fileServerPath)">
							<img :src="this.$store.state.baseUrl + file.fileServerPath">
						</div>
						<div class="followItem5_2" v-if="followItem.fileList.length>4&&!followItem.showAllPhoto"
							@click="followItem.showAllPhoto=true">
							<van-icon :name="require('../../assets/image/common_more.png')" color="##8C8C8C"
								size="21" />
						</div>
					</div>
					<div class="followItem6" v-if="followItem.communictionChannel=='01'&&followItem.visitAddress">
						<div class="followItem6_1">
							<van-icon :name="require('../../assets/image/common_dingwei_blue.png')" size="12"
								style="margin-right: 0.04rem;flex-shrink: 0;padding: 0.03rem 0;" />
							<span>{{followItem.visitAddress.split("------")[1]?followItem.visitAddress.split("------")[1]:followItem.visitAddress.split("------")[0]}}</span>
						</div>
						<div class="followItem6_2">{{followItem.visitAddress.split("------")[1]?followItem.visitAddress.split("------")[0]:""}}</div>
					</div>
					<div class="inputBox" v-if="followItem.communictionChannel=='02' && $store.state.userMsg.empid==followItem.createPerson && followItem.serviceContent==''">
						<van-field class="telInput" v-model="followItem.serviceValue" input-align="left" border maxlength="200" autosize rows="4"
									type="textarea">
						</van-field>
					</div>
					<div class="followPeople">跟进人:{{followItem.createPersonName}}({{followItem.createPerson}})</div>
					<div class="followPeople">机构:{{followItem.custOrgName}}</div>

					<div class="followItem3" v-if="i!=followMsg.length-1"></div>
					<div class="followItem4">
						<div class="followItem4_1">
							{{followItem.createDt.slice(5,10).split("-").join("/")}}
						</div>
						<div class="followItem4_2">{{followItem.createDt.slice(-10,-5)}}</div>
					</div>
					<template #active-icon>
						<div class="active-icon-out">
							<div class="active-icon-in"></div>
						</div>
					</template>
					<template #inactive-icon>
						<div class="inactive-icon"></div>
					</template>
				</van-step>
			</van-steps>
		</div>
		
	</div>
</template>

<script>
	import {
		formatNum
	} from "../../api/common.js";
	import {
		queryCustomeServicFollow,
		custServiceUpdate
	} from "../../request/market.js";
	import {
		Toast,
		ImagePreview
	} from "vant";
	export default {
		data() {
			return {
				followMsg: [],
				serviceContent:'',//电话内容
			}
		},
		components: {
		},
		methods: {
			getFollowMsg() {
				queryCustomeServicFollow({
					custNo: this.$route.query.custNo
				}, (res) => {
					this.followMsg = res.data;
					this.followMsg.forEach((item) => {
						item.serviceValue=''
						item.showDesc = false;
						item.showAllPhoto = false;
					});
				})
			},
			openPhoto(file) {
				ImagePreview({
					images: [file],
					showIndex: false
				});
			},
			saveTelInfo(value){
				custServiceUpdate({
					serviceId:value.serviceId,
					serviceContent: value.serviceValue
				}, (res) => {
					this.getFollowMsg()
				})
			}
		},
		mounted() {
			this.getFollowMsg();
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
    .plate3 {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
		margin-top: 0.1rem;
		padding-bottom: 0.3rem;
	}
	.plateTitle {
		width: 100%;
		height: 0.44rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
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
	.followItem1 {
		display: flex;
		justify-content: space-between;
		width: calc(100% - 0.12rem);
		height: 0.21rem;
		line-height: 0.21rem;
		margin-bottom: 0.04rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 500;
	}

	.followItem2 {
		width: calc(100% - 0.12rem);
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.followItem3 {
		width: calc(100% - 0.12rem);
		height: 0.01rem;
		background: #EFEFEF;
		margin-top: 0.15rem;
	}

	:deep(.van-step--vertical:not(:last-child):after) {
		border-bottom-width: 0;
	}

	:deep(.van-step) {
		padding: 0 0 0.15rem 0.05rem;
		text-align: left;
	}

	:deep(.van-steps__items) {
		margin-left: 25%;
	}

	:deep(.van-step__circle-container) {
		position: absolute;
		top: 0.1rem;
		left: -0.14rem;
		z-index: 1;
		font-size: var(--van-step-icon-size);
		line-height: 1;
		transform: translate(-50%, -50%);
	}

	:deep(.van-step__line) {
		top: 0.1rem;
		left: -0.15rem;
		width: 0.02rem;
		height: 100%;
		background-color: #BFBFBF;
	}
    .followPeople{
        margin-top: 0.12rem;
        font-size: 0.12rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8C8C8C;
    }
	.followItem4 {
		text-align: right;
		position: absolute;
		top: 0;
		left: calc(-15% - var(--van-padding-xl));
	}

	.followItem4_1 {
		height: 0.2rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		text-align: right;
		line-height: 0.2rem;
		font-weight: 500;
	}

	.followItem4_2 {
		height: 0.16rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		text-align: right;
		line-height: 0.16rem;
		font-weight: 400;
	}
    .followItem5 {
		width: calc(100% - 0.2rem);
		margin-top: 0.12rem;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: -0.12rem;
	}

	.followItem5_1 {
		width: 0.5rem;
		height: 0.5rem;
		margin-right: calc(calc(100% - 2rem) / 3);
		margin-bottom: 0.12rem;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.followItem5_1:nth-child(4n) {
		margin-right: 0;
	}

	.followItem5_1>img {
		width: 100%;
	}

	.followItem5_2 {
		width: 0.5rem;
		height: 0.5rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}
    .followItem6 {
		width: calc(100% - 0.12rem);
		margin-top: 0.12rem;
	}
	
	.followItem6_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 400;
		display: flex;
		flex-wrap: nowrap;
	}
	
	.followItem6_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}
	
	.inactive-icon {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #BFBFBF;
	}

	.active-icon-out {
		width: 0.16rem;
		height: 0.16rem;
		padding: 0.04rem;
		border-radius: 0.08rem;
		background-color: rgba(2, 109, 255, 0.12);
	}

	.active-icon-in {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #026DFF;
	}
    	.empty {
		width: 100%;
		height: 0.38rem;
		line-height: 0.5rem;
		font-size: 0.12rem;
		color: #E0E0E0;
		font-family: PingFangSC-Regular;
		letter-spacing: 0;
		font-weight: 400;
	}
	.telInput{
		margin-top: 0.1rem;
	}
	.inputBox :deep(.van-cell){
		width: 90%;
	}
	.telInput :deep(.van-cell__value){
		border:1px solid #EBEBEB;
		border-radius: 0.05rem;
		padding: 0.02rem;
	}
</style>
