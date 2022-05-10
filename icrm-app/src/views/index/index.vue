<template>
  <div class="home">
    <!-- <nav-bar style=""/> -->
    <div class="fixedPlace">
      <div class="topBox"></div>
      <div class="topMsg">
        <div class="topUserMsg">
          <div class="topUserInfo">
            <div class="userAvatar"></div>
            <div class="userName">{{ $store.state.userMsg.empname }}</div>
          </div>
          <div class="topTips">慎在于畏小，智在于治大。</div>
        </div>
        <div class="topMsgBar">
          <div class="msgBarItem" @click="$router.push('/chenxihui')">
            <i class="msg-icon icon-meeting"></i>晨夕会
          </div>
          <i class="msg-line"></i>
          <div class="msgBarItem">
            <i class="msg-icon icon-todo"></i>必办<span class="msgCount1">1</span>
          </div>
          <i class="msg-line"></i>
          <div class="msgBarItem" @click="$router.push('/msgPage')">
            <i class="msg-icon icon-message"></i>消息<span v-if="messageNum > 0" :class="messageNum > 9 ? 'msgCount2' : 'msgCount1'">{{ showMessageNum }}</span>
          </div>
          <!-- <div class="topRightMsgChild" @click="$router.push('/business')">
						<span v-if="$store.state.userMsg.roleId=='00000004'">{{shangjiNum||"-"}} 条待跟进商机 </span>
						<span v-else>{{shangjiNum||"-"}} 条待分配商机 </span>
						<van-icon name="arrow" />
					</div>
					<div class="topRightMsgChild" @click="$router.push('/msgPage')">
						<span>{{messageNum||"-"}} 条待阅读消息 </span>
						<van-icon name="arrow" />
					</div> -->
        </div>
      </div>
    </div>
    <!-- <div style="width: 100%;background-color: #F8F8F8;"
			:style="{height: $store.state.userMsg.roleId=='00000006'?'1.49rem':'2.19rem'}"></div> -->
    <div style="width: 100%; height: 0.5rem; background-color: #f8f8f8"></div>
    <div class="mainContent">
      <div class="selectTimebar">
        <org-list type="0" showText="请选择机构" v-if="$store.state.userMsg.roleId!='00000004'" @activeOrg="khgmActiveOrg" />
        <div class="currentDate">当前数据时间：{{ showDate }}</div>
      </div>
      <div class="contentItem week" :class="showWeekDetial ? 'open' : 'close'" v-if="$store.state.userMsg.roleId != '00000006'">
        <div class="weekListTitle">
          <h2>工作日报(3月)</h2>
          <span>* 只展示近7天的数据</span>
        </div>
        <div class="weekList">
          <div class="weekItem" v-for="(week, i) in weekList" :key="'week' + i" @click="showWeek(week)">
            <div class="weekWeek">{{ week.week }}</div>
            <div class="weekDate today" v-if="week.timeStamp === week.todayTimeStamp">
              {{ week.showDate }}
            </div>
            <div class="weekDate future" v-else-if="week.timeStamp > week.todayTimeStamp">
              {{ week.showDate }}
            </div>
            <div class="weekDate" v-else>{{ week.showDate }}</div>
          </div>
        </div>
        <div class="arrow" @click="showWeekDetial = !showWeekDetial">
          <!-- 分割线 -->
          <van-divider><van-icon :name="showWeekDetial ? 'arrow-up' : 'arrow-down'" size="0.22rem" color="#ccc"/></van-divider>
        </div>
        <div v-if="showWeekDetial">
          <div class="hidePageT">
            <div>
              <div class="lText">
                <p class="title">已跟进商机数</p>
                <p class="num">{{titleData.cmrcOpptFollowUpCnt || 0}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">已成交商机数</p>
                <p class="num">{{titleData.cmrcOpptTranxCnt || 0}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">已拜访客户数</p>
                <p class="num">{{titleData.visitCustCnt || 0}}</p>
              </div>
            </div>
          </div>
          <div class="hidePageB">
            <div>
              <div class="lText">
                <p class="title">新增贷款余额(万元)</p>
                <p class="num">{{titleData.addLoanBal || 0}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">新增定期贷款余额(万元)</p>
                <p class="num">{{titleData.addTimeDpsitBal || 0}}</p>
              </div>
            </div>
          </div>
          <div class="hidePageB">
            <div>
              <div class="lText">
                <p class="title">新增贷款余额(万元)</p>
                <p class="num">{{titleData.adCurrDpsitBal || 0}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">新增定期贷款余额(万元)</p>
                <p class="num">{{titleData.addCftBal || 0}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <van-tabs v-model:active="mianTabActive" color="#3399FF" @change="changeMainTab" line-width="30%"
				line-height="2px">
				<van-tab v-for="(item,i) in mainTab" :key="'mainTab'+i">
					<template #title>
						<van-icon :name="item.icon" size="64" />
						<span>{{item.title}}</span>
					</template>
				</van-tab>
			</van-tabs> -->
      <div class="contentItem khgm" v-if="mianTabActive == 0">
        <div class="contentHead">
          <van-icon :name="require('../../assets/image/index_main_lskhs.png')" size="0.2rem"/>
          <h3>客户数</h3>
        </div>
        <!-- <org-list type="0" showText="请选择机构" v-if="$store.state.userMsg.roleId!='00000004'" @activeOrg="khgmActiveOrg" /> -->
        <div class="khgmBox">
          <div class="khgmItemBox" v-for="(item, i) in showData" :key="'khgm' + i">
            <div class="khgmMainTitle">
              {{ item.title }}{{ item.unit }}
              <van-icon style="margin-left: 0.058rem" @click="clickDalong(item.title, item.text)" :name="require('../../assets/image/index_question.png')" size="0.133rem"/>
            </div>
            <div class="khgmValue">{{ item.value0 || "0" }}</div>
            <div class="khgmTitle">
              <span class="khgmSubTitle">较上日</span>
              <div class="khgmSubValue">
                <p>{{ item.value1 || "0" }}</p>
                <van-icon
                  v-if="
                    !item.value1 || item.value1 == '0' || item.value1 == '0.00'
                  "
                  :name="require('../../assets/image/index_main_numLine.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else-if="item.value1[0] == '-'"
                  :name="require('../../assets/image/index_main_numDown.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else
                  :name="require('../../assets/image/index_arrow_top.png')"
                  size="0.16rem"
                />
              </div>
            </div>
            <div class="khgmTitle">
              <span class="khgmSubTitle">较上月</span>
              <div class="khgmSubValue">
                <p>{{ item.value2 || "0" }}</p>
                <van-icon
                  v-if="
                    !item.value2 || item.value2 == '0' || item.value2 == '0.00'
                  "
                  :name="require('../../assets/image/index_main_numLine.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else-if="item.value2[0] == '-'"
                  :name="require('../../assets/image/index_main_numDown.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else
                  :name="require('../../assets/image/index_arrow_top.png')"
                  size="0.16rem"
                />
              </div>
            </div>
            <div class="khgmTitle">
              <span class="khgmSubTitle">较年初</span>
              <div class="khgmSubValue">
                <p>{{ item.value3 || "0" }}</p>
                <van-icon
                  v-if="
                    !item.value3 || item.value3 == '0' || item.value3 == '0.00'
                  "
                  :name="require('../../assets/image/index_main_numLine.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else-if="item.value3[0] == '-'"
                  :name="require('../../assets/image/index_main_numDown.png')"
                  size="0.16rem"
                />
                <van-icon
                  v-else
                  :name="require('../../assets/image/index_arrow_top.png')"
                  size="0.16rem"
                />
              </div>
            </div>
            <!-- <van-icon class="khgmIcon" :name="item.icon" size="0.24rem" /> -->
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true"/></div>
      <!-- 客户增长趋势 -->
      <div class="contentItem">
        <div class="custStyle">
          <selectors :title="['客户增长趋势', '客户服务等级']" @change="changeL"></selectors>
          <selectors :title="['日', '月']" :typeP="1" @change="changeR" v-if="custType == 0"></selectors>
        </div>
        <!-- 客户增长趋势-图 -->
        <echartHistogram ref="Histogram" :dataArr="['全部','财富客群','贷款客群','代发客群','基础客群','商户客群']" :selectTime="selectTime" :barData="barData" @change="barChange" @change2="barChange2" :timeUnit="timeUnit" v-show="custType === 0"></echartHistogram>
        <!-- 客户服务等级-图 -->
        <echarts-funnel v-show="custType === 1" :data="custLvDisDiaData" ref="custLvDisDiaChart"/>
      </div>
      <!-- AUM余额(万元) -->
      <div class="contentItem" style="margin-top: 0.12rem">
        <TitleCard :title="['AUM余额','AUM日均']" :text="['AUM考核口径不包括储蓄存款','AUM考核口径不包括储蓄存款']" :arr="peCstAum" @change="peCstAumChange"></TitleCard>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true"/></div>
      <!-- AUM余额分布图 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">AUM余额分布图</span>
          <span class="btn" @click="aumClick">
            <van-icon :name="require('@/assets/image/list_1.png')" size="0.32rem" v-if="aumFlag == 0"/>
            <van-icon :name="require('@/assets/image/list_2.png')" size="0.32rem" v-else/>
          </span>
        </div>
        <!-- 列表 -->
        <div v-show="aumFlag == 0">
          <Table :listLabel="[listLabel,listLabels][listType]" :listData="[listData,listDatas][listType]" :listType="listType"></Table>
        </div>
        <echarts-pie v-show="aumFlag == 1" unit="万元" :data="aumDisDiaData" ref="aumDisDiaChart"/>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true"/></div>
      <!-- AUM余额-增长趋势 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">增长趋势</span>
          <selectors :title="['日', '月']" :typeP="1" @change="changeAum"></selectors>
        </div>
        <echartHistogram :type="1" ref="Histogram2" :dataArr="['全部','活期存款','定期存款','理财','基金','保险','信托']" :numType="'余额总计'" :selectTime="selectTime" :barData="aumData" @change="aumChange" @change2="aumChange2" :timeUnit="timeUnit2"></echartHistogram>
      </div>
      <!-- 贷款余额(万元) -->
      <div class="contentItem" style="margin-top: 0.12rem">
        <TitleCard :title="['贷款余额','贷款日均']" :arr="peCstLoan"></TitleCard>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true"/></div>
      <!-- 贷款余额-增长趋势 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">增长趋势</span>
          <selectors :title="['日', '月']" :typeP="1" @change="changeLoan"></selectors>
        </div>
        <echartHistogram :type="1" ref="Histogram3" :dataArr="['全部','按揭贷款','消费贷款','经营贷款']" :numType="'余额总计'" :selectTime="selectTime" :barData="loanData" @change="loanChange" @change2="loanChange2" :timeUnit="timeUnit3"></echartHistogram>
      </div>


      <!-- 另外一半 -->
      <div class="zbst" v-if="mianTabActive == 1">
        <org-list
          class="zbstChooseOrg"
          ref="zbstOrg"
          type="1"
          showText="选择机构"
          v-if="$store.state.userMsg.roleId != '00000004'"
          @activeOrg="zbstActiveOrg"
        />
        <van-tabs
          v-model:active="zbstTabActive"
          @change="changeZBSTTab"
          type="card"
          color="#3399FF"
        >
          <van-tab
            v-for="(item, i) in [
              'AUM分布图(单位:万元)',
              '客户等级分布图(单位:人)',
              '客户服务等级分布图(单位:人)',
            ]"
            :key="'zbstTab' + i"
            :title="item"
          />
        </van-tabs>
        <echarts-pie
          v-show="zbstTabActive == 0"
          title="AUM分布图"
          :data="aumDisDiaData"
          unit="万元"
          ref="aumDisDiaChart"
        />
        <echarts-funnel
          v-show="zbstTabActive == 1"
          title="客户等级分布图"
          :data="custLvDisDiaData"
          ref="custLvDisDiaChart"
        />
        <echarts-funnel
          v-show="zbstTabActive == 2"
          title="客户服务等级分布图"
          :data="serveLvDisDiaData"
          ref="serveLvDisDiaChart"
        />
        <echarts-line
          title="客户数分布图(单位:人)"
          :data="custNumDisDiaData"
          :date="custNumDisDiaDate"
          ref="custNumDisDiaChart"
        />
      </div>
      <van-dialog v-model:show="showWeekReportBox" :title="weekReportTitle">
        <div class="weekReportList">
          <div class="weekReportItem" v-for="(item, i) in weekReportDetail" :key="'weekReportItem' + i">
            <div class="weekReportTitle">{{ item.title }}</div>
            <div class="weekReportValue">{{ item.value }}</div>
          </div>
        </div>
      </van-dialog>
      <van-dialog v-model:show="clickDalongShow" :title="dalongShow.title" theme="round-button" confirmButtonColor="#026DFF" class="dialogBox">
        <div class="diloag">
          <div class="diloagItem">
            <p v-for="(item, index) in dalongShow.text" :key="index">{{item}}</p>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { formatNum, formatNums } from "../../api/common.js";
import {
 queryBusiDt,
 queryHomeDayReportList,
 queryHomeOrgDayReportList,
 queryHomPeCstAum,
 queryHomPeCstBalDgrm,
 queryHomCusts,
 queryAst,
 queryHomPeCstSvrLvlDgrm,
 queryCustomertrends,
 queryAUMGrowthTrend,
 queryLoanGrowthTrend
} from "../../request/index.js";
import { queryCommercialOpportunityCount } from "../../request/market.js";
import { queryWarningRmdMgtSum } from "../../request/product.js";
import { Toast, Dialog } from "vant";
import echartsPie from "../../components/common/echarts-pie.vue";
import echartsLine from "../../components/common/echarts-line.vue";
import echartsFunnel from "../../components/common/echarts-funnel.vue";
import selectors from "./components/selectors.vue"
import echartHistogram from "./components/echart-Histogram.vue"
import TitleCard from "@/views/index/components/TitleCard.vue"
import Table from "@/views/index/components/Table.vue"
import moment from "moment"
export default {
  components: {
    echartsPie,
    echartsLine,
    echartsFunnel,
    selectors,
    echartHistogram,
    TitleCard,
    Table
  },
  data() {
    return {
      dataDate: "",
      weekList: [],
      shangjiNum: "",
      messageNum: 0,
      showWeekDetial: false,
      showMessageNum: "",
      showWeekReportBox: false,
      clickDalongShow: false,
      dalongShow: {
        title: '测试',
        text: ['内容很随意']
      },
      listType: 0,
      weekReportDetail: [],
      weekReportTitle: "",
      mainTab: [
        {
          title: "客户概貌",
          icon: require("../../assets/image/index_main_khgm.png"),
        },
        {
          title: "指标视图",
          icon: require("../../assets/image/index_main_zbst.png"),
        },
      ],
      mianTabActive: 0,
      zbstTabActive: 0,
      showData: [
        {
          title: "零售客户数",
          unit: "(人)",
          text: ['客户经理查看管户客户数据，管理岗查看辖内机构客户数据。'],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        },
        {
          title: "财富客户数",
          unit: "(人)",
          text: ['AUM资产上月月日均≥5万。'],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        },
        {
          title: "贷款客户数",
          unit: "(人)",
          text: ['历史办理过贷款业务且贷款金额≥0。'],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        },
        {
          title: "代发客户数",
          unit: "(人)",
          text: ['本年度代发达三次且单笔金额≥500元。'],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        },
        {
          title: "基础客户数",
          unit: "(人)",
          text: [
            '（1）本机构新增AUM资产年日均≥1000元（含储蓄存款）或2022年前   AUM资产年日均＜1000元、2022年AUM资产年日均≥1000元的零售客户数按1个客户计算，满足以下条件，按系数计算：当年新增信用卡绑定借记卡还款客户并还款一次或2022年前绑定但未还款、2022年还款一次的，按新增0.1个客户计算；',
            '（2）本机构本年代发的客户且满足代发次数≥3次、代发金额≥500元，按1个客户计算；',
            '（3）同一客户同时满足第1点、第2点的，按2个客户计算；',
            '（4）信用卡新激活的个人客户(1个客户新增多张激活卡仅按一个有效户计算，存量未激活客户新激活按一个有效户计算，存量已激活客户新办卡且激活不算新客户）。同一客户在多个机构开立账户的，按1个统计；   借钱花等虚拟信用卡业务新增客户有过取款按一个客户计算（不含虚拟随用金及虚拟爱购卡等非实体卡片）；若一个客户同时属于信用卡及虚拟信用卡业务有效客户，满足新户条件在后的按0.5个客户计算；',
            '（5）网络进件、机构发展合伙人营销、机构自建信用卡直销团队营销的信用卡激活客户数全部计入激活机构或营销机构。'
          ],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        },
        {
          title: "商户客户数",
          unit: "(人)",
          text: [
            '（1）商户收款累计交易天数大于等于12天，且付款人不为同一人；',
            '（2）商户年度累计交易金额大于等于2000元；',
            '（3）结算账户为个人账户的，个人账户AUM资产（含储蓄存款）年日均大于等于1000元；结算账户为单位账户的，单位账户存款年日均大于等于1000元。'
          ],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        }
      ],
      aumDisDiaData: [],
      custLvDisDiaData: [],
      serveLvDisDiaData: [],
      custNumDisDiaData: [],
      custNumDisDiaDate: [],
      timeUnit: 0,
      timeUnit2: 0,
      timeUnit3: 0,
      custType: 0,
      aumFlag: 0,
      listLabel: [
        { label: '类型', align: 'left' },
        { label: '金额(万元)', align: 'right' },
        { label: '较上日(万元)', align: 'right' },
        { label: '较上月(万元)', align: 'right' },
        { label: '较年初(万元)', align: 'right' },
      ],
      listLabels: [
        { label: '类型', align: 'left' },
        { label: '金额(万元)', align: 'right' },
        { label: '较上月(万元)', align: 'right' },
        { label: '较年初(万元)', align: 'right' },
      ],
      listData: [
        { name: '活期存款余额', a: '', b: '', c: '', d: '' },
        { name: '定期存款余额', a: '', b: '', c: '', d: '' },
        { name: '理财余额', a: '', b: '', c: '', d: '' },
        { name: '基金余额', a: '', b: '', c: '', d: '' },
        { name: '保险余额', a: '', b: '', c: '', d: '' },
        { name: '信托余额', a: '', b: '', c: '', d: '' },
        { name: '合计', a: '', b: '', c: '', d: '' },
      ],
      listDatas: [
        { name: '活期存款余额', a: '', b: '', c: '' },
        { name: '定期存款余额', a: '', b: '', c: '' },
        { name: '理财余额', a: '', b: '', c: '' },
        { name: '基金余额', a: '', b: '', c: '' },
        { name: '保险余额', a: '', b: '', c: '' },
        { name: '信托余额', a: '', b: '', c: '' },
        { name: '合计', a: '', b: '', c: '' }
      ],
      barData: {},
      aumData: {},
      loanData: {},
      barDataxData: [],
      aumDataxData: [],
      loanDataxData: [],
      xAxis: [],
      selectTime: [],
      peCstAum: [[],[]],
      peCstLoan: [[],[]],
      titleData: {}
    };
  },
  computed: {
    showDate() {
      return `${this.dataDate.slice(0, 4)}.${this.dataDate.slice(4,6)}.${this.dataDate.slice(6, 8)}`;
    },
  },
  methods: {
    showWeek(week) {
      this.weekReportTitle = `${week.date.slice(0, 4)}-${week.date.slice(4,6)}-${week.date.slice(6, 8)} 工作日报`;
      this.queryReportDetail(week.date)
    },
    queryReportDetail(date){
      Toast.loading({message: "正在加载",forbidClick: true,duration: 0});
      var setWeekReportDetail = (res) => {
        console.log('res',res)
        if (res.data && res.data.records && res.data.records.length) {
          var weekReportDetail = res.data.records[0];
          this.titleData = {
            cmrcOpptFollowUpCnt: weekReportDetail.cmrcOpptFollowUpCnt,             // 已跟进商机数
            cmrcOpptTranxCnt: weekReportDetail.cmrcOpptTranxCnt,                   // 已成交商机数
            visitCustCnt: weekReportDetail.visitCustCnt,                           // 已拜访商机数
            addLoanBal: formatNum(weekReportDetail.addLoanBal / 10000),            // 新增贷款余额(万元)
            addTimeDpsitBal: formatNum(weekReportDetail.addTimeDpsitBal / 10000),  // 新增定期余额(万元)
            adCurrDpsitBal: formatNum(weekReportDetail.adCurrDpsitBal / 10000),    // 新增活期存款余额(万元)
            addCftBal: formatNum(weekReportDetail.addCftBal / 10000),              // 新增理财余额(万元)
          }
          Toast.clear();
          this.showWeekDetial= true
        } else {
          Toast.fail("日报数据为空");
        }
      };
      if (this.$store.state.userMsg.roleId == "00000004") {
        queryHomeDayReportList({etlDt: date},(res) => {
          setWeekReportDetail(res);
        });
      } else {
        queryHomeOrgDayReportList({etlDt: date},(res) => {
          setWeekReportDetail(res);
        });
      }
    },
    getKHGMMsg(dataEncode) {
      let body = {
        etlDt: this.dataDate,
        dataEncode: dataEncode || "",
      }
      queryHomPeCstAum(body,(res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.peCstAum = [ // 待测试
              [
                dataObj.aumBal,                 // AUM余额
                dataObj.aumBalToYstd,           // AUM余额较上日
                dataObj.aumBalToLastMonth,      // AUM余额较上月
                dataObj.aumBalToBegng           // AUM余额较年初
              ],
              [
                dataObj.aumYearAvg,             // AUM日均
                dataObj.aumYearAvgToLm,         // AUM日均较上月
                dataObj.aumYearAvgToYy,         // AUM日均较年初
              ]
            ]
            this.peCstLoan = [
              [
                dataObj.loanBal,                  // 贷款余额
                dataObj.loanBalToYstd,            // 贷款余额较上日
                dataObj.loanBalToLastMonth,       // 贷款余额较上月(暂无)
                dataObj.loanBalToBegng            // 贷款余额较年初(暂无)
              ],
              [
                dataObj.loanMonthAvg,             // 贷款月日均
                dataObj.loanMonthAvgToLm,         // 贷款月日均较上月
                dataObj.loanMonthAvgToLy          // 贷款月日均较年初
              ]
            ]
            this.listData = [
              { name: '活期存款余额', a: dataObj.currDpsitBal, b: dataObj.currDpsitBalToYstd, c: dataObj.currDpsitBalToLastMonth, d: dataObj.currDpsitBalToBegng },
              { name: '定期存款余额', a: dataObj.timeDpsitBal, b: dataObj.timeDpsitBalToYstd, c: dataObj.timeDpsitBalToLastMonth, d: dataObj.timeDpsitBalToBegng },
              { name: '理财余额', a: dataObj.cftBal, b: dataObj.cftBalToYstd, c: dataObj.cftBalToLastMonth, d: dataObj.cftBalToBegng },
              { name: '基金余额', a: dataObj.fndBal, b: dataObj.fndBalToYstd, c: dataObj.fndBalToLastMonth, d: dataObj.fndBalToBegng },
              { name: '保险余额', a: dataObj.insBal, b: dataObj.insBalToYstd, c: dataObj.insBalToLastMonth, d: dataObj.insBalToBegng },
              { name: '信托余额', a: dataObj.entrstBal, b: dataObj.entrstBalToYstd, c: dataObj.entrstBalToLastMonth, d: dataObj.entrstBalToBegng },
              { name: '合计', a: dataObj.aumBal, b: dataObj.aumBalToYstd, c: dataObj.aumBalToLastMonth, d: dataObj.aumBalToBegng },
            ]
            this.listDatas = [
              { name: '活期存款余额', a: dataObj.currDpsitYearAvg, b: dataObj.currDpsitYearAvgToLm, c: dataObj.currDpsitYearAvgToLy },
              { name: '定期存款余额', a: dataObj.timeDpsitYearAvg, b: dataObj.timeDpsitYearAvgToLm, c: dataObj.timeDpsitYearAvgToLy },
              { name: '理财余额', a: dataObj.cftYearAvg, b: dataObj.cftYearAvgToLm, c: dataObj.cftYearAvgToLy },
              { name: '基金余额', a: dataObj.fndYearAvgToLm, b: dataObj.fndYearAvgToLm, c: dataObj.fndYearAvgToLy },
              { name: '保险余额', a: dataObj.insYearAvg, b: dataObj.insYearAvgToLm, c: dataObj.insYearAvgToLy },
              { name: '信托余额', a: dataObj.entrstYearAvg, b: dataObj.entrstYearAvgToLm, c: dataObj.entrstYearAvgToLy },
              { name: '合计', a: dataObj.aumYearAvg, b: dataObj.aumYearAvgToLm, c: dataObj.aumYearAvgToYy },
            ]
            for (let item of this.showData) {
              switch (item.title) {
                case "零售客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.custCnt,
                    dataObj.custCntToYstd,
                    dataObj.custCntToLastMonth,
                    dataObj.custCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
                case "财富客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.vipCustCnt,
                    dataObj.vipCustCntToYstd,
                    dataObj.vipCustCntToLastMonth,
                    dataObj.vipCustCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
                case "贷款客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.loanCustCnt,
                    dataObj.loanCustCntToYstd,
                    dataObj.loanCustCntToLastMonth,
                    dataObj.loanCustCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
                case "代发客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.agentCustCnt,
                    dataObj.agentCustCntToYstd,
                    dataObj.agentCustCntToLastMonth,
                    dataObj.agentCustCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
                case "基础客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.basicCstCnt,
                    dataObj.basicCstCntToYstd,
                    dataObj.basicCstCntToLastMonth,
                    dataObj.basicCstCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
                case "商户客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.merntCstCnt,
                    dataObj.merntCstCntToYstd,
                    dataObj.merntCstCntToLastMonth,
                    dataObj.merntCstCntToBegng,
                  ].map((item, index) => {
                    return item <= 0 || index == 0 ? formatNums(item) : `+${formatNums(item)}`;
                  });
                  break;
              }
            }
          } else {
            Toast.fail("客户概貌信息数据为空");
          }
        }
      );
    },
    getAumDisDiaData(dataEncode) {
      queryHomPeCstBalDgrm(
        {
          etlDt: this.dataDate,
          dataEncode: dataEncode || "",
        },
        (res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.aumDisDiaData = [
              {
                name: "定期存款余额",
                value: Number((dataObj.timeDpsitBal / 10000).toFixed(2)),
              },
              {
                name: "活期存款余额",
                value: Number((dataObj.currDpsitBal / 10000).toFixed(2)),
              },
              {
                name: "理财余额",
                value: Number((dataObj.cftBal / 10000).toFixed(2)),
              },
              {
                name: "信托余额",
                value: Number((dataObj.entrstBal / 10000).toFixed(2)),
              },
              {
                name: "基金余额",
                value: Number((dataObj.fndBal / 10000).toFixed(2)),
              },
              {
                name: "保险余额",
                value: Number((dataObj.insBal / 10000).toFixed(2)),
              },
            ];
            this.$nextTick(() => {
              this.$refs.aumDisDiaChart.drawEcharts();
            });
          } else {
            Toast.fail("AUM分布图数据为空");
          }
        }
      );
    },
    getCustLvDisDiaData(dataEncode) {
      queryAst(
        {
          etlDt: this.dataDate,
          dataEncode: dataEncode || "",
        },
        (res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.custLvDisDiaData = [
              {
                name: "未达标客户数",
                value: dataObj.norchStdCustCnt.toLocaleString(),
              },
              {
                name: "大众客户数",
                value: dataObj.ordnryCustCnt.toLocaleString(),
              },
              {
                name: "理财客户数",
                value: dataObj.cftCustCnt.toLocaleString(),
              },
              {
                name: "金卡客户数",
                value: dataObj.gdCardCustCnt.toLocaleString(),
              },
              {
                name: "白金客户数",
                value: dataObj.platinumCustCnt.toLocaleString(),
              },
              {
                name: "钻石客户数",
                value: dataObj.diamdCustCnt.toLocaleString(),
              },
              {
                name: "私行客户数",
                value: dataObj.pbssCustCnt.toLocaleString(),
              },
            ];
            this.$nextTick(() => {
              this.$refs.custLvDisDiaChart.drawEcharts();
            });
          } else {
            Toast.fail("客户等级分布图数据为空");
          }
        }
      );
    },
    getServeLvDisDiaData(dataEncode) {
      queryHomPeCstSvrLvlDgrm(
        {
          etlDt: this.dataDate,
          dataEncode: dataEncode || "",
        },
        (res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.serveLvDisDiaData = [
              {
                name: "未达标客户数",
                value: dataObj.norchStdCustCnt.toLocaleString(),
              },
              {
                name: "大众客户数",
                value: dataObj.ordnryCustCnt.toLocaleString(),
              },
              {
                name: "理财客户数",
                value: dataObj.cftCustCnt.toLocaleString(),
              },
              {
                name: "金卡客户数",
                value: dataObj.gdCardCustCnt.toLocaleString(),
              },
              {
                name: "白金客户数",
                value: dataObj.platinumCustCnt.toLocaleString(),
              },
              {
                name: "钻石客户数",
                value: dataObj.diamdCustCnt.toLocaleString(),
              },
              {
                name: "私行客户数",
                value: dataObj.pbssCustCnt.toLocaleString(),
              },
            ];
            this.$nextTick(() => {
              this.$refs.serveLvDisDiaChart.drawEcharts();
            });
          } else {
            Toast.fail("客户服务等级分布图数据为空");
          }
        }
      );
    },
    getCustNumDisDiaData() {
      queryHomCusts({etlDt: this.dataDate},(res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records.reverse();
            this.custNumDisDiaData = [
              {
                name: "VIP客户数",
                value: dataObj.map((item) => item.vipCustCnt),
              },
              {
                name: "代发客户数",
                value: dataObj.map((item) => item.agentCustCnt),
              },
              {
                name: "贷款客户数",
                value: dataObj.map((item) => item.loanCustCnt),
              },
              {
                name: "新客客户数",
                value: dataObj.map((item) => item.newCustCnt),
              },
            ];
            this.custNumDisDiaDate = dataObj.map((item) =>
              item.etlDt.slice(4, 8)
            );
            this.$nextTick(() => {
              this.$refs.custNumDisDiaChart.drawEcharts();
            });
          } else {
            Toast.fail("客户数分布图数据为空");
          }
        }
      );
    },
    changeMainTab() {
      this.zbstTabActive = 0;
      switch (this.mianTabActive) {
        case 0:
          this.getKHGMMsg();
          break;
        case 1:
          this.getAumDisDiaData();
          this.getCustNumDisDiaData();
          break;
      }
    },
    changeZBSTTab() {
      if (this.$refs.zbstOrg) {
        this.$refs.zbstOrg.activeOrg();
      } else {
        this.zbstActiveOrg({value: ""});
      }
    },
    khgmActiveOrg(orgValue) {
      this.getKHGMMsg(orgValue.value);
    },
    zbstActiveOrg(orgValue) {
      switch (this.zbstTabActive) {
        case 0:
          this.getAumDisDiaData(orgValue.value);
          break;
        case 1:
          this.getCustLvDisDiaData(orgValue.value);
          break;
        case 2:
          this.getServeLvDisDiaData(orgValue.value);
          break;
      }
    },
    /* 客户增长趋势/客户服务等级 */
    changeL(data){
      this.custType = data
      if(data == 1) {
        this.$nextTick(()=>{
          this.getCustLvDisDiaData()
        })
      }else{
        this.customertrends(this.dataDate)
        this.timeUnit = 0
      }
    },
    /* 日0/月1 */
    changeR(data){
      this.timeUnit = data
      this.$refs.Histogram.init()
      this.customertrends(this.dataDate)
    },
    /* AUM余额分部日月切换 */
    changeAum(data){
      this.timeUnit2 = data
      this.$refs.Histogram2.init()
      this.aumGrowthTrend(this.dataDate)
    },
    /* 贷款日月切换 */
    changeLoan(data){
      this.timeUnit3 = data
      this.$refs.Histogram3.init()
      this.loanGrowthTrend(this.dataDate)
    },
    /* AUM余额分布图切换 */
    aumClick(){
      if(this.aumFlag == 0){
        this.aumFlag = 1
        this.$nextTick(()=>{
          this.getAumDisDiaData()
        })
      }else{
        this.aumFlag = 0
      }
    },
    /* 查询客户增长趋势 */
    customertrends(time){
      let body = {
        judge: '', // 0的时候为月
        pageNum: '1',
        pageSize: '31'
      }
      let xAxis = []
      // 根据查询日期 日/月 生成一条X轴
      if(this.timeUnit == 0){
        body.etlDt = moment(time).format('YYYYMM')
        let lastDay = Number(moment(time).endOf('month').format('DD')) // 计算该月有多天
        for(let i = lastDay - 1; i >= 0; i--){
          let obj = {
            value: moment(time).endOf('month').subtract(i, 'day').format('DD'), // 需要展示的时间
            time: moment(time).endOf('month').subtract(i, 'day').format('YYYYMMDD') // 保留原时间戳
          }
          xAxis.push(obj)
        }
      }else{
        body.etlDt = moment(time).format('YYYYMMDD')
        body.judge = '0'
        for(let i = 11; i >= 0; i--){
          let obj = {
            value: moment(time).subtract(i, 'month').format('MM'),  // 需要展示的时间
            time: moment(time).subtract(i, 'month').format('YYYYMM')    // 保留原时间戳 往前推12个月
          }
          xAxis.push(obj)
        }
      }
      queryCustomertrends(body, (res) => {
        let data = res.data.records
        // 零售客户数（全部), 财富客户数, 贷款客户数, 代发客户数, 基础客户数, 商户客户数
        let arr = ['custCnt','vipCustCnt','loanCustCnt','agentCustCnt','basicCstCnt','merntCstCnt']
        let xData = [[],[],[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach(item => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  value: item[name] || 0,
                  toYstd: item[`${name}${['ToYstd','ToLastMonth'][this.timeUnit]}`] || 0,
                  time: itemX.time
                }
                xData[index].push(obj)
              })
              flag = false
            }
          })
          if(flag){
            arr.forEach((n,index)=> {
                let obj = {
                  value: 0,
                  toYstd: 0,
                  time: itemX.time
                }
                xData[index].push(obj)
            })
          }
        })
        this.barDataxData = xData
        this.xAxis = xAxis
        this.barData = {
          series : xData[0],
          xAxis: xAxis,
        }
      })
    },
    /* 查询AUM增长趋势 */
    aumGrowthTrend(time){
      let body = {
        judge: '', // 0的时候为月
        pageNum: '1',
        pageSize: '31'
      }
      let xAxis = []
      // 根据查询日期 日/月 生成一条X轴
      if(this.timeUnit2 == 0){
        body.etlDt = moment(time).format('YYYYMM')
        let lastDay = Number(moment(time).endOf('month').format('DD')) // 计算该月有多天
        for(let i = lastDay - 1; i >= 0; i--){
          let obj = {
            value: moment(time).endOf('month').subtract(i, 'day').format('DD'), // 需要展示的时间
            time: moment(time).endOf('month').subtract(i, 'day').format('YYYYMMDD') // 保留原时间戳
          }
          xAxis.push(obj)
        }
      }else{
        body.etlDt = moment(time).format('YYYYMMDD')
        body.judge = '0'
        for(let i = 11; i >= 0; i--){
          let obj = {
            value: moment(time).subtract(i, 'month').format('MM'),  // 需要展示的时间
            time: moment(time).subtract(i, 'month').format('YYYYMM')    // 保留原时间戳 往前推12个月
          }
          xAxis.push(obj)
        }
      }
      queryAUMGrowthTrend(body, (res) => {
        let data = res.data.records
        // 全部, 活期存款, 定期存款, 理财, 基金, 保险, 信托
        let arr = ['aumBal','currDpsitBal','timeDpsitBal','cftBal','fndBal','insBal','entrstBal']
        let xData = [[],[],[],[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach(item => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  value: item[name]/10000 || 0,
                  toYstd: item[`${name}${['ToYstd','ToLastMonth'][this.timeUnit2]}`]/10000 || 0,
                  time: itemX.time
                }
                xData[index].push(obj)
              })
              flag = false
            }
          })
          if(flag){
            arr.forEach((n,index)=> {
                let obj = {
                  value: 0,
                  toYstd: 0,
                  time: itemX.time
                }
                xData[index].push(obj)
            })
          }
        })
        this.aumDataxData = xData
        this.xAxis = xAxis
        this.aumData = {
          series : xData[0],
          xAxis: xAxis,
        }
      })
    },
    /* 贷款余额增长趋势 */
    loanGrowthTrend(time){
      let body = {
        judge: '', // 0的时候为月
        pageNum: '1',
        pageSize: '31'
      }
      let xAxis = []
      // 根据查询日期 日/月 生成一条X轴
      if(this.timeUnit3 == 0){
        body.etlDt = moment(time).format('YYYYMM')
        let lastDay = Number(moment(time).endOf('month').format('DD')) // 计算该月有多天
        for(let i = lastDay - 1; i >= 0; i--){
          let obj = {
            value: moment(time).endOf('month').subtract(i, 'day').format('DD'), // 需要展示的时间
            time: moment(time).endOf('month').subtract(i, 'day').format('YYYYMMDD') // 保留原时间戳
          }
          xAxis.push(obj)
        }
      }else{
        body.etlDt = moment(time).format('YYYYMMDD')
        body.judge = '0'
        for(let i = 11; i >= 0; i--){
          let obj = {
            value: moment(time).subtract(i, 'month').format('MM'),  // 需要展示的时间
            time: moment(time).subtract(i, 'month').format('YYYYMM')    // 保留原时间戳 往前推12个月
          }
          xAxis.push(obj)
        }
      }
      queryLoanGrowthTrend(body, (res) => {
        let data = res.data.records
        // 全部, 按揭贷款, 消费贷款, 经营贷款
        let arr = ['loanBal','mrtgLoanBal','cnsmLoanBal','corprtnLoanBal']
        let xData = [[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach((item, index) => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  value: item[name]/10000 || 0,
                  time: itemX.time
                }
                if(name == 'loanBal'){
                  obj.toYstd = item[`${name}${['ToYstd','ToLastMonth'][this.timeUnit3]}`]/10000 || 0
                }else{
                  obj.toYstd = item[`${name.replace('Bal','')}${['ToYstd','ToLm'][this.timeUnit3]}`]/10000 || 0
                }
                xData[index].push(obj)
              })
              flag = false
            }
          })
          if(flag){
            arr.forEach((n,index)=> {
                let obj = {
                  value: 0,
                  toYstd: 0,
                  time: itemX.time
                }
                xData[index].push(obj)
            })
          }
        })
        this.loanDataxData = xData
        this.xAxis = xAxis
        this.loanData = {
          series : xData[0],
          xAxis: xAxis,
        }
      })
    },
    // 选择title
    barChange(v){
      this.barData = {
        series : this.barDataxData[v],
        xAxis: this.xAxis
      }
    },
    // 查询选择的月份的数据
    barChange2(v){
      this.customertrends(this.selectTime[v].key)
    },
    // 选择title
    aumChange(v){
      this.aumData = {
        series : this.aumDataxData[v],
        xAxis: this.xAxis
      }
    },
    // 查询选择的月份的数据
    aumChange2(v){
      this.aumGrowthTrend(this.selectTime[v].key)
    },
    // 贷款选择title
    loanChange(v){
      this.loanData = {
        series : this.loanDataxData[v],
        xAxis: this.xAxis
      }
    },
    // 查询选择的月份的数据
    loanChange2(v){
      this.loanGrowthTrend(this.selectTime[v].key)
    },
    /* 提示弹窗 */
    clickDalong(title, text){
      this.clickDalongShow = true
      this.dalongShow = {
        title: title,
        text: text
      }
    },
    /* 贷款余额/日均切换 */
    peCstAumChange(v){
      console.log(v)
      this.listType = v ? 0 : 1
    }
  },
  mounted() {
    queryBusiDt({}, (res1) => {
      if (res1.data) {
        this.dataDate = res1.data.workDate;
        this.selectTime = []
        for(let i = 11; i >= 0; i--){
          let obj = {
            key: moment(this.dataDate).subtract(i, 'month').format('YYYYMM'),
            title: moment(this.dataDate).subtract(i, 'month').format('M月'),
          }
          this.selectTime.push(obj)
        }
        if (this.$store.state.userMsg.roleId == "00000004") {
          var queryCommercialOpportunityCountPostMsg = {
            followUpLab: "2",
          };
        } else {
          var queryCommercialOpportunityCountPostMsg = {
            alctLab: "1",
          };
        }
        queryCommercialOpportunityCount(
          queryCommercialOpportunityCountPostMsg,
          (res2) => {
            this.shangjiNum = res2.data.toLocaleString();
          }
        );
        queryWarningRmdMgtSum(
          {
            stat: "0",
          },
          (res3) => {
            if (res3.data && res3.data.length) {
              this.messageNum = res3.data[0].allSum;
              this.showMessageNum =
                res3.data[0].allSum > 99 ? "99+" : res3.data[0].allSum;
            } else {
              Toast.fail("消息数据为空");
            }
          }
        );
        this.getKHGMMsg();
        this.queryReportDetail(this.dataDate)
        this.customertrends(this.dataDate)
        this.aumGrowthTrend(this.dataDate)
        this.loanGrowthTrend(this.dataDate)
        let todayDate = new Date(`${this.dataDate.slice(0, 4)}-${this.dataDate.slice(4,6)}-${this.dataDate.slice(6, 8)}`);
        this.todayDate = todayDate;
        let sjc = todayDate.getTime();
        this.weekList = [];
        for (var i = 6; i >= 0; i--) {
          var todaySjc = sjc - i * 24 * 60 * 60 * 1000;
          var b = new Date(todaySjc);
          const timeStamp = b.getTime();
          var year = b.getFullYear();
          var month = b.getMonth() + 1;
          var date = b.getDate();
          var day = b.getDay();
          var weeks = ["天", "一", "二", "三", "四", "五", "六"];
          if (month < 10) {
            month = "0" + (b.getMonth() + 1);
          } else {
            month = b.getMonth() + 1;
          }
          if (date < 10) {
            date = "0" + b.getDate();
          }
          // alert(todayDate);
          this.weekList.push({
            week: weeks[day],
            date: String(year) + String(month) + String(date),
            showDate: String(date),
            timeStamp,
            todayTimeStamp: sjc,
          });
        }
      } else {
        Toast.fail("数据日期数据为空");
      }
    });
  },
};
</script>
<style lang="less" scoped>
.aumStyle {
  align-items: center;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: rgba(0,0,0,0.85);
    letter-spacing: 0;
    font-weight: 500;
  }
  .btn {
    // width: 0.32rem;
    // height: 0.32rem;
    // background: #EDEFF2;
    // border: 1px solid rgba(0,0,0,0.02);
    // border-radius: 0.04rem;
    // padding: 0.04rem;
  }
}
.arrow {
  margin-top: 0.1rem;
  width: 100%;
  font-size: 0.12rem;
}
.hidePageT,
.hidePageB {
  display: flex;
  justify-content: space-between;
  &>div {
    display: flex;
    justify-content: space-between;
    .lText {
      text-align: left;
    }
    .rText {
      margin: auto 0;
      width: 0.01rem;
      height: 0.24rem;
      background: rgba(0,0,0,0.08);
    }
  }
  .title {
    font-size: 0.12rem;
    color: #8C8C8C;
    line-height: 0.18rem;
    font-weight: 400;
  }
  .num {
    font-size: 0.2rem;
    color: rgba(0,0,0,0.85);
    line-height: 0.3rem;
    font-weight: 500;
  }
}
.hidePageT {
  padding: 0.12rem 0;
  font-family: PingFangSC-Medium;
  letter-spacing: 0;
  &>div {
    width: 33.33%;
    &:nth-child(2),
    &:nth-child(3) {
      padding-left: 0.12rem;
    }
  }
}
.hidePageB {
  box-shadow: inset 0px 1px 0px 0px rgba(0,0,0,0.04);
  padding: 0.14rem 0;
  &>div {
    width: 50%;
    &:nth-child(2) {
      padding-left: 0.14rem;
    }
  }
}
.dialogBox {
  .diloag {
    text-align: left;
    width: 90%;
    margin: auto;
    padding: 0.05rem;
    border-radius: 0.04rem;
    border: solid 1px #e6e6e6;
    .diloagItem {
      overflow-y: auto;
      max-height: 4rem;
      line-height: 0.3rem;
      font-size: 0.13rem;
    }
  }
}
</style>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* border: 0; */
}

