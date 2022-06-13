<template>
	<!-- 客户视图 -->
	<div class="clCustomerView">
		<!-- 顶部title -->
		<nav-bar title="客户视图" @touchRight="onClickRight" type="2" leftIcon rightText="客户拜访"
			rightColor="rgba(2, 109, 255, 1)" />
		<!-- 客户信息 -->
		<div class="card custInfo">
			<div class="custInfoName">
				<div class="custInfoLeft"></div>
				<div class="custInfoRight">
					<div class="custName">
						<div class="custItem1_2_1">{{custBase.cstName}}</div>
						<div class="custItem1_2_2"
							:style="`background-image:url(${require(`@/assets/image/business_chooseCust_type${custBase.svcLvlCount || 0}.png`)})`">
						</div>
					</div>
					<div class="custItem1_2_3">
						<template
							v-for="(text, j) in ['vipCstFlg','agentPayCstFlg', 'newCstFlg', 'merntCstFlg', 'ioinHoldLoan', 'crdtCrdCstFlg']">
							<div :class="`iconText ${text}`" v-if="custBase[text] == 1" :key="j">
								{{['财','代','新','商','贷','信'][j]}}</div>
						</template>
						<template v-for="(text, s) in ['ioinSgnMobbank','ioinSgnAlpy','ioinSgnWchtPymt', 'ioinSgnYsf']"
							:key="s">
							<van-icon
								:name="require(`@/assets/image/business_chooseCust_${['jjyh','zfb','wx','ysf'][s]}${['.png','_a.png'][custBase[text] || 0]}`)"
								size="16" style="margin-right: 0.04rem;" />
						</template>
					</div>
				</div>
			</div>
			<!-- 客户编号 -->
			<div class="custInfoNo">
				<div>
					<div>客户编号</div>
					<div>{{custBase.custNum || '-'}}</div>
				</div>
				<div>
					<div>证件号码</div>
					<div>{{custBase.certNum || '-'}}</div>
				</div>
			</div>
			<!-- 联系方式 -->
			<div class="custInfoPhone">
				<div class="textContent">
					<span class="title">联系电话</span>
					<span class="phoneStyle">{{custBase.ctcTel || '-'}}</span>
					<van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12"
						@click="editPhone" />
				</div>
				<div class="textContent" style="padding-top: 0.07rem;">
					<span class="title">详细地址</span>
					<span class="textStyle">{{custBase.famAddr || '-'}}</span>
					<van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12"
						@click="editAddress" />
				</div>
			</div>
			<!-- 客户经理信息 -->
			<div class="custManager">
				<div>
					<span>客户经理：</span>
					<span>{{custBase.belgCustMgrNm ? `${custBase.belgCustMgrNm}(${custBase.belgCustMgr})` : '-'}}</span>
				</div>
				<div>
					<span>所属机构：</span>
					<span>{{custBase.belongOrgNm || '-'}}</span>
				</div>
			</div>
		</div>
		<!-- 客户画像 -->
		<div class="card custPortrait">
			<div class="custPortrait_title">
				<div class="custPortrait_title_l">
					<van-icon class="icon" :name="require(`@/assets/image/cust_edit_user.png`)" size="0.2rem" />
					<span>客户画像</span>
				</div>
				<div class="custPortrait_title_r">
					<span class="btnAdd" @click="addTag">
						<van-icon name="plus" size="0.1rem" color="#8C8C8C" />
						<span>自定义标签</span>
					</span>
					<span class="btnText" @click="portraitbtn = !portraitbtn" v-if="tagList && tagList.length > 1">
						<span>{{portraitbtn ? '展开' : '收起'}}</span>
						<van-icon :name="portraitbtn ? 'arrow-down' : 'arrow-up'" size="0.12rem" color="#8C8C8C" />
					</span>
				</div>
			</div>
			<div class="custPortrait_main">
				<template v-for="(item, index) in tagList" :key="item.label">
					<div v-if="portraitbtn ? index == 0 : item">
						<!-- 类型名 -->
						<div class="main_label">
							<span>{{item.label}}：</span>
							<van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="0.12rem"
								style="padding-top: 0.02rem;" v-if="item.label === '自定义标签'"
								@click="editTag = !editTag" />
						</div>
						<!-- 标签 -->
						<template v-for="tag in item.tag" :key="tag">
							<!-- 自定义标签 -->
							<span class="portraitIcon" v-if="item.label === '自定义标签'">
								<div :class="editTag ? 'labelD' : 'label'" @click.stop="editTagFun(tag)">
									{{tag.labNm}}
									<div class="iconX" v-if="editTag" @click.stop="delTagFun(tag)">
										<van-icon name="cross" class="badge-icon" size="0.07rem" color="#026DFF" />
									</div>
								</div>
							</span>
							<!-- 普通标签 -->
							<div class="label" v-else>{{tag}}</div>
						</template>
					</div>
				</template>
			</div>
		</div>

		<div class="tabsList">
			<van-tabs class="tabs" v-model:active="active" @change="queryCustInfos">
				<van-tab title="资产总览">
					<!-- 资产总览(元) -->
					<div class="card">
						<TitleCard :cardData="cardData" :dalongShow="['等内容..']"></TitleCard>
					</div>
					<!-- 分割线 -->
					<div class="dividers"></div>
					<!-- 资产分布图 -->
					<div class="card">
						<div class="custStyle aumStyle">
							<span class="title">资产分布图</span>
							<span class="iconBox" @click="assetCheck">
								<van-icon :name="require('@/assets/image/list_1.png')" size="0.32rem"
									v-if="assetFlag" />
								<van-icon :name="require('@/assets/image/list_2.png')" size="0.32rem" v-else />
							</span>
						</div>
						<!-- 列表 -->
						<div style="margin-top: 0.07rem;" v-if="assetFlag">
							<Table :unit="1" :listLabel="listLabel" :listData="listData" :listType="listType"
								:lableArr="['a','b','c','d']"></Table>
						</div>
						<echarts-pie ref="aumDisDiaChart" :unit="'元'" :data="pieData" v-else />
					</div>
					<!-- 分割线 -->
					<div class="dividers"></div>
					<!-- 资产分布-增长趋势 -->
					<div class="card">
						<div class="custStyle aumStyle">
							<span class="title">增长趋势</span>
							<selectors :title="['日', '月']" :typeP="1" @change="changeAum"></selectors>
						</div>
						<echartHistogram ref="Histogram2" :type="2" :dataArr="['全部','活期存款','定期存款','理财','基金','保险','信托']"
							:numType="'no'" :selectTime="selectTime" :barData="aumData" @change="aumChange"
							@change2="aumChange2" :timeUnit="timeUnit"></echartHistogram>
					</div>
					<!-- 负债总览(元) -->
					<div class="card" style="margin-top: 0.12rem;">
						<TitleCard title="负债总览" imgUrl="1" :cardData="liabilities" :dalongShow="['等内容..']"></TitleCard>
					</div>
					<!-- 分割线 -->
					<div class="dividers"></div>
					<div class="card">
						<div class="custStyle aumStyle">
							<span class="title">负债分布图</span>
							<span class="iconBox" @click="liaCheck">
								<van-icon :name="require('@/assets/image/list_1.png')" size="0.32rem" v-if="liaFlag" />
								<van-icon :name="require('@/assets/image/list_2.png')" size="0.32rem" v-else />
							</span>
						</div>
						<!-- 列表 -->
						<div style="margin-top: 0.07rem;" v-if="liaFlag">
							<Table :unit="1" :color="false" :listLabel="liaLabel" :listData="liaData"
								:listType="listType" :lableArr="['a','b']"></Table>
						</div>
						<echarts-pie ref="liaChart" unit="元" :data="pieliab" v-else />
					</div>
				</van-tab>

				<van-tab title="产品信息">
					<div class="card">
						<div class="titleTop">
							<div class="titleL">
								<van-icon :name="require('@/assets/image/cust_cycp.png')" size="0.2rem" />
								<h3>持有产品</h3>
							</div>
						</div>
						<TabsList :setList="prdList" style="margin-top: 0.1rem" />
					</div>

					<div class="card" style="margin-top: 0.12rem;">
						<div class="titleTop">
							<div class="titleL">
								<van-icon :name="require('@/assets/image/cust_qycp.png')" size="0.2rem" />
								<h3>签约产品</h3>
							</div>
						</div>
						<TabsList :setList="sgnList" style="margin-top: 0.1rem" />
					</div>

					<div class="card" style="margin-top: 0.12rem;">
						<div class="titleTop">
							<div class="titleL">
								<van-icon :name="require('@/assets/image/cust_tjcp.png')" size="0.2rem" />
								<h3>推荐产品</h3>
							</div>
						</div>
						<template v-for="(item ,index) in prodList">
							<div v-if="index < 5" :key="index">
								<div class="recommend" style="margin-top: 0.12rem;" v-if="index == 0">
									<div class="textL">{{item.pdNm}}</div>
									<div class="textR" @click="fenxiang">分享</div>
								</div>
								<div class="recommend" v-else>
									<div class="textL">{{item.pdNm}}</div>
									<div class="textR" @click="fenxiang">分享</div>
								</div>
							</div>
						</template>
					</div>
				</van-tab>
				<van-tab title="交易分析">
					<div class="analysis">
						<!-- 流入总金额 -->
						<div class="card">
							<div class="titleTop">
								<div class="titleL">
									<van-icon :name="require('@/assets/image/AUM_img.png')" size="0.2rem" />
									<h3>流入总金额(万元)</h3>
								</div>
							</div>
							<div class="titleNum">{{numFliter(inData.txnAmtCount || 0, false)}}</div>
							<div class="titleBot">
								<div>
									<p class="textF">累计笔数</p>
									<p class="textS">{{numFliter(inData.txnStcoCount || 0, true)}}</p>
								</div>
								<div>
									<p class="textF">统计日期</p>
									<p class="textS">
										{{`${inData.sticStartDt ? moment(inData.sticStartDt).format('YYYY.MM.DD') : '-'} - ${inData.sticEndDt ? moment(inData.sticEndDt).format('YYYY.MM.DD') : '-'}`}}
									</p>
								</div>
							</div>
						</div>
						<!-- 流出总金额 -->
						<div class="card" style="margin-top: 0.12rem;">
							<div class="titleTop">
								<div class="titleL">
									<van-icon :name="require('@/assets/image/cust_fzzl.png')" size="0.2rem" />
									<h3>流出总金额(万元)</h3>
								</div>
							</div>
							<div class="titleNum">{{numFliter(outData.txnAmtCount || 0, false)}}</div>
							<div class="titleBot">
								<div>
									<p class="textF">累计笔数</p>
									<p class="textS">{{numFliter(outData.txnStcoCount || 0, true)}}</p>
								</div>
								<div>
									<p class="textF">统计日期</p>
									<p class="textS">
										{{`${outData.sticStartDt ? moment(outData.sticStartDt).format('YYYY.MM.DD') : '-'} - ${outData.sticEndDt ? moment(outData.sticEndDt).format('YYYY.MM.DD') : '-'}`}}
									</p>
								</div>
							</div>
						</div>
					</div>
				</van-tab>

				<van-tab title="商机记录">
					<UnityList :unityList="unityList" :finished="finished" :loading="loading"
						@getCustList="getCustList" />
				</van-tab>

			</van-tabs>
		</div>
		<!-- 弹框组件 -->
		<div class="dialog">
			<van-dialog theme="round-button" to=".dialog" v-model:show="show" :title="dialogTitle" show-cancel-button>

				<div v-if="type == 'delPhone' || type == 'delTag' || type == 'delAdr'">{{dialogText}}</div>

				<van-field v-model="value" :label="dialogLable" :placeholder="dialogHolder" show-word-limit
					maxlength="10" :formatter="(value) => value.replace(/\s/g, '')" v-else />

				<template #footer>
					<div class="bootomBtn">
						<van-button class="btnL" size="small" round plain type="primary" @click="show = false">取消
						</van-button>
						<van-button class="btnR" size="small" round type="primary" @click="handOk">确认</van-button>
					</div>
				</template>

			</van-dialog>
		</div>
		<!-- 联系人弹窗 -->
		<div class="dialogs">
			<van-dialog theme="round-button" to=".dialogs" v-model:show="openDialog"
				:title="['联系电话','新增联系电话','修改联系电话','详细地址','新增联系地址','修改联系地址'][dialogTitles]" show-cancel-button>

				<div v-if="dialogTitles == 0" class="swipe">
					<template v-for="item in phoneList" :key="item.id">
						<van-swipe-cell :disabled="item.dataSrc == 1">
							<van-cell :border="true" :title="item.telType" :value="item.ctcTel" />
							<template #right>
								<van-button square type="warning" text="删除" @click="delBtn(item)" />
								<van-button square type="danger" text="修改" @click="editBtn(item)" />
							</template>
						</van-swipe-cell>
					</template>
				</div>

				<div v-else-if="dialogTitles == 3" class="swipes">
					<template v-for="item in addressList" :key="item.id">
						<van-swipe-cell :disabled="item.dataSrc == 1">
							<van-cell :border="true" :title="item.adrType" :value="item.ctcAdr" />
							<template #right>
								<van-button square type="warning" text="删除" @click="delBtn(item)" />
								<van-button square type="danger" text="修改" @click="editBtn(item)" />
							</template>
						</van-swipe-cell>
					</template>
				</div>

				<div v-else-if="dialogTitles == 1 || dialogTitles == 2">
					<van-field v-model="phoneType" readonly label="电话类型" placeholder="选择类型" @click="showPicker = true"
						right-icon="arrow-down" />
					<van-field v-model="phoneText" type="tel" label="联系电话" placeholder="请输入电话" />
				</div>

				<div v-else>
					<van-field v-model="adrType" readonly label="地址类型" placeholder="选择类型" @click="showPicker = true"
						right-icon="arrow-down" />
					<van-field v-model="adrText" label="联系地址" placeholder="请输入地址" />
				</div>

				<template #footer>
					<div class="bootomBtn">
						<van-button class="btnL" size="small" round plain type="primary" @click="onClear">取消
						</van-button>
						<van-button class="btnR" size="small" round type="primary" @click="addOk">
							{{dialogTitles == 0 || dialogTitles == 3 ? '新增' : '确定'}}</van-button>
					</div>
				</template>
			</van-dialog>
		</div>
		<van-popup v-model:show="showPicker" round position="bottom">
			<van-picker :title="dialogTitles < 4 ? '电话类型' :'地址类型'"
				:columns="dialogTitles < 4 ? ['单位电话','移动电话','财务联系电话'] : ['个人通讯地址','工作单位地址']"
				@cancel="showPicker = false" @confirm="onConfirm" />
		</van-popup>

		<div class="bottomLine">
			<span></span>
			<div class="bottomText">到底啦，我是有底线的</div>
			<span></span>
		</div>
		<!-- 发短信 - 打电话 - 登门拜访 -->
		<LowestLevel :custBase="custBase" />
	</div>
