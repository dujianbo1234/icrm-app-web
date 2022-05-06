<template>
	<div class="home">
		<nav-bar title="选择客户" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="plate1_1">{{baseMsg.value0}}</div>
				<div class="plate1_2">
					<div class="plate1_2_1">
						<van-rate v-model="baseMsg.value1" :size="18" color="#FFBA00" void-icon="star" readonly
							void-color="#E0E0E0" allow-half />
						<div class="plate1_2_1_value">{{baseMsg.value1}}</div>
					</div>
					<div class="plate1_2_2">到期日期：{{baseMsg.value6}}</div>
				</div>
				<div class="plate1_3">{{baseMsg.value2}}/{{baseMsg.value3}}/{{baseMsg.value4}}</div>
				<div class="plate1_4">商机描述：{{baseMsg.value10}}</div>
			</div>
			<div class="plate2">
				<van-icon v-if="openDesc" name="arrow-up" size="20" color="#8C8C8C" />
				<van-icon v-else name="arrow-down" size="20" color="#8C8C8C" />
			</div>
			<div class="plate3" v-if="openSearch">
				<van-search v-model="searchValue" shape="round" show-action placeholder="请输入关键词进行搜索" @search="onSearch"
					:left-icon="require('../../assets/image/common_search.png')">
					<template #action>
						<div @click="onCancel" style="color: #8C8C8C;margin-left: 0.05rem;">取消</div>
					</template>
				</van-search>
			</div>
			<div class="plate4">
				<div class="plate4_1">
					<div class="plate4_1_value ycsl">{{chooseOrg.text}}</div>
					<van-icon v-if="openOrgList" name="arrow-up" size="14" color="#8C8C8C" />
					<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
				</div>
				<div class="plate4_1">
					<div class="plate4_1_value ycsl">{{chooseCust.custName}}</div>
					<van-icon v-if="openCustList" name="arrow-up" size="14" color="#8C8C8C" />
					<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
				</div>
				<div class="plate4_2" v-if="!openSearch" @click="openSearch=true">
					<div class="plate4_2_1"></div>
					<van-icon :name="require('../../assets/image/common_search_black.png')" size="16" color="#262626"
						style="margin: 0 0.08rem;" />
					<div class="plate4_2_2">搜索</div>
				</div>
			</div>
			<div class="plate5">
				<div class="plate5_father" :style="{width: levelList.length*0.84+0.16+'rem'}">
					<div :class="i==levelIndex?'plate5_child_a':'plate5_child'" v-for="(levelItem,i) in levelList"
						:key="'levelItem'+i" @click="changeLevel(i)">
						{{levelItem.codeName}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				baseMsg: {},
				openDesc: false,
				openSearch: false,
				openOrgList: false,
				chooseOrg: {
					text: "全部机构",
					value: ""
				},
				openCustList: false,
				chooseCust: {
					custName: "客户经理",
					custId: ""
				},
				searchValue: "",
				levelIndex: 0,
				levelList: [],
			}
		},
		methods: {
			onSearch() {

			},
			onCancel() {
				this.openSearch = false;
				this.searchValue = "";
			},
		},
		mounted() {
			this.baseMsg = this.$route.params;
			this.levelList = [
				{codeName: "私行客户",codeValue: ""},
				{codeName: "钻石卡客户",codeValue: ""},
				{codeName: "白金卡客户",codeValue: ""},
				{codeName: "金卡客户",codeValue: ""},
				{codeName: "理财客户",codeValue: ""},
				{codeName: "大众客户",codeValue: ""},
				{codeName: "未达标客户",codeValue: ""},
			];
			this.levelList.unshift({codeName: "全部",codeValue: ""})
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

	.fixedPlace {
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		z-index: 9;
	}
	
	:deep(.van-search__field) {
		align-items: center;
	}

	.plate1 {
		width: 100%;
		background-color: #FFFFFF;
		padding: 0.12rem 0.12rem 0.04rem;
	}

	.plate1_1 {
		width: 100%;
		text-align: left;
		height: 0.24rem;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
		margin-bottom: 0.02rem;
	}

	.plate1_2 {
		width: 100%;
		height: 0.21rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.01rem;
	}

	.plate1_2_1 {
		display: flex;
		flex-wrap: nowrap;
	}

	.plate1_2_1_value {
		width: 0.21rem;
		height: 0.21rem;
		margin-left: 0.08rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 500;
	}

	.plate1_2_2 {
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.plate1_3 {
		width: 100%;
		text-align: left;
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.11rem;
	}

	.plate1_4 {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.plate2 {
		width: 100%;
		height: 0.23rem;
		border-top: solid 1px #EFEFEF;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.1rem;
	}

	.plate3 {
		height: 0.44rem;
		padding: 0.06rem 0.12rem;
		background-color: #FFFFFF;
	}

	.plate4 {
		width: 100%;
		height: 0.44rem;
		background: #FFFFFF;
		padding: 0 0.12rem;
		border-top: solid 1px rgba(0, 0, 0, 0.04);
		border-bottom: solid 1px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.plate4_1 {
		height: 0.22rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.22rem;
		font-weight: 400;
		max-width: 40%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-right: 0.24rem;
	}

	.plate4_1_value {
		margin-right: 0.04rem;
	}

	.plate4_2 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		position: absolute;
		right: 0.12rem;
	}

	.plate4_2_1 {
		width: 0.01rem;
		height: 0.16rem;
		box-shadow: inset -0.005rem 0 0 0 rgba(0, 0, 0, 0.08);
	}

	.plate4_2_2 {
		width: 0.28rem;
		height: 0.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.85);
		letter-spacing: 0;
		font-weight: 400;
	}

	.plate5 {
		overflow: auto;
		width: 100%;
		height: 0.44rem;
		background: #FFFFFF;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate5_father {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding: 0.06rem 0.12rem;
		align-items: center;
	}

	.plate5_child,
	.plate5_child_a {
		flex-shrink: 0;
		text-align: center;
		margin-right: 0.08rem;
		width: 0.76rem;
		height: 0.32rem;
		line-height: 0.32rem;
		border-radius: 0.04rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		letter-spacing: 0;
	}

	.plate5_child {
		background: #F5F5F5;
		color: #595959;
		font-weight: 400;
	}

	.plate5_child_a {
		background: rgba(2, 109, 255, 0.12);
		color: #026DFF;
		font-weight: 500;
	}

	.plate5::-webkit-scrollbar {
		display: none;
	}
</style>