.home {
  background-color: #f8f8f8;
}
.fixedPlace {
  width: 100%;
  position: fixed;
  top: 0;
  top: 0;
  left: 0;
  z-index: 9;
}
.fixedPlace .topBox {
  width: 100%;
  background: #fff;
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}
.topMsg {
  width: 100%;
  height: 0.925rem;
  background-color: rgba(255, 255, 255, 1);
  font-family: PingFangSC-Regular;
}

.topUserMsg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 0.48rem;
  padding: 0 0.16rem;
  color: rgba(32, 36, 58, 1);
  text-align: left;
  box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);
}

.topUserInfo {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.userAvatar {
  width: 0.24rem;
  height: 0.24rem;
  background-color: #ccc;
  border-radius: 50%;
  overflow: hidden;
}

.userName {
  margin-left: 0.08rem;
  font-size: 0.16rem;
  font-weight: 400;
  color: #20243a;
}

.topTips {
  font-size: 0.12rem;
  color: #8c8c8c;
}

.chenxihui {
  padding: 1px 8px;
  font-size: 0.12rem;
  border: solid 2px #ffffff;
  border-radius: 1rem;
}

.topLeftMsg2 {
  line-height: 0.32rem;
  font-size: 0.13rem;
  white-space: nowrap;
}

.topMsgBar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 0.44rem;
  padding: 0.13rem 0;
}

