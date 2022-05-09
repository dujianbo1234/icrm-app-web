<template>
	<div class="home">
		<nav-bar title="选择客户" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="plate1_1">{{baseMsg.cmrcOpptSubclassNm}}</div>
				<div class="plate1_2">
					<div class="plate1_2_1">
						<van-rate v-model="baseMsg.practialScore" :size="16" color="#FFBA00" void-icon="star" readonly void-color="#E0E0E0" allow-half gutter="2" />
						<div class="plate1_2_1_value">{{baseMsg.practialScore}}</div>
					</div>
					<div class="plate1_2_2">到期日期：{{baseMsg.cmrcOpptExpDay}}</div>
				</div>
				<div class="plate1_3">{{baseMsg.keyWords}}</div>
				<div class="plate1_4" :class="openDesc?'':'plate1_4_close'">商机描述：{{baseMsg.cmrcOpptDsc}}</div>
			</div>
			<div class="plate2" @click="openDesc=!openDesc;resetTop();">
				<van-icon v-if="openDesc" name="arrow-up" size="20" color="#8C8C8C" />
				<van-icon v-else name="arrow-down" size="20" color="#8C8C8C" />
			</div>
			<div class="plate3" v-if="openSearch">
				<van-search v-model="searchValue" shape="round" show-action placeholder="请输入关键词进行搜索" @search="onSearch" :left-icon="require('../../assets/image/common_search.png')">
					<template #action>
						<div @click="onCancel" style="color: #8C8C8C;margin-left: 0.05rem;">取消</div>
					</template>
				</van-search>
			</div>
			<div class="plate4" v-if="!($store.state.userMsg.roleId=='00000004'&&openSearch)">
				<div class="plate4_1" v-if="$store.state.userMsg.roleId!='00000004'" @click="$refs.orgList.showPopup();openOrgList=true;">
					<div class="plate4_1_value ycsl">{{chooseOrg.text}}</div>
					<van-icon v-if="openOrgList" name="arrow-up" size="14" color="#8C8C8C" />
					<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
				</div>
				<div class="plate4_1" v-if="$store.state.userMsg.roleId!='00000004'" @click="$refs.custList.showPopup();openCustList=true;">
					<div class="plate4_1_value ycsl">{{chooseCust.custName}}</div>
					<van-icon v-if="openCustList" name="arrow-up" size="14" color="#8C8C8C" />
					<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
				</div>
				<div class="plate4_2" v-if="!openSearch" @click="openSearch=true;resetTop();">
					<div class="plate4_2_1"></div>
					<van-icon :name="require('../../assets/image/common_search_black.png')" size="16" color="#262626" style="margin: 0 0.08rem;" />
					<div class="plate4_2_2">搜索</div>
				</div>
			</div>
			<div class="plate5">
				<div class="plate5_father" :style="{width: levelList.length*0.84+0.16+'rem'}">
					<div :class="i==levelIndex?'plate5_child_a':'plate5_child'" v-for="(levelItem,i) in levelList" :key="'levelItem'+i" @click="changeLevel(i)">
						{{levelItem.codeName}}
					</div>
				</div>
			</div>
		</div>
		<div :style="{height: fixedHeight}"></div>
		<div class="custItem" v-for="(item,i) in custList" :key="'item'+i" @click="openDetail(item)">
			<div class="custItem1">
				<div class="custItem1_1"></div>
				<div class="custItem1_2">
					<div class="custItem1_2_1">{{item.value01}}</div>
					<div class="custItem1_2_2" v-if="item.value02=='1'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}"></div>
					<div class="custItem1_2_2" v-if="item.value02=='2'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}"></div>
					<div class="custItem1_2_2" v-if="item.value02=='3'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}"></div>
					<div class="custItem1_2_2" v-if="item.value02=='4'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}"></div>
					<div class="custItem1_2_2" v-if="item.value02=='5'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}"></div>
					<div class="custItem1_2_2" v-if="item.value02=='6'" :style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}"></div>
					<div class="custItem1_2_3">
						<div class="custItem1_2_3_item" v-if="item.value03=='1'" style="background-color: rgba(2,109,255,0.08);color: #026DFF;">财</div>
						<div class="custItem1_2_3_item" v-if="item.value04=='1'" style="background-color: rgba(255,133,0,0.08);color: #FF8500;">代</div>
						<div class="custItem1_2_3_item" v-if="item.value05=='1'" style="background-color: rgba(255,58,58,0.08);color: #FF3A3A;">新</div>
						<div class="custItem1_2_3_item" v-if="item.value06=='1'" style="background-color: rgba(68,107,161,0.08);color: #446BA1;">商</div>
						<div class="custItem1_2_3_item" v-if="item.value07=='1'" style="background-color: rgba(55,205,55,0.08);color: #13AD13;">贷</div>
						<van-icon v-if="item.value08=='1'" :name="require('../../assets/image/business_chooseCust_zfb_a.png')" size="16" style="margin-right: 0.04rem;" />
						<van-icon v-else :name="require('../../assets/image/business_chooseCust_zfb.png')" size="16" style="margin-right: 0.04rem;" />
						<van-icon v-if="item.value09=='1'" :name="require('../../assets/image/business_chooseCust_wx_a.png')" size="16" style="margin-right: 0.04rem;" />
						<van-icon v-else :name="require('../../assets/image/business_chooseCust_wx.png')" size="16" style="margin-right: 0.04rem;" />
						<van-icon v-if="item.value10=='1'" :name="require('../../assets/image/business_chooseCust_ysf_a.png')" size="16" style="margin-right: 0.04rem;" />
						<van-icon v-else :name="require('../../assets/image/business_chooseCust_ysf.png')" size="16" style="margin-right: 0.04rem;" />
					</div>
				</div>
				<div class="custItem1_3" v-if="item.value11=='0'" style="background-color: #026DFF;">待跟进</div>
				<div class="custItem1_3" v-else style="background-color: #FFBA00;">已跟进</div>
			</div>
			<div class="custItem2">
				<div class="custItem2_child">
					<span class="custItem2_childName">极差值：</span>
					<span class="custItem2_childValue">{{item.value12}}万元</span>
				</div>
				<div class="custItem2_child">
					<span class="custItem2_childName">历史最高资产：</span>
					<span class="custItem2_childValue">{{item.value13}}万元</span>
				</div>
				<div class="custItem2_child">
					<span class="custItem2_childName">AUM资产：</span>
					<span class="custItem2_childValue">{{item.value14}}万元</span>
				</div>
				<div class="custItem2_child">
					<span class="custItem2_childName">定期：</span>
					<span class="custItem2_childValue">{{item.value15}}万元</span>
				</div>
				<div class="custItem2_child">
					<span class="custItem2_childName">活期：</span>
					<span class="custItem2_childValue">{{item.value16}}万元</span>
				</div>
				<div class="custItem2_child">
					<span class="custItem2_childName">贷款：</span>
					<span class="custItem2_childValue">{{item.value17}}万元</span>
				</div>
			</div>
			<div class="custItem3"></div>
			<div class="custItem4">
				<div class="custItem4_1" :class="item.value19?'':'ycsl'">
					<span style="color: #026DFF;font-weight: 500;">#推荐理由#</span>
					<span>{{item.value18}}</span>
				</div>
				<div class="custItem4_2" @click.stop="item.value19=!item.value19">
					<van-icon v-if="item.value19" name="arrow-up" color="#8C8C8C" size="16"/>
					<van-icon v-else name="arrow-down" color="#8C8C8C" size="16"/>
				</div>
			</div>
		</div>
		<div class="bottomZW"></div>
		<org-list ref="orgList" type="2" @close="openOrgList=false" @activeOrg="activeOrg"/>
		<customer-list ref="custList" @close="openCustList=false" @activeCust="activeCust"/>
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
				custList: [{
					value01: "曹妍佳",
					value02: "3",
					value03: "1",
					value04: "1",
					value05: "1",
					value06: "1",
					value07: "1",
					value08: "1",
					value09: "1",
					value10: "1",
					value11: "0",
					value12: "1.28",
					value13: "13.43",
					value14: "12.21",
					value15: "6.29",
					value16: "0.23",
					value17: "0.00",
					value18: "推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由",
					value19: false,
					value20: "代发客户资产提升",
					value21: "17382938829",
					value22: "尚妍华",
					value23: "043021",
					value24: "八里湖支行",
					value26: ""
				},{
					value01: "郑婷",
					value02: "6",
					value03: "1",
					value04: "1",
					value05: "1",
					value06: "1",
					value07: "1",
					value08: "1",
					value09: "1",
					value10: "1",
					value11: "1",
					value12: "1.28",
					value13: "13.43",
					value14: "12.21",
					value15: "6.29",
					value16: "0.23",
					value17: "0.00",
					value18: "推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由",
					value19: false,
					value20: "代发客户资产提升",
					value21: "17382938829",
					value22: "尚妍华",
					value23: "043021",
					value24: "八里湖支行"
				},{
					value01: "陈二哈",
					value02: "4",
					value03: "1",
					value04: "1",
					value05: "1",
					value06: "1",
					value07: "1",
					value08: "1",
					value09: "1",
					value10: "1",
					value11: "1",
					value12: "1.28",
					value13: "13.43",
					value14: "12.21",
					value15: "6.29",
					value16: "0.23",
					value17: "0.00",
					value18: "推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由",
					value19: false,
					value20: "代发客户资产提升",
					value21: "17382938829",
					value22: "尚妍华",
					value23: "043021",
					value24: "八里湖支行",
					value26: ""
				}],
				fixedHeight: "2.5rem",
			}
		},
		methods: {
			resetTop() {
				this.$nextTick(()=>{
					var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName("fixedPlace")[0], null);
					this.fixedHeight = fixedPlace.height;
				})
			},
			onSearch() {

			},
			onCancel() {
				this.openSearch = false;
				this.searchValue = "";
				this.resetTop();
			},
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.chooseCust = orgValue
				} else {
					this.chooseOrg = {
						text: "选择机构",
						value: ""
					}
				};
				this.openOrgList = false;
				// this.pageIndex = 0;
				// this.custList = [];
			},
			activeCust(custValue) {
				alert(JSON.stringify(custValue))
				if (custValue.custId) {
					this.chooseOrg = custValue
				} else {
					chooseCust = {
						custName: "客户经理",
						custId: ""
					}
				};
				this.openCustList = false;
				// this.pageIndex = 0;
				// this.custList = [];
			},
			openDetail(item) {
				item.value25 = this.baseMsg.value10;
				this.$router.push({
					name: 'busiDetail',
					params: {item: JSON.stringify(item)}
				})
			},
		},
		mounted() {
			try{
				this.baseMsg = JSON.parse(this.$route.params.item);
			}catch(e){
				this.baseMsg = JSON.parse(localStorage.getItem("lastPageParams"));
			}
			this.levelList = [
				{codeName: "私行客户",codeValue: ""},
				{codeName: "钻石卡客户",codeValue: ""},
				{codeName: "白金卡客户",codeValue: ""},
				{codeName: "金卡客户",codeValue: ""},
				{codeName: "理财客户",codeValue: ""},
				{codeName: "大众客户",codeValue: ""},
				{codeName: "未达标客户",codeValue: ""},
			];
			this.levelList.unshift({
				codeName: "全部",
				codeValue: ""
			})
			this.resetTop();
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
	
	.plate1_4_close {
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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

	.custItem {
		width: 93.6%;
		margin: 0.12rem auto;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
	}

	.custItem1 {
		width: 100%;
		height: 0.44rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem1_1 {
		width: 0.4rem;
		height: 0.4rem;
		background: url(../../assets/image/mine_main_userIcon.png) no-repeat center;
		background-size: contain;
		border-radius: 0.2rem;
		overflow: hidden;
		margin-right: 0.12rem;
	}

	.custItem1_2 {
		display: flex;
		flex-wrap: wrap;
	}

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
	}

	.custItem1_2_3_item {
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

	.custItem1_3 {
		position: absolute;
		top: 0.16rem;
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
	
	.custItem2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.12rem;
		margin-bottom: 0.04rem;
	}
	
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
		margin-bottom: 0.04rem;
	}
	
	.custItem2_childName {
		color: #8C8C8C;
	}
	
	.custItem2_childValue {
		color: #262626;
	}
	
	.custItem3 {
		width: 100%;
		margin: 0 auto 0.12rem;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0,0,0,0.04);
	}
	
	.custItem4 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}
	
	.custItem4_1 {
		width: 90%;
		font-family: PingFangSC-Regular;
		text-align: left;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}
	
	.custItem4_2 {
		width: 10%;
		height: 0.16rem;
		display: flex;
		justify-content: flex-end;
	}
	
</style>