</template>

<script>
	// 接口
	import {
		queryCustBaseInfo,
		queryCustTagInfo,
		queryCustDefinedLabel,
		saveCustDefinedLabel,
		delCustDefinedLabel,
		queryCustContactList,
		saveCustContactInfo,
		delCustContactInfo,
		queryCustAddressList,
		saveCustAddressInfo,
		delCustAddressInfo,
		queryCustAssetAnalyInfo,
		queryAssetsAUMGrowthTrend,
		queryCustHoldPrdInfo,
		queryCustSignPrdInfo,
		queryCustSignPrdList,
		queryCustTimeDepAcctInfo,
		queryCustCurrDepAcctInfo,
		queryCustLoanAcctInfo,
		queryCustFinaAcctInfo,
		// queryCustFinaTranInfo,
		queryCustFundAcctInfo,
		queryCustBassAcctInfo,
		queryCustTrustAcctInfo,
		queryRecommendProdList,
		queryCustTranFlowInfo,
		queryCmrcOpportunityList

	} from "@/request/custinfo.js"
	import {
		queryBusiDt
	} from "@/request/index.js"
	// vant
	import {
		Toast,
		Dialog
	} from "vant";
	// 自定义组件
	import Table from "@/views/index/components/Table.vue"
	import EchartsPie from "@/components/common/echarts-pie.vue"
	import echartHistogram from "@/views/index/components/echart-Histogram.vue"
	import selectors from "@/views/index/components/selectors.vue"
	import TitleCard from "@/views/cust/components/TitleCard.vue"
	import LowestLevel from "@/views/cust/components/LowestLevel.vue"
	import TabsList from "@/views/cust/components/TabsList.vue"
	import UnityList from "@/views/cust/components/UnityList.vue"
	import moment from "moment"
	export default {
		name: "clCustomerView",
		components: {
			Table,
			EchartsPie,
			echartHistogram,
			selectors,
			TitleCard,
			LowestLevel,
			TabsList,
			UnityList
		},
		data() {
			return {
				assetFlag: true,
				liaFlag: true,
				active: 0,
				showPicker: false,
				phoneType: '',
				phoneText: '',
				adrType: '',
				adrText: '',
				activeNames: ['1'],
				custBase: {},
				portraitbtn: true,
				tagList: [],
				show: false,
				openDialog: false,
				editTag: false,
				tagItem: null,
				itemData: null,
				value: '',
				dialogTitle: '',
				dialogTitles: 0,
				dialogLable: '',
				dialogHolder: '限10字以内',
				dialogText: '',
				type: '',
				phoneList: [],
				addressList: [],
				listLabel: [{
						label: '类型',
						align: 'left',
						fixed: true
					},
					{
						label: '余额',
						align: 'right'
					},
					{
						label: '月日均',
						align: 'right'
					},
					{
						label: '季日均',
						align: 'right'
					},
					{
						label: '年日均',
						align: 'right'
					},
				],
				listData: [{
						name: '活期存款',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '定期存款',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '理财',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '基金',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '保险',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '信托',
						a: '',
						b: '',
						c: '',
						d: ''
					},
					{
						name: '合计',
						a: '',
						b: '',
						c: '',
						d: ''
					},
				],
				liaLabel: [{
						label: '类型',
						align: 'left',
						fixed: true
					},
					{
						label: '贷款金额',
						align: 'right'
					},
					{
						label: '贷款余额',
						align: 'right'
					},
				],
				liaData: [{
						name: '经营类',
						a: '',
						b: ''
					},
					{
						name: '消费类',
						a: '',
						b: ''
					},
					{
						name: '按揭类',
						a: '',
						b: ''
					},
					{
						name: '合计',
						a: '',
						b: ''
					}
				],
				cardData: [0, 0, 0, 0],
				liabilities: [0],
				pieData: [],
				listType: 0,
				dataDate: '',
				timeUnit: 0,
				selectTime: [],
				xAxis: [],
				aumDataxData: [],
				aumData: {},
				prdList: [],
				sgnList: [],
				prodList: [],
				inData: {
					txnAmtCount: '0',
					txnStcoCount: '0',
					sticStartDt: '',
					sticEndDt: ''
				},
				outData: {
					txnAmtCount: '0',
					txnStcoCount: '0',
					sticStartDt: '',
					sticEndDt: ''
				},
				unityList: [],
				total: 0,
				finished: true,
				loading: false,
				pageIndex: 0,
				params: {
					custNum: this.$route.query.custNum,
					pageNum: '1',
					pageSize: '10'
				},
				flowInfo: true,
				listGet: true
			};
		},
		created() {
			queryBusiDt({}, res => {
				this.dataDate = res.data.workDate;
				this.selectTime = []
				for (let i = 11; i >= 0; i--) {
					let obj = {
						key: moment(this.dataDate).subtract(i, 'month').format('YYYYMM'),
						title: moment(this.dataDate).subtract(i, 'month').format('M月'),
					}
					this.selectTime.push(obj)
				}
				this.queryAssetsTrend(this.dataDate)
			})
			this.queryunityList()
			this.queryProdList()
			// this.queryContactList()
			// this.queryAddressList()
			this.queryAssetAnaly()
			this.queryCustHoldPrd()
			this.querySignInfo()
			this.queryCustInfo(this.$route.query.custNum)
			this.queryTagList(this.$route.query.custNum)
		},
		methods: {
			moment,
			// 客户拜访记录跳转
			onClickRight() {
				this.$router.push({
					name: 'baiFangList',
					query: {
						custNo: this.$route.query.custNum
					}
				})
			},
			/* 客户基础信息查询 */
			queryCustInfo(custNum) {
				let body = {
					custNum: custNum
				}
				queryCustBaseInfo(body, res => {
					if (res && res.data) {

						// 客户基础信息
						this.custBase = res.data.custBase

						// 资产分布图(列表信息)
						let list = res.data.assetInfo
						this.cardData = [list.aumBal, list.aumAvgM, list.aumAvgQ, list.aumAvgY]
						this.listData = [{
								name: '活期存款',
								a: list.currDpsitBal,
								b: list.currDpsitAvgM,
								c: list.currDpsitAvgQ,
								d: list.currDpsitAvgY
							},
							{
								name: '定期存款',
								a: list.timeDpsitBal,
								b: list.timeDpsitAvgM,
								c: list.timeDpsitAvgQ,
								d: list.timeDpsitAvgY
							},
							{
								name: '理财',
								a: list.cftBal,
								b: list.cftAvgM,
								c: list.cftAvgQ,
								d: list.cftAvgY
							},
							{
								name: '基金',
								a: list.fndBal,
								b: list.fndAvgM,
								c: list.fndAvgQ,
								d: list.fndAvgY
							},
							{
								name: '保险',
								a: list.insBal,
								b: list.insAvgM,
								c: list.insAvgQ,
								d: list.insAvgY
							},
							{
								name: '信托',
								a: list.entrstBal,
								b: list.entrstAvgM,
								c: list.entrstAvgQ,
								d: list.entrstAvgY
							},
							{
								name: '合计',
								a: list.aumBal,
								b: list.aumAvgM,
								c: list.aumAvgQ,
								d: list.aumAvgY
							},
						]
					}
				})
			},
			async queryTagList(custNum) {
				this.tagList = []
				await this.queryDefinedTag(custNum)
				await this.queryCustTag(custNum)
				// await this.queryDefinedTag(custNum)
				// this.queryCustTag(custNum)
			},
			/* 客户标签信息查询 */
			queryCustTag(custNum) {
				let body = {
					custNum: custNum,
					judge: '0'
				}
				queryCustTagInfo(body, res => {
					if (res && res.data && res.data.LabelClass) {
						let data = res.data.LabelClass
						let labelList = ['jbsx', 'zcxj', 'xwxg', 'yxxx', 'fxtz', 'khjz']
						labelList.forEach((item, index) => {
							if (data[item] && data[item].length > 0) {
								this.tagList.push({
									label: ['基本属性', '资产信息', '行为习惯', '营销信息', '风险特征', '客户价值'][index],
									tag: data[item]
								})
							}
						})
					}
				})
			},
			/* 自定义标签信息查询 */
			queryDefinedTag(custNum) {
				let body = {
					custNumc: custNum
				}
				queryCustDefinedLabel(body, res => {
					let data = res.data.contactList || []
					if (data && data.length > 0)
						this.tagList.unshift({
							label: '自定义标签',
							tag: data
						})
				})
			},
			/* 自定义标签修改/新增 */
			saveDefinedTag(body) {
				saveCustDefinedLabel(body, res => {
					Toast.clear();
					if (res.data) {
						Toast.success(res.msg)
						this.show = false
						this.queryTagList(this.$route.query.custNum)
					}
				})
			},
			/* 自定义标签删除 */
			delDefinedTag(body) {
				delCustDefinedLabel(body, res => {
					Toast.clear();
					if (res.data) {
						Toast.success(res.msg)
						this.show = false
						this.queryTagList(this.$route.query.custNum)
					}
				})
			},
			/* 添加自定义标签 */
			addTag() {
				if (this.tagList && this.tagList[0] && this.tagList[0].label == '自定义标签' && this.tagList[0].tag.length >
					9) {
					Dialog.alert({
						title: '提示',
						message: '自定义标签仅限10个。',
						theme: 'round-button',
						confirmButtonColor: '#026DFF'
					}).then(() => {
						// on close
					});
				} else {
					this.value = ''
					this.initDialog('addTag', '添加自定义标签')
				}
			},
			/* 弹窗确定 */
			handOk() {
				if (this.value || this.type == 'delTag' || this.type == 'delPhone' || this.type == 'delAdr') {
					Toast.loading({
						message: "正在加载",
						forbidClick: true,
						duration: 0,
					});
					switch (this.type) {
						case 'addTag':
							var body = {
								custNumc: this.custBase.custNum, // 客户编号
								labNm: this.value, // 标签内容
							}
							this.saveDefinedTag(body)
							break
						case 'editTag':
							var body = {
								idc: this.tagItem.idc, // id
								custNumc: this.custBase.custNum, // 客户编号
								labNm: this.value, // 标签内容
							}
							this.saveDefinedTag(body)
							break;
						case 'delTag':
							var body = {
								idc: this.tagItem.idc, // id
							}
							this.delDefinedTag(body)
							break;
						case 'delPhone':
							var body = {
								ids: [this.itemData.id]
							}
							delCustContactInfo(body, res => {
								Toast.clear();
								if (res.data) {
									this.show = false
									this.queryContactList()
								}
							})
							break;
						case 'delAdr':
							var body = {
								ids: [this.itemData.id]
							}
							delCustAddressInfo(body, res => {
								Toast.clear();
								if (res.data) {
									this.show = false
									this.queryAddressList()
								}
							})
							break;
					}
				} else {
					Toast.fail("标签内容为空!");
				}
				// this.show = false
			},
			/* 点击修改标签 */
			editTagFun(item) {
				if (this.editTag) {
					this.tagItem = item
					this.value = item.labNm
					this.initDialog('editTag', '修改自定义标签')
				}
			},
			/* 点击删除标签 */
			delTagFun(item) {
				if (this.editTag) {
					this.tagItem = item
					this.dialogText = '确定删除该标签？'
					this.initDialog('delTag', '提示')
				}
			},
			/* 初始化弹窗内容 类型 标题 输入框holder 输入框默认值 */
			initDialog(type, dialogTitle) {
				this.show = true
				this.type = type
				this.dialogTitle = dialogTitle
			},
			/* 修改电话按钮 */
			editPhone() {
				this.queryContactList()
			},
			/* 查询联系电话 */
			queryContactList() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
					className: 'zIndex'
				});
				let body = {
					custNum: this.$route.query.custNum
				}
				queryCustContactList(body, res => {
					if (res && res.data && res.data.contactList) {
						this.phoneList = res.data.contactList
						this.openDialog = true
						this.dialogTitles = 0
						Toast.clear()
						// this.$forceUpdate() 
					} else {
						Toast.fail("联系电话查询失败")
					}
				})
			},
			/* 查询联系地址 */
			queryAddressList() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					className: 'zIndex',
					duration: 0,
				});
				let body = {
					custNum: this.$route.query.custNum
				}
				queryCustAddressList(body, res => {
					if (res && res.data && res.data.addressList) {
						this.addressList = res.data.addressList
						this.openDialog = true
						this.dialogTitles = 3
						Toast.clear()
						// this.$forceUpdate()
					} else {
						Toast.fail("联系地址查询失败")
					}
				})
			},
			/* 修改地址按钮 */
			editAddress() {
				// this.openDialog = true
				this.type = 'editAddress'
				this.queryAddressList()
			},
			/* 删除按钮 */
			delBtn(item) {
				this.dialogText = '确定删除该信息？'
				this.itemData = item
				if (this.dialogTitles == 0) {
					this.initDialog('delPhone', '提示')
				} else {
					this.initDialog('delAdr', '提示')
				}
			},
			/* 修改按钮 */
			editBtn(item) {
				switch (this.dialogTitles) {
					case 0:
						this.itemData = item
						this.phoneType = item.telType
						this.phoneText = item.ctcTel
						this.dialogTitles = 2
						break
					case 3:
						this.itemData = item
						this.adrType = item.adrType
						this.adrText = item.ctcAdr
						this.dialogTitles = 5
						break
				}
			},
			/* 新增/编辑 */
			addOk() {
				if (this.dialogTitles == 1 || this.dialogTitles == 2) {
					Toast.loading({
						message: "正在加载",
						forbidClick: true,
						duration: 0,
						className: 'zIndex'
					});
					this.saveCustPhone()
				} else if (this.dialogTitles == 4 || this.dialogTitles == 5) {
					Toast.loading({
						message: "正在加载",
						forbidClick: true,
						duration: 0,
						className: 'zIndex'
					});
					this.saveAddress()
				} else {
					switch (this.dialogTitles) {
						case 0:
							this.dialogTitles = 1
							this.phoneType = ''
							this.phoneText = ''
							break
						case 3:
							this.dialogTitles = 4
							this.adrType = ''
							this.adrText = ''
							break
					}
				}
			},
			/* 联系电话保存 */
			saveCustPhone() {
				let obj = {
					'单位电话': '12',
					'移动电话': '13',
					'财务联系电话': '15',
				}
				let body = {
					ctcTel: this.phoneText,
					telType: obj[this.phoneType],
					custNum: this.$route.query.custNum,
					dataSrc: '2',
				}
				if (this.dialogTitles == 2) {
					body.id = this.itemData.id
				}
				saveCustContactInfo(body, res => {
					if (res && res.data) {
						// this.dialogTitles = 0
						this.queryContactList()
					} else {
						Toast.fail({
							message: body.id ? "修改失败" : '保存失败',
							className: 'zIndex'
						})
					}
				})
			},
			/* 联系地址保存 */
			saveAddress() {
				let obj = {
					'个人通讯地址': '119',
					'工作单位地址': '115',
				}
				let body = {
					ctcAdr: this.adrText,
					adrType: obj[this.adrType],
					custNum: this.$route.query.custNum,
					dataSrc: '2',
				}
				if (this.dialogTitles == 5) {
					body.id = this.itemData.id
				}
				saveCustAddressInfo(body, res => {
					if (res && res.data) {
						this.queryAddressList()
						// this.dialogTitles = 3
					} else {
						Toast.fail({
							message: body.id ? "修改失败" : '保存失败',
							className: 'zIndex'
						})
					}
				})
			},
			/* 取消按钮 */
			onClear() {
				switch (this.dialogTitles) {
					case 1:
						this.dialogTitles = 0;
						break
					case 2:
						this.dialogTitles = 0;
						break
					case 4:
						this.dialogTitles = 3;
						break
					case 5:
						this.dialogTitles = 3;
						break
					default:
						this.openDialog = false;
						break
				}
			},
			/* 选中类型 */
			onConfirm(value) {
				if (this.dialogTitles > 2) {
					this.adrType = value
				} else {
					this.phoneType = value
				}
				this.showPicker = false
			},
			/* 资产分布图-饼图 */
			queryAssetAnaly() {
				let body = {
					custNum: this.$route.query.custNum,
				}
				queryCustAssetAnalyInfo(body, res => {
					if (res && res.data) {
						let itemStyle = function(item) {
							return {
								color: ["#488BFF", "#26CEBA", "#FFC069", "#FD6865", "#836DE4", "#FF9C6E"][item]
							}
						}
						let percentage = (num) => {
							if (num == undefined || Number(num) == 0) {
								return 0.00
							}
							return (Number(num) * 100).toFixed(2)
						}
						// 资产总览饼图
						let pieData = res.data.assetPieDataA
						pieData.forEach((item, index) => {
							item.itemStyle = itemStyle(index)
							item.percentage = percentage(item.value1 || 0)
						})
						this.pieData = pieData
						// 负债总览
						let assetData = res.data.assetAnalyData
						// 贷款余额总计（消费贷款余额，经营贷款余额，按揭贷款余额）
						this.liabilities = [assetData.loanBalSum]
						// 负债分布图-列表
						this.liaData = [{
								name: '经营类',
								a: assetData.corprtnLoanSum,
								b: assetData.corprtnLoanBal
							},
							{
								name: '消费类',
								a: assetData.cnsmLoanSum,
								b: assetData.cnsmLoanBal
							},
							{
								name: '按揭类',
								a: assetData.mrtgLoanSum,
								b: assetData.mrtgLoanBal
							},
							{
								name: '合计',
								a: assetData.loanSum,
								b: assetData.loanBalSum
							}
						]
						// 负债分布图-饼图
						let pieliab = res.data.loanPieDataA
						pieliab.forEach((item, index) => {
							item.itemStyle = itemStyle(index)
							item.percentage = percentage(item.value1 || 0)
						})
						this.pieliab = pieliab
					} else {
						Toast.fail("资产分布图数据为空");
					}
				})
			},
			/* 资产分布图-列表/饼图切换 */
			assetCheck() {
				this.assetFlag = !this.assetFlag
				if (!this.assetFlag) {
					this.$nextTick(() => {
						this.$refs.aumDisDiaChart.drawEcharts();
					});
				}
			},
			/* 资产分布图-增长趋势查询 */
			queryAssetsTrend(time) {
				let body = {
					etlDt: moment(time).format('YYYYMMDD'),
					custNum: this.$route.query.custNum,
					judge: '', // 0的时候为月
					pageNum: '1',
					pageSize: '31'
				}
				let xAxis = []
				// 根据查询日期 日/月 生成一条X轴
				if (this.timeUnit == 0) {
					body.etlDt = moment(time).format('YYYYMM')
					let lastDay = Number(moment(time).endOf('month').format('DD')) // 计算该月有多天
					for (let i = lastDay - 1; i >= 0; i--) {
						let obj = {
							value: moment(time).endOf('month').subtract(i, 'day').format('DD'), // 需要展示的时间
							time: moment(time).endOf('month').subtract(i, 'day').format('YYYYMMDD') // 保留原时间戳
						}
						xAxis.push(obj)
					}
				} else {
					body.etlDt = moment(time).format('YYYYMMDD')
					body.judge = '0'
					for (let i = 11; i >= 0; i--) {
						let obj = {
							value: moment(time).subtract(i, 'month').format('MM'), // 需要展示的时间
							time: moment(time).subtract(i, 'month').format('YYYYMM') // 保留原时间戳 往前推12个月
						}
						xAxis.push(obj)
					}
				}
				queryAssetsAUMGrowthTrend(body, res => {
					let data = res.data.records || []
					console.log(data)
					// 全部, 活期存款, 定期存款, 理财, 基金, 保险, 信托
					let arr = ['aumBal', 'currDpsitBal', 'timeDpsitBal', 'cftBal', 'fndBal', 'insBal', 'entrstVal']
					let xData = [
						[],
						[],
						[],
						[],
						[],
						[],
						[]
					]
					// 根据生成的X轴去拿到接口返回的每一条X轴的数据
					xAxis.forEach(itemX => {
						let flag = true
						data.forEach(item => {
							if (itemX.time == item.etlDt) {
								arr.forEach((name, index) => {
									let obj = {
										value: item[
											`${name}${['ToYstd', name == 'aumBal' ? 'ToLastMonth' : 'ToLm'][this.timeUnit]}`
											] || 0,
										time: itemX.time,
										totalBalance: item[name] || 0
									}
									xData[index].push(obj)
								})
								flag = false
							}
						})
						if (flag) {
							arr.forEach((n, index) => {
								let obj = {
									value: 0,
									time: itemX.time,
									totalBalance: 0
								}
								xData[index].push(obj)
							})
						}
					})
					this.aumDataxData = xData
					this.xAxis = xAxis
					this.aumData = {
						series: xData[0],
						xAxis: xAxis,
					}
				})
			},
			/* 资产分布-选择title */
			aumChange(v) {
				this.aumData = {
					series: this.aumDataxData[v],
					xAxis: this.xAxis
				}
			},
			/* 资产分布-查询选择的月份的数据 */
			aumChange2(v) {
				this.queryAssetsTrend(this.selectTime[v].key)
			},
			/* 资产分布-日月切换 */
			changeAum(data) {
				this.timeUnit = data
				this.$refs.Histogram2.init()
				this.queryAssetsTrend(this.dataDate)
			},
			/* 负债分布图-列表/饼图切换 */
			liaCheck() {
				this.liaFlag = !this.liaFlag
				if (!this.liaFlag) {
					this.$nextTick(() => {
						this.$refs.liaChart.drawEcharts();
					});
				}
			},
			/* 产品信息接口调用 */
			queryCustInfos() {
				if (this.active == 1) {
					if (this.listGet) {
						this.tableListGet()
						this.listGet = false
					}
				}
				if (this.active == 2) {
					this.queryFlowInfo()
					if (this.flowInfo) {
						this.queryFlowInfo()
						this.flowInfo = false
					}
				}
			},
			/* 客户持有产品查询 */
			queryCustHoldPrd() {
				let body = {
					custNum: this.$route.query.custNum
				}
				queryCustHoldPrdInfo(body, res => {
					if (res && res.data && res.data.prdList) {
						let arr = [{
								name: '定期存款',
								key: 'HOLD_TIME_DPSIT',
								disabled: true
							},
							{
								name: '活期存款',
								key: 'HOLD_CURR_DPSIT',
								disabled: true
							},
							{
								name: '贷款',
								key: 'HOLD_LOAN',
								disabled: true
							},
							{
								name: '理财',
								key: 'HOLD_CFT',
								disabled: true
							},
							{
								name: '基金',
								key: 'HOLD_FND',
								disabled: true
							},
							{
								name: '保险',
								key: 'HOLD_INS',
								disabled: true
							},
							{
								name: '信托',
								key: 'HOLD_ENTRST',
								disabled: true
							}
						]
						res.data.prdList.forEach(item => {
							arr.forEach(i => {
								if (i.key == item) {
									i.disabled = false
								}
							})
						})
						this.prdList = arr
					}
				})
			},
			/* 客户签约产品查询 */
			querySignInfo() {
				let body = {
					custNum: this.$route.query.custNum
				}
				queryCustSignPrdInfo(body, res => {
					if (res && res.data && res.data.sgnList) {
						let arr = [{
								name: '网上银行',
								key: 'SGN_WBANK',
								disabled: true
							},
							{
								name: '支付宝',
								key: 'SGN_ALPY',
								disabled: true
							},
							{
								name: '微信银行',
								key: 'SGN_WCHT_BNK',
								disabled: true
							},
							{
								name: '微信支付',
								key: 'SGN_WCHT_PYMT',
								disabled: true
							},
							{
								name: '云闪付',
								key: 'SGN_YSF',
								disabled: true
							},
							{
								name: '九银合伙人',
								key: 'SGN_JYHHR',
								disabled: true
							},
							{
								name: '手机银行',
								key: 'SGN_MOBBANK',
								disabled: true
							}
						]
						res.data.sgnList.forEach(item => {
							arr.forEach(i => {
								if (i.key == item) {
									i.disabled = false
								}
							})
						})
						this.sgnList = arr
					}
				})
			},
			/* 根据拥有的权限查询列表信息 */
			tableListGet() {
				let body = {
					custNum: this.$route.query.custNum
				}
				// 持有产品
				this.prdList.forEach(item => {
					if (!item.disabled) {
						switch (item.name) {
							case '定期存款':
								/*  定期存款产品明细查询 */
								queryCustTimeDepAcctInfo(body, res => {
									item.list = res.data.records || []
									item.label = [{
											label: "存款种类",
											key: 'depKnd',
											width: '120'
										},
										{
											label: "存期",
											key: 'depte',
											width: '100'
										},
										{
											label: "利率",
											key: 'intRat',
											width: '100',
											num: true
										},
										{
											label: "余额",
											key: 'currBal',
											width: '100',
											num: true
										},
										{
											label: "到期日期",
											key: 'expDt',
											width: '100'
										},
										{
											label: "账户状态",
											key: 'acctSt',
											width: '100'
										},
									]
								})
								break;
							case '活期存款':
								/*  活期存款产品明细查询 */
								queryCustCurrDepAcctInfo(body, res => {
									item.list = res.data.records || []
									item.label = [{
											label: "存款种类",
											key: 'depKnd',
											width: '120'
										},
										{
											label: "卡号",
											key: 'cardNum',
											width: '150'
										},
										{
											label: "利率",
											key: 'intRat',
											width: '100',
											num: true
										},
										{
											label: "时点余额",
											key: 'currBal',
											width: '100',
											num: true
										},
										{
											label: "可用余额",
											key: 'usablBal',
											width: '100',
											num: true
										},
										{
											label: "控制金额",
											key: 'cntrlAmt',
											width: '100',
											num: true
										},
										{
											label: "账户状态",
											key: 'acctSt',
											width: '100'
										},
									]
								})
								break;
							case '贷款':
								/* 贷款产品明细查询 */
								queryCustLoanAcctInfo(body, res => {
									item.list = res.data.records || []
									item.label = [{
											label: "贷款类别",
											key: 'loanCtgry',
											width: '120'
										},
										{
											label: "贷款名称",
											key: 'loanNm',
											width: '100'
										},
										{
											label: "利率",
											key: 'intRat',
											width: '100',
											num: true
										},
										{
											label: "发放金额",
											key: 'dstrbtAmt',
											width: '100',
											num: true
										},
										{
											label: "当前余额",
											key: 'currBal',
											width: '100',
											num: true
										},
										{
											label: "贷款状态",
											key: 'loanSt',
											width: '100'
										},
									]
								})
								break;
							case '理财':
								/*  理财产品明细查询 */
								queryCustFinaAcctInfo(body, res => {
									item.list = res.data.records || []
									item.label = [{
											label: "产品名称",
											key: 'pdNm',
											width: '120'
										},
										{
											label: "卡号",
											key: 'cardNum',
											width: '150'
										},
										{
											label: "产品余额",
											key: 'acctBal',
											width: '100',
											num: true
										},
										{
											label: "产品状态",
											key: 'acctStCd',
											width: '100'
										},
										{
											label: "到期日期",
											key: 'expDayPrd',
											width: '100'
										},
										{
											label: "产品开放期",
											key: 'otpuBeginDt',
											width: '100'
										},
										// 拼接的部分                    
										{
											label: "购买金额",
											key: 'prchsdAmt',
											width: '100',
											num: true
										},
										{
											label: "购买日期",
											key: 'prchsdDt',
											width: '100'
										},
										{
											label: "起息日期",
											key: 'stIntDt',
											width: '100'
										},
										{
											label: "购买渠道",
											key: 'cnlKnd',
											width: '100'
										},
									]
								})
								/* 理财交易明细查询(暂不用) */
								// queryCustFinaTranInfo(body, res => {
								//   console.log('理财交易明细查询(暂不用)',res)
								// })
								break;
							case '基金':
								/*  基金产品明细查询 */
								queryCustFundAcctInfo(body, res => {
									item.list = res.data.records || []
									item.label = [{
											label: "产品名称",
											key: 'pdNm',
											width: '120'
										},
										{
											label: "基金代码",
											key: 'fndCd',
											width: '100'
										},
										{
											label: "基金风险等级",
											key: 'fndRskLvl',
											width: '100'
										},
										{
											label: "当前份额",
											key: 'currLot',
											width: '100',
											num: true
										},
										{
											label: "累计买入金额",
											key: 'acmlPrchsdAmt',
											width: '100',
											num: true
										},
										{
											label: "账户状态",
											key: 'fndAcctStCd',
											width: '100'
										},
									]
								})
								break;
							case '保险':
								/*  保险产品明细查询 */
								queryCustBassAcctInfo(body, res => {
									item.list = res.data.records
									item.label = [{
											label: "保险公司名称",
											key: 'insCoNm',
											width: '120'
										},
										{
											label: "保险产品名称",
											key: 'insPdNm',
											width: '120'
										},
										{
											label: "险种类别",
											key: 'typeOfInsureCtgry',
											width: '100'
										},
										{
											label: "缴费方式",
											key: 'ptfMd',
											width: '100'
										},
										{
											label: "缴费期限",
											key: 'currActYld',
											width: '100'
										},
										{
											label: "保险费",
											key: 'prem',
											width: '100'
										},
									]
								})
								break;
							case '信托':
								/*  信托产品明细查询 */
								queryCustTrustAcctInfo(body, res => {
									item.list = res.data.records
									item.label = [{
											label: "产品名称",
											key: 'pdNm',
											width: '120'
										},
										{
											label: "卡号",
											key: 'cardNum',
											width: '150'
										},
										{
											label: "产品余额",
											key: 'acctBal',
											width: '100',
											num: true
										},
										{
											label: "产品状态",
											key: 'acctStCd',
											width: '100'
										},
										{
											label: "到期日期",
											key: 'expDayPrd',
											width: '100'
										},
										{
											label: "产品开放期",
											key: 'otpuBeginDt',
											width: '100'
										},
										// 拼接的部分                    
										{
											label: "购买金额",
											key: 'buyAmt',
											width: '100',
											num: true
										},
										{
											label: "购买日期",
											key: 'prchsdDt',
											width: '100'
										},
										{
											label: "起息日期",
											key: 'stIntDt',
											width: '100'
										},
										{
											label: "购买渠道",
											key: 'cnlKnd',
											width: '100'
										},
									]
								})
								break;
						}
					}
				})
				// 签约产品
				this.sgnList.forEach(item => {
					let queryItemList = (type) => {
						body.sgnPdCtgry = type
						queryCustSignPrdList(body, res => {
							item.list = res.data.records || []
							item.label = [{
									label: "签约账号",
									key: 'sgnAcctNo',
									width: '150'
								},
								{
									label: "签约手机号",
									key: 'sgnMobileNum',
									width: '100'
								},
								{
									label: "签约机构",
									key: 'sgnInstNm',
									width: '100'
								},
								{
									label: "签约日期",
									key: 'sgnDt',
									width: '100'
								},
							]
						})
					}
					if (!item.disabled) {
						/*  签约产品明细查询 */
						switch (item.name) {
							case '手机银行':
								queryItemList('20401')
								break;
							case '网上银行':
								queryItemList('20101')
								break;
							case '微信银行':
								queryItemList('20201')
								break;
							case '微信支付':
								queryItemList('40301')
								break;
							case '支付宝':
								queryItemList('40302')
								break;
							case '云闪付':
								queryItemList('40105')
								break;
							case '九银合伙人':
								queryItemList('70234')
								break;
						}
					}
				})
			},
			/* 推荐产品信息查询 */
			queryProdList() {
				/* 
				  推荐产品信息查询
				  custNum         客户编号
				  pdCd            产品代码
				  pdNm            产品名称
				  recomDt         推荐日期
				  pdCmpnIntrdc    营销话术
				 */
				let body = {
					custNum: this.$route.query.custNum
				}
				queryRecommendProdList(body, res => {
					if (res && res.data && res.data.records) {
						this.prodList = res.data.records
					}
				})
			},
			/* 分享 */
			fenxiang() {
				Toast.fail("尽请期待")
			},
			/* 交易行为分析查询 */
			queryFlowInfo() {
				let body = {
					custNum: this.$route.query.custNum
				}
				queryCustTranFlowInfo(body, res => {
					if (res && res.data) {
						if (res.data.inFlowCount) {
							this.inData = res.data.inFlowCount // 流入
						}
						if (res.data.outFlowCount) {
							this.outData = res.data.outFlowCount // 流出
						}
					}
				})
			},
			/* 查询商机列表 */
			queryunityList() {
				this.finished = false;
				this.loading = true;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				queryCmrcOpportunityList(this.params, res => {
					if (res.data && res.data.records) {
						this.total = res.data.total;
						this.unityList = this.unityList.concat(res.data.records);
						if (this.unityList.length >= this.total) this.finished = true;
					} else {
						this.finished = true;
					}
					Toast.clear();
					this.loading = false;
				})
			},
			/* 通过reload事件调用 */
			getCustList() {
				this.pageIndex++;
				this.params.pageNum = this.pageIndex.toString()
				this.queryunityList()
			},
			numFliter(value, tip) {
				if (value == undefined) {
					return '0.00'
				}
				value = tip ? Number(value) : (Number(value) / 10000).toFixed(2)
				let n = value.toString().split('.')
				let z = /\d{1,3}(?=(\d{3})+$)/g
				if (value.toString().indexOf('.') >= 0) {
					return `${n[0].replace(z, '$&,')}.${n[1]}`
				} else {
					return `${value.toString().replace(z, '$&,')}`
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.clCustomerView {
		box-sizing: border-box;
		padding: 0.11rem 0.12rem;
		font-size: 0.14rem;
		color: #262626;

		.bottomLine {
			width: 60%;
			margin: 0.2rem auto 0.35rem;
			padding-bottom: 0.2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&>span {
				width: 10.7%;
				height: 0.005rem;
				opacity: 0.7;
				border-top: 0.005rem solid rgba(191, 191, 191, 1);
			}

			.bottomText {
				margin: 0 2.7%;
				font-size: 0.12rem;
				padding: 0 0.1rem;
				color: #BFBFBF;
			}
		}

		.dialog,
		.dialogs {
			.bootomBtn {
				padding: 0.2rem 0 0.145rem;

				.btnL,
				.btnR {
					width: 1.08rem;
				}

				.btnL {
					margin-right: 0.08rem;
				}

				.btnR {
					margin-left: 0.08rem;
				}
			}
		}

		.dialog {
			&:deep(.van-field__control) {
				background: #FAFAFA;
				padding: 0.105rem 0.085rem;
			}
		}

		.dialogs {
			&:deep(.van-cell) {
				border-top: 0.005rem solid #E7E9EC;
				border-bottom: 0.005rem solid #E7E9EC;

				&:after {
					border: none;
				}
			}

			.swipe {
				&:deep(.van-cell__title) {
					text-align: left;
				}

				&:deep(.van-cell__value) {
					text-align: right;
				}
			}

			.swipes {
				&:deep(.van-cell__title) {
					flex: 2;
					text-align: left;
				}

				&:deep(.van-cell__value) {
					flex: 3;
					text-align: left;
					font-size: 0.11rem;
					color: #262626;
				}
			}
		}

		.card {
			background: #fff;
			padding: 0.12rem;
			border-radius: 0.08rem;

			.custStyle {
				font-size: 0.14rem;
				display: flex;
				justify-content: space-between;
			}

			.aumStyle {
				align-items: center;

				.title {
					font-family: PingFangSC-Medium;
					font-size: 0.14rem;
					color: rgba(0, 0, 0, 0.85);
					letter-spacing: 0;
					font-weight: 500;
				}

				.iconBox {
					height: 0.32rem;
				}
			}
		}

		.titleTop {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.titleL {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 0.2rem;
				text-align: left;

				h3 {
					margin: 0 0.08rem;
					font-family: PingFangSC-Medium;
					font-size: 0.14rem;
					font-weight: 500;
					color: rgba(0, 0, 0, 0.85);
					font-weight: 500;
				}
			}
		}

		.custInfo {
			.custInfoName {
				width: 100%;
				display: flex;
				align-items: center;
				padding-bottom: 0.12rem;
				box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);

				.custInfoLeft {
					width: 0.4rem;
					height: 0.4rem;
					background: url(~@/assets/image/mine_main_userIcon.png) no-repeat center;
					background-size: contain;
					border-radius: 0.2rem;
					overflow: hidden;
					margin-right: 0.1rem;
				}

				.custInfoRight {
					.custName {
						display: flex;

						.custItem1_2_1 {
							height: 0.24rem;
							font-family: PingFangSC-Medium;
							font-size: 0.16rem;
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
					}

					.custItem1_2_3 {
						width: calc(100%);
						height: 0.16rem;
						display: flex;
						flex-wrap: nowrap;

						.iconText {
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
			}

			.custInfoNo {
				display: flex;
				font-size: 0.12rem;
				text-align: left;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				line-height: 0.18rem;
				padding: 0.07rem 0;
				box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);

				&>div {
					width: 50%;

					div:nth-child(2) {
						color: #8C8C8C;
					}
				}
			}

			.custInfoPhone {
				font-size: 0.12rem;
				line-height: 0.18rem;
				padding: 0.07rem 0;
				box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);

				.textContent {
					width: 100%;
					display: flex;

					.title {
						width: 30%;
						color: #8C8C8C;
						text-align: left;
					}

					.phoneStyle,
					.textStyle {
						width: 63%;
						text-align: right;
					}

					.icon {
						margin-left: 0.1rem;
						padding-top: 0.02rem;
					}
				}
			}

			.custManager {
				display: flex;
				font-size: 0.12rem;
				line-height: 0.18rem;
				padding-top: 0.07rem;

				&>div {
					width: 50%;
					text-align: left;

					span:nth-child(1) {
						color: #8C8C8C;
					}
				}
			}

		}

		.custPortrait {
			margin-top: 0.12rem;

			.custPortrait_title {
				display: flex;
				justify-content: space-between;

				.custPortrait_title_l,
				.custPortrait_title_r {
					display: flex;
					align-items: center;
				}

				.custPortrait_title_l {
					font-weight: 500;

					&>span {
						margin-left: 0.08rem;
					}
				}

				.custPortrait_title_r {
					font-size: 0.12rem;

					.btnAdd,
					.btnText {
						display: flex;
						align-items: center;
					}

					.btnAdd {
						padding: 0.03rem 0.08rem;
						background: #EDEFF2;
						border-radius: 0.04rem;

						&>span {
							color: #595959;
							margin-left: 0.04rem;
						}
					}

					.btnText {
						margin-left: 0.12rem;
						color: #8C8C8C;

						&>span {
							margin-right: 0.02rem;
						}
					}
				}
			}

			.custPortrait_main {
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				font-size: 0.11rem;
				color: #595959;
				text-align: left;
				transition: 0.3s;
				overflow: hidden;

				&>div {
					margin-top: 0.08rem;
				}

				.main_label {
					display: flex;
					justify-items: center;
				}

				.portraitIcon {
					.iconX {
						position: absolute;
						width: 0.095rem;
						height: 0.095rem;
						display: flex;
						align-items: center;
						justify-content: center;
						top: -0.0475rem;
						right: -0.0475rem;
						background: #E6F4FF;
						border-radius: 50%;
						box-shadow: 0px 1px 2px 0px #D4E0EF;
					}
				}

				.label,
				.labelD {
					display: inline-block;
					padding: 0.01rem 0.04rem;
					color: #026DFF;
					background: #E6F4FF;
					border-radius: 0.04rem 0 0.04rem 0;
					transition: 0.3s;
				}

				.label {
					margin: 0.04rem 0.04rem 0 0;
				}

				.labelD {
					position: relative;
					margin: 0.08rem 0.125rem 0 0;
				}
			}
		}

		.tabsList {
			margin-top: 0.12rem;

			.tabs {
				--van-tab-text-color: #8C8C8C;
				--van-tab-active-text-color: #026DFF;
				--van-tabs-bottom-bar-color: #026DFF;

				&:deep(.van-tabs__nav) {
					border-radius: 0.08rem 0.08rem 0 0;
					background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
				}

				&:deep(.van-tabs__content) {
					margin-top: 0.12rem;
				}

				&:deep(.van-tabs__line) {
					width: 0.6rem;
				}

				.analysis {
					.titleNum {
						width: 100%;
						text-align: left;
						margin: 0.12rem 0 0.08rem 0;
						font-family: PingFangSC-Medium;
						font-size: 0.2rem;
						color: rgba(0, 0, 0, 0.85);
						letter-spacing: 0;
						font-weight: 500;
					}

					.titleBot {
						display: flex;
						text-align: left;
						letter-spacing: 0;
						font-weight: 400;
						font-size: 0.12rem;

						&>div {
							flex: 1;
						}

						.textF {
							color: #8C8C8C;
						}

						.textS {
							align-items: center;
							color: #262626;
						}
					}
				}
			}

			.dividers {
				margin: 0 5%;
				height: 0.001rem;
				border-bottom: 0.02rem dashed #fff;
			}

			.recommend {
				display: flex;
				justify-content: space-between;
				justify-items: center;
				padding: 0.16rem 0.12rem;
				box-shadow: inset 0 0.005rem 0 0 rgba(0, 0, 0, 0.08);

				.textL {
					max-width: 70%;
					margin: auto 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.textR {
					color: #026DFF;
					padding: 0.045rem 0.285rem;
					border-radius: 0.15rem;
					border: 0.01rem solid #026DFF;
				}
			}
		}
	}
</style>