.msgBarItem {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  color: #8c8c8c;
  font-size: 0.12rem;
  font-weight: 400;
}

.msg-line {
  width: 0.01rem;
  height: 0.16rem;
  box-shadow: inset -1px 0px 0px 0px rgba(0, 0, 0, 0.08);
}

.msg-icon {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  margin-right: 0.04rem;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100%;
}

.icon-meeting {
  background-image: url(../../assets/image/index_main_todoMessage.png);
}

.icon-todo {
  background-image: url(../../assets/image/index_main_todoMessage.png);
}

.icon-message {
  background-image: url(../../assets/image/index_main_todoMessage.png);
}

.msgCount1 {
  width: 0.16rem;
  height: 0.16rem;
  padding: 0 0.03rem;
  margin-left: 0.08rem;
  color: #fff;
  background-color: #ed3b3c;
  border-radius: 0.5rem;
}

.msgCount2 {
  height: 0.16rem;
  padding: 0 0.05rem;
  margin-left: 0.08rem;
  color: #fff;
  background-color: #ed3b3c;
  border-radius: 0.5rem;
}

.mainContent {
  padding: 0 0.12rem;
  background-color: #f8f8f8;
}

.selectTimebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 0.56rem;
}
.currentDate {
  font-size: 0.12rem;
  color: #bfbfbf;
}

.topRightMsgChild {
  width: 100%;
  line-height: 0.32rem;
  font-size: 0.13rem;
  text-align: right;
  white-space: nowrap;
}

.contentItem {
  width: 100%;
  padding: 0.12rem;
  background-color: #fff;
  border-radius: 0.08rem;
}
.contentHead {
  display: flex;
  align-items: center;
  height: 0.2rem;
  margin-bottom: 0.11rem;
  text-align: left;
}

.contentHead h3 {
  margin-left: 0.08rem;
  font-family: PingFangSC-Medium;
  font-size: 0.14rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.week {
  margin-bottom: 0.12rem;
}

.week.close {
  height: 1.47rem;
}

.week.open {
  height: 3.69rem;
}

.weekListTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 0.225rem;
}

.weekListTitle h2 {
  font-size: 0.16rem;
  font-weight: 500;
  font-family: PingFangSC-Medium;
}

.weekListTitle span {
  font-size: 0.12rem;
  color: #bfbfbf;
}

.weekList {
  display: flex;
  justify-content: space-between;
  margin-top: 0.155rem;
}

.weekItem {
  width: 0.28rem;
  height: 100%;
  text-align: center;
}

.weekWeek {
  width: 100%;
  height: 0.2rem;
  margin-bottom: 0.13rem;
  font-size: 0.14rem;
  line-height: 1;
  color: #bfbfbf;
}

.weekDate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.28rem;
  height: 0.28rem;
  text-align: center;
  font-size: 0.16rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: #262626;
  line-height: 0.2rem;
}

.weekDate.today {
  border-radius: 50%;
  background-color: rgba(2, 109, 255, 1);
  color: #fff;
}

.weekDate.future {
  color: #bfbfbf;
}

.weekReportList {
  width: 80%;
  margin: 0.1rem auto 0.2rem;
  border: solid 1px #e6e6e6;
}

.weekReportItem {
  display: flex;
  flex-wrap: nowrap;
  line-height: 0.4rem;
  border-bottom: solid 1px #e6e6e6;
  font-size: 0.13rem;
}

.weekReportItem:last-child {
  border: 0;
}

.weekReportTitle {
  width: 50%;
  background-color: #f5f7fb;
  border-right: solid 1px #e6e6e6;
}

.weekReportValue {
  width: 50%;
}

.fixedPlace:deep(.van-tabs) {
  border-bottom: solid 1px #ebebeb;
  height: 0.6rem;
}

.fixedPlace:deep(.van-tabs__wrap) {
  height: calc(0.6rem - 1px);
}

.fixedPlace:deep(.van-tab__text) {
  font-size: 0.16rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.fixedPlace:deep(.van-tab__text .van-icon__image) {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}
.dividers:deep(.van-divider) {
  border: 0 dashed rgba(0, 0, 0, 0.04);
  padding: 0 0.02rem;
  margin: 0.005rem 0;
}
.custStyle {
  font-size: 0.14rem;
  display: flex;
  justify-content: space-between;
}
.khgm,
.zbst {
  width: 100%;
  background-color: #ffffff;
}

.zbst {
  padding-bottom: 0.3rem;
  position: relative;
}

.khgmBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.khgmItemBox {
  width: 1.375rem;
  /* padding: 0.1rem 0.12rem; */
  margin: 0 0.08rem 0.15rem 0;
  text-align: left;
  font-size: 0.15rem;
  border-radius: 0.05rem;
  position: relative;
}

.khgmMainTitle {
  display: flex;
  align-items: center;
  height: 0.18rem;
  font-size: 0.14rem;
  list-style: 0.14rem;
  font-weight: 400;
  color: #8c8c8c;
}

.khgmValue {
  height: 0.25rem;
  margin: 0.07rem 0 0.09rem;
  line-height: 0.25rem;
  font-size: 0.18rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.khgmTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.075rem;
  font-size: 0.12rem;
}

.khgmSubTitle {
  color: #8c8c8c;
}

.khgmSubValue {
  display: flex;
  align-items: center;
  font-weight: 400;
  color: #262626;
}

/* .khgmIcon {
		position: absolute;
		top: 0.09rem;
		right: 0.09rem;
	} */

.zbst:deep(.van-tabs__nav--card) {
  margin: 0 3.5%;
  border-radius: 1rem;
  overflow: hidden;
  height: 0.45rem;
}

.zbst:deep(.van-tabs__wrap) {
  height: 0.45rem;
  padding: 0.1rem 0 0.15rem;
}

.zbst:deep(.van-tab__text) {
  font-size: 0.12rem;
  padding: 0 0.02rem;
  white-space: pre-wrap;
  overflow: visible;
  display: block;
}

.zbstChooseOrg {
  position: absolute;
  top: 0.75rem;
  right: 5.5%;
  z-index: 8;
}
</style>