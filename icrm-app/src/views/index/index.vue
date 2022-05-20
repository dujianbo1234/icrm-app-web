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
          <div class="topTips">{{manifesto}}</div>
        </div>
        <div class="topMsgBar">
          <div class="msgBarItem" @click="$router.push('/chenxihui')">
            <i class="msg-icon icon-meeting"></i>晨夕会
          </div>
          <i class="msg-line"></i>
          <div class="msgBarItem" @click="kaifazhong">
            <i class="msg-icon icon-todo"></i>必办<span class="msgCount1">1</span>
          </div>
          <i class="msg-line"></i>
          <div class="msgBarItem" @click="$router.push('/msgPage')">
            <i class="msg-icon icon-message"></i>消息<span v-if="messageNum > 0" :class="messageNum > 9 ? 'msgCount2' : 'msgCount1'">{{ showMessageNum }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%; height: 0.5rem; background-color: #f8f8f8"></div>
    <div class="mainContent">
      <div class="selectTimebar">
        <org-list type="0" showText="请选择机构" v-if="$store.state.userMsg.roleId!='00000004'" @activeOrg="khgmActiveOrg" />
        <div v-else></div>
        <div class="currentDate">当前数据时间：{{ showDate }}</div>
      </div>
      <div class="contentItem week" :class="showWeekDetial ? 'open' : 'close'" v-if="$store.state.userMsg.roleId != '00000006'">
        <div class="weekListTitle">
          <h2>工作日报({{currentMonth}}月)</h2>
          <span>* 只展示近7天的数据</span>
        </div>
        <div class="weekList" ref="weekList">
          <div class="weekItem" v-for="(item, i) in weekList" :key="'week' + i" @click="showWeek(item)">
            <div class="dateTitle">
              <div class="weekWeek">{{ item.week }}</div>
              <div :class="item.toDay ? 'today' : item.disabe ? 'future' : 'weekDate'">{{ item.showDate }}</div>
            </div>
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
                <p class="num">{{titleData.cmrcOpptFollowUpCntApp}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">已成交商机数</p>
                <p class="num">{{titleData.cmrcOpptTranxCntApp}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">已拜访客户数</p>
                <p class="num">{{titleData.visitCustCntApp}}</p>
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
                <p class="title">新增定期存款余额(万元)</p>
                <p class="num">{{titleData.addTimeDpsitBal || 0}}</p>
              </div>
            </div>
          </div>
          <div class="hidePageB">
            <div>
              <div class="lText">
                <p class="title">新增活期存款余额(万元)</p>
                <p class="num">{{titleData.adCurrDpsitBal || 0}}</p>
              </div>
              <div class="rText"></div>
            </div>
            <div>
              <div class="lText">
                <p class="title">新增理财余额(万元)</p>
                <p class="num">{{titleData.addCftBal || 0}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contentItem khgm">
        <div class="contentHead">
          <van-icon :name="require('../../assets/image/index_main_lskhs.png')" size="0.2rem"/>
          <h3>客户数</h3>
        </div>
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
                <van-icon v-if="   !item.value1 || item.value1 == '0' || item.value1 == '0.00' " :name="require('../../assets/image/index_main_numLine.png')" size="0.16rem"/>
                <van-icon v-else-if="item.value1[0] == '-'" :name="require('../../assets/image/index_arrow_dowm.png')" size="0.16rem"/>
                <van-icon v-else :name="require('../../assets/image/index_arrow_top.png')" size="0.16rem"/>
              </div>
            </div>
            <div class="khgmTitle">
              <span class="khgmSubTitle">较上月</span>
              <div class="khgmSubValue">
                <p>{{ item.value2 || "0" }}</p>
                <van-icon v-if="!item.value2 || item.value2 == '0' || item.value2 == '0.00'" :name="require('../../assets/image/index_main_numLine.png')" size="0.16rem"/>
                <van-icon v-else-if="item.value2[0] == '-'" :name="require('../../assets/image/index_arrow_dowm.png')" size="0.16rem"/>
                <van-icon v-else :name="require('../../assets/image/index_arrow_top.png')" size="0.16rem"/>
              </div>
            </div>
            <div class="khgmTitle">
              <span class="khgmSubTitle">较年初</span>
              <div class="khgmSubValue">
                <p>{{ item.value3 || "0" }}</p>
                <van-icon v-if="!item.value3 || item.value3 == '0' || item.value3 == '0.00'" :name="require('../../assets/image/index_main_numLine.png')" size="0.16rem"/>
                <van-icon v-else-if="item.value3[0] == '-'" :name="require('../../assets/image/index_arrow_dowm.png')" size="0.16rem"/>
                <van-icon v-else :name="require('../../assets/image/index_arrow_top.png')" size="0.16rem"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true" /></div>
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
        <TitleCard :title="['AUM余额','AUM日均']" :arr="peCstAum" @change="peCstAumChange" @clickDalong="clickDalong(' ',['AUM考核口径不包括储蓄存款'])"></TitleCard>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true" /></div>
      <!-- AUM余额分布图 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">{{`资产${['余额','日均'][listType]}分布`}}</span>
          <span @click="aumClick">
            <van-icon :name="require('@/assets/image/list_1.png')" size="0.32rem" v-if="aumFlag == 0"/>
            <van-icon :name="require('@/assets/image/list_2.png')" size="0.32rem" v-else/>
          </span>
        </div>
        <!-- 列表 -->
        <div v-if="aumFlag == 0">
          <Table :listLabel="[listLabel,listLabels][listType]" :listData="[listData,listDatas][listType]" :listType="listType" :lableArr="[['a','b','c', 'd'],['a','b','c']][listType]"></Table>
        </div>
        <echarts-pie v-if="aumFlag == 1" unit="万元" :data="aumDisDiaData" ref="aumDisDiaChart"/>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true" /></div>
      <!-- AUM余额-增长趋势 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">增长趋势</span>
          <selectors :title="['日', '月']" :typeP="1" @change="changeAum" v-if="listType == 0"></selectors>
        </div>
        <echartHistogram :type="1" ref="Histogram2" :dataArr="['全部','活期存款','定期存款','理财','基金','保险','信托']" :numType="'余额总计'" :selectTime="selectTime" :barData="aumData" @change="aumChange" @change2="aumChange2" :timeUnit="timeUnit2"></echartHistogram>
      </div>
      <!-- 贷款余额(万元) -->
      <div class="contentItem" style="margin-top: 0.12rem">
        <TitleCard :title="['贷款余额','贷款日均']" :arr="peCstLoan" @change="peCstLoanChange" @clickDalong="clickDalong(' ',['零售贷款余额'])"></TitleCard>
      </div>
      <!-- 分割线 -->
      <div class="dividers"><van-divider :dashed="true" /></div>
      <!-- 贷款余额-增长趋势 -->
      <div class="contentItem">
        <div class="custStyle aumStyle">
          <span class="title">增长趋势</span>
          <selectors :title="['日', '月']" :typeP="1" @change="changeLoan" v-if="loanType == 0"></selectors>
        </div>
        <echartHistogram :type="1" ref="Histogram3" :dataArr="['全部','按揭贷款','消费贷款','经营贷款']" :numType="'余额总计'" :selectTime="selectTime" :barData="loanData" @change="loanChange" @change2="loanChange2" :timeUnit="timeUnit3"></echartHistogram>
      </div>
      <!-- 地图测试 -->
      <!-- <div class="contentItem" style="margin-top: 0.12rem;width: 100%; height: 5rem;">
        <MapContainer></MapContainer>
      </div> -->

      <van-dialog v-model:show="clickDalongShow" :title="dalongShow.title" theme="round-button" confirmButtonColor="#026DFF" class="dialogBox">
        <div class="diloag">
          <div class="diloagItem">
            <p v-for="(item, index) in dalongShow.text" :key="index">{{item}}</p>
          </div>
        </div>
      </van-dialog>
      <div class="bottomLine">
        <span></span>
        <div class="bottomText">到底啦，我是有底线的</div>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNum, formatNums } from "../../api/common.js";
import { getEmpInfo } from "../../request/theme.js";
import { queryBusiDt, queryHomeDayReportList, queryHomeOrgDayReportList, queryHomPeCstAum, queryHomPeCstBalDgrm, queryAst, queryCustomertrends, queryAUMGrowthTrend, queryLoanGrowthTrend } from "../../request/index.js";
import { queryWarningRmdMgtSum } from "../../request/product.js";
import { Toast } from "vant";
import echartsPie from "../../components/common/echarts-pie.vue";
import echartsLine from "../../components/common/echarts-line.vue";
import echartsFunnel from "../../components/common/echarts-funnel.vue";
import selectors from "./components/selectors.vue"
import echartHistogram from "./components/echart-Histogram.vue"
import TitleCard from "@/views/index/components/TitleCard.vue"
import Table from "@/views/index/components/Table.vue"
import MapContainer from "@/components/common/MapContainer.vue"
import moment from "moment"
export default {
  components: {
    echartsPie,
    echartsLine,
    echartsFunnel,
    selectors,
    echartHistogram,
    TitleCard,
    Table,
    MapContainer
  },
  data() {
    return {
      manifesto: '',
      currentMonth: '-',
      dataDate: "",
      weekList: [],
      messageNum: 0,
      showWeekDetial: false,
      showMessageNum: "",
      clickDalongShow: false,
      dalongShow: {
        title: '测试',
        text: ['内容很随意']
      },
      listType: 0,
      loanType: 0,
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
          title: "有效客户数",
          unit: "(人)",
          text: [
            '（1）商户收款累计交易天数≥12天，且付款人不为同一人；',
            '（2）商户年度累计交易金额≥2000元；',
            '（3）结算账户为个人账户的，个人账户AUM资产（含储蓄存款）年日均≥1000元；结算账户为单位账户的，单位账户存款年日均≥1000元。'
          ],
          value0: "",
          value1: "",
          value2: "",
          value3: "",
        }
      ],
      aumYe: [],
      aumRj: [],
      aumDisDiaData: [],
      custLvDisDiaData: [],
      timeUnit: 0,
      timeUnit2: 0,
      timeUnit3: 0,
      custType: 0,
      aumFlag: 0,
      listLabel: [
        { label: '类型', align: 'left', fixed: true },
        { label: '金额(万元)', align: 'right' },
        { label: '较上日(万元)', align: 'right' },
        { label: '较上月(万元)', align: 'right' },
        { label: '较年初(万元)', align: 'right' },
      ],
      listLabels: [
        { label: '类型', align: 'left', fixed: true },
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
      titleData: {},
      dataEncode: '',
    };
  },
  computed: {
    showDate() {
      return moment(this.dataDate).format('YYYY.MM.DD')
    },
  },
  methods: {
    /* 开发中提示 */
    kaifazhong(){
      Toast.fail("正在开发中")
    },
    /* 选择日期 */
    showWeek(week) {
      if(week.timeStamp > week.todayTimeStamp){
        return
      }
      this.queryReportDetail(week.date)
    },
    /* 工作日报 */
    queryReportDetail(time){
      Toast.loading({message: "正在加载",forbidClick: true,duration: 0});
      var setWeekReportDetail = (res) => {
        if (res.data && res.data.records && res.data.records.length) {
          var data = res.data.records[0];
          this.titleData = {
            cmrcOpptFollowUpCntApp: formatNums(data.cmrcOpptFollowUpCntApp || 0), // 已跟进商机数
            cmrcOpptTranxCntApp:formatNums(data.cmrcOpptTranxCntApp || 0),        // 已成交商机数
            visitCustCntApp: formatNums(data.visitCustCntApp || 0),               // 已拜访商机数
            addLoanBal: formatNum((data.addLoanBal || 0) / 10000),                // 新增贷款余额(万元)
            addTimeDpsitBal: formatNum((data.addTimeDpsitBal || 0) / 10000),      // 新增定期存款余额(万元)
            adCurrDpsitBal: formatNum((data.adCurrDpsitBal || 0) / 10000),        // 新增活期存款余额(万元)
            addCftBal: formatNum((data.addCftBal || 0) / 10000),                  // 新增理财余额(万元)
          }
          this.weekList.forEach(item => {
            if(item.date == moment(time).format('YYYY-MM-DD')){
              item.toDay = true
            }else{
              item.toDay = false
            }
          })
          this.currentMonth = moment(time).format('M')
          Toast.clear();
        } else {
          Toast.fail("日报数据为空");
        }
      };
      let body = {
        etlDt: moment(time).format('YYYYMMDD'),
        dataEncode: this.dataEncode
      }
      if (this.$store.state.userMsg.roleId == "00000004") {
        queryHomeDayReportList(body,(res) => {
          setWeekReportDetail(res);
        });
      } else {
        queryHomeOrgDayReportList(body,(res) => {
          setWeekReportDetail(res);
        });
      }
    },
    /* 首页概览 */
    homPeCstAum() {
      let body = {
        etlDt: this.dataDate,
        dataEncode: this.dataEncode
      }
      queryHomPeCstAum(body,(res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.peCstAum = [
              [
                dataObj.aumBbalKh,              // AUM余额(考核)
                dataObj.aumBbalToYstdKh,        // AUM余额(考核)较上日
                dataObj.aumBbalToLastMonthKh,   // AUM余额(考核)较上月
                dataObj.aumBbalToBegngKh        // AUM余额(考核)较年初
              ],
              [
                dataObj.aumYearAvgKh,           // AUM日均(考核)
                dataObj.aumYearAvgKhToLm,       // AUM日均(考核)较上月
                dataObj.aumYearAvgKhToLy,       // AUM日均(考核)较年初
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
              { name: '活期存款余额', a: dataObj.currDpsitMonthAvg, b: dataObj.currDpsitMonthAvgToLm, c: dataObj.currDpsitMonthAvgToLy },
              { name: '定期存款余额', a: dataObj.timeDpsitMonthAvg, b: dataObj.timeDpsitMonthAvgToLm, c: dataObj.timeDpsitMonthAvgToLy },
              { name: '理财余额', a: dataObj.cftYearAvg, b: dataObj.cftYearAvgToLm, c: dataObj.cftYearAvgToLy },
              { name: '基金余额', a: dataObj.fndYearAvgToLm, b: dataObj.fndYearAvgToLm, c: dataObj.fndYearAvgToLy },
              // { name: '保险余额', a: dataObj.insYearAvg, b: dataObj.insYearAvgToLm, c: dataObj.insYearAvgToLy },
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
                case "有效客户数":
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
    /* AUM余额分布图 */
    getAumDisDiaData() {
      let body = {
        etlDt: this.dataDate,
        dataEncode: this.dataEncode
      }
      queryHomPeCstBalDgrm(body,(res) => {
        if (res.data && res.data.records && res.data.records.length) {
          var dataObj = res.data.records[0];
          let itemStyle = function (item) {
            return {
              color: ["#488BFF", "#26CEBA", "#FFC069", "#FD6865", "#836DE4", "#FF9C6E"][item]
            }
          }
          // let theSum = dataObj.currDpsitBal + dataObj.timeDpsitBal + dataObj.cftBal + dataObj.fndBal + dataObj.insBal + dataObj.entrstBal // 总和
          let percentage = (num) => {
            if(num == undefined || Number(num) == 0){
              return 0.00
            }
            return (Number(num)*100).toFixed(2)
          }
          // 余额
          this.aumYe = [
            {
              name: "活期存款余额",
              value: Number((dataObj.currDpsitBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.currDpsitBalPct),
              itemStyle: itemStyle(0)
            },
            {
              name: "定期存款余额",
              value: Number((dataObj.timeDpsitBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.timeDpsitBalPct),
              itemStyle: itemStyle(1)
            },
            {
              name: "理财余额",
              value: Number((dataObj.cftBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.cftBalPct),
              itemStyle: itemStyle(2)
            },
            {
              name: "基金余额",
              value: Number((dataObj.fndBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.fndBalPct),
              itemStyle: itemStyle(3)
            },
            {
              name: "保险余额",
              value: Number((dataObj.insBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.insBalPct),
              itemStyle: itemStyle(4)
            },
            {
              name: "信托余额",
              value: Number((dataObj.entrstBal / 10000).toFixed(2)),
              percentage: percentage(dataObj.entrstBalPct),
              itemStyle: itemStyle(5)
            },
          ];
          // 日均
          this.aumRj = [
            {
              name: "活期存款余额",
              value: Number((dataObj.currDpsitMonthAvg / 10000).toFixed(2)),
              percentage: percentage(dataObj.currDpsitMonthAvgPct),
              itemStyle: itemStyle(0)
            },
            {
              name: "定期存款余额",
              value: Number((dataObj.timeDpsitMonthAvg / 10000).toFixed(2)),
              percentage: percentage(dataObj.timeDpsitMonthAvgPct),
              itemStyle: itemStyle(1)
            },
            {
              name: "理财余额",
              value: Number((dataObj.cftYearAvg / 10000).toFixed(2)),
              percentage: percentage(dataObj.cftYearAvgPct),
              itemStyle: itemStyle(2)
            },
            {
              name: "基金余额",
              value: Number((dataObj.fndYearAvg / 10000).toFixed(2)),
              percentage: percentage(dataObj.fndYearAvgPct),
              itemStyle: itemStyle(3)
            },
            {
              name: "信托余额",
              value: Number((dataObj.entrstYearAvg / 10000).toFixed(2)),
              percentage: percentage(dataObj.entrstYearAvgPct),
              itemStyle: itemStyle(5)
            },
          ];
          this.aumDisDiaData = [this.aumYe,this.aumRj][this.listType]
          this.$nextTick(() => {
            this.$refs.aumDisDiaChart.drawEcharts();
          });
        } else {
          Toast.fail("AUM分布图数据为空");
        }
      });
    },
    /* 客户服务等级 */
    getCustLvDisDiaData() {
      let body = {
        etlDt: this.dataDate,
        dataEncode: this.dataEncode
      }
      queryAst(body, (res) => {
        if (res.data && res.data.records && res.data.records.length) {
          var dataObj = res.data.records[0];
          this.custLvDisDiaData = [
            {
              name: "未达标客户",
              value: dataObj.norchStdCustCnt.toLocaleString(),
            },
            {
              name: "大众客户",
              value: dataObj.ordnryCustCnt.toLocaleString(),
            },
            {
              name: "理财客户",
              value: dataObj.cftCustCnt.toLocaleString(),
            },
            {
              name: "金卡客户",
              value: dataObj.gdCardCustCnt.toLocaleString(),
            },
            {
              name: "白金客户",
              value: dataObj.platinumCustCnt.toLocaleString(),
            },
            {
              name: "钻石客户",
              value: dataObj.diamdCustCnt.toLocaleString(),
            },
            {
              name: "私行客户",
              value: dataObj.pbssCustCnt.toLocaleString(),
            },
          ];
          this.$nextTick(() => {
            this.$refs.custLvDisDiaChart.drawEcharts();
          });
        } else {
          Toast.fail("客户等级分布图数据为空");
        }
      });
    },
    /* 机构选取 */
    khgmActiveOrg(orgValue) {
      this.dataEncode = orgValue.value || ''
      this.homPeCstAum()
      this.queryReportDetail(this.dataDate)   // 工作日报
      this.changeL(0)                         // 客户增长趋势初始化
      this.setAum(0)                          // AUM增长趋势初始化
      this.setLoan(0)                         // 贷款增长趋势初始化
      // this.customertrends(this.dataDate)     // 客户增长趋势
      // this.aumGrowthTrend(this.dataDate)     // AUM增长趋势
      // this.loanGrowthTrend(this.dataDate)    // 贷款增长趋势
    },
    /* 客户增长趋势/客户服务等级 */
    changeL(data){
      this.custType = data
      if(data == 1) {
        this.$nextTick(()=>{
          this.getCustLvDisDiaData()
        })
      }else{
        this.timeUnit = 0
        this.$refs.Histogram.init()
        this.customertrends(this.dataDate)
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
      this.setAum(data)
    },
    setAum(data){
      this.timeUnit2 = data
      this.$refs.Histogram2.init()
      this.aumGrowthTrend(this.dataDate)
    },
    /* 贷款日月切换 */
    changeLoan(data){
      this.setLoan(data)
    },
    setLoan(data){
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
        pageSize: '31',
        dataEncode: this.dataEncode, // 机构号
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
            value: moment(time).subtract(i, 'month').format('MM'),      // 需要展示的时间
            time: moment(time).subtract(i, 'month').format('YYYYMM')    // 保留原时间戳 往前推12个月
          }
          xAxis.push(obj)
        }
      }
      queryCustomertrends(body, (res) => {
        let data = res.data.records
        // 零售客户数（全部), 财富客户数, 贷款客户数, 代发客户数, 基础客户数, 有效客户数
        let arr = ['custCnt','vipCustCnt','loanCustCnt','agentCustCnt','basicCstCnt','merntCstCnt']
        let xData = [[],[],[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach(item => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  value: item[`${name}${['ToYstd','ToLastMonth'][this.timeUnit]}`] || 0,
                  time: itemX.time,
                  totalBalance: item[name] || 0,
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
                  time: itemX.time,
                  totalBalance: 0
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
        pageSize: '31',
        dataEncode: this.dataEncode, // 机构号
      }
      let xAxis = []
      // 根据查询日期 日/月0/日均1 生成一条X轴
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
        body.judge = this.listType.toString()
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
        let arr = [
          ['aumBal','currDpsitBal','timeDpsitBal','cftBal','fndBal','insBal','entrstBal'], // 余额
          ['aumYearAvgKh','currDpsitYearAvg','timeDpsitMonthAvg','cftYearAvg','fndYearAvg','insYearAvg','entrstYearAvg'] // 日均
        ][this.listType]
        let xData = [[],[],[],[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach(item => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  value: item[`${name}${[['ToYstd','ToLastMonth'][this.timeUnit2],'ToLm'][this.listType]}`]/10000 || 0,
                  time: itemX.time,
                  totalBalance: item[name]/10000 || 0
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
        pageSize: '31',
        dataEncode: this.dataEncode, // 机构号
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
        body.judge = this.loanType.toString()
        for(let i = 11; i >= 0; i--){
          let obj = {
            value: moment(time).subtract(i, 'month').format('MM'),  // 需要展示的时间
            time: moment(time).subtract(i, 'month').format('YYYYMM')    // 保留原时间戳 往前推12个月
          }
          xAxis.push(obj)
        }
      }
      //贷款余额月日均-趋势图
      queryLoanGrowthTrend(body, (res) => {
        let data = res.data.records
        // 全部, 按揭贷款, 消费贷款, 经营贷款
        let arr = [
          ['loanBal','mrtgLoanBal','cnsmLoanBal','corprtnLoanBal'],
          ['loanMonthAvg','mrtgLoanMonthAvg','cnsmLoanMonthAvg','corprtnLoanMonthAvg']
        ][this.loanType]
        let xData = [[],[],[],[]] 
        // 根据生成的X轴去拿到接口返回的每一条X轴的数据
        xAxis.forEach(itemX => {
          let flag = true
          data.forEach((item, i) => {
            if(itemX.time == item.etlDt){
              arr.forEach((name,index)=> {
                let obj = {
                  time: itemX.time,
                  totalBalance : item[name]/10000 || 0
                }
                if(this.loanType == 0){
                  if(name == 'loanBal'){
                    obj.value = item[`${name}${['ToYstd','ToLastMonth'][this.timeUnit3]}`]/10000 || 0
                  }else{
                    obj.value = item[`${name.replace('Bal','')}${['ToYstd','ToLm'][this.timeUnit3]}`]/10000 || 0
                  }
                }else{
                  obj.value = item[`${name}ToLm`]/10000 || 0
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
                  time: itemX.time,
                  totalBalance: 0
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
    /* AUM余额/日均切换 */
    peCstAumChange(v){
      this.listType = v ? 0 : 1
      this.aumDisDiaData = v ? this.aumYe : this.aumRj
      this.$nextTick(() => {
        this.$refs.aumDisDiaChart.drawEcharts();
      });
      this.setAum(this.listType) // 切换时,调用增长趋势也要一起联动
    },
    /* 贷款余额/日均切换 */
    peCstLoanChange(v){
      this.loanType =  v ? 0 : 1
      this.setLoan(this.loanType) // 切换时,调用增长趋势也要一起联动
    },
    /* 近七天日期生成 */
    lastSevenDays(){
      // 获取当前默认日期
      let initTime = moment(this.dataDate).format('YYYY-MM-DD')
      // 默认日期三天后
      let lastTime = moment(this.dataDate).add(3, 'day').format('YYYY-MM-DD')
      this.currentMonth = moment(this.dataDate).format('M')
      let timeArr = []
      for (var i = 9; i >= 0; i--) {
        let obj = {
          week: ["日", "一", "二", "三", "四", "五", "六"][moment(lastTime).subtract(i, 'day').format('d')],      // 星期几
          date: moment(lastTime).subtract(i, 'day').format('YYYY-MM-DD'),                                       // 日期YYYY-MM-DD
          showDate: moment(lastTime).subtract(i, 'day').format('DD'),                                           // 日
          timeStamp: moment(lastTime).subtract(i, 'day').format('YYYY-MM-DD'),                                  // 日期的时间戳
          todayTimeStamp: initTime,                                                                             // 默认日期的时间戳
          toDay: moment(lastTime).subtract(i, 'day').format('YYYY-MM-DD') == initTime,                          // 是否为当前选择的日期
          disabe: moment(lastTime).subtract(i, 'day').format('YYYY-MM-DD') > initTime,                          // 大于当前默认时间的日期禁用
        }
        timeArr.push(obj)
      }
      this.weekList = timeArr
      this.$nextTick(()=>{
        this.$refs.weekList.scrollLeft = 1000
      })
    },
    /* 查询工作宣言 */
    queryManifesto(){
      getEmpInfo({}, (res)=>{
        if (res.data) {
          this.manifesto = res.data.manifesto
        }
      })
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
        queryWarningRmdMgtSum({stat: "0"},(res3) => {
          if (res3.data && res3.data.length) {
            this.messageNum = res3.data[0].allSum;
            this.showMessageNum = res3.data[0].allSum > 99 ? "99+" : res3.data[0].allSum;
          } else {
            Toast.fail("消息数据为空");
          }
        });
        this.homPeCstAum();
        this.queryManifesto() // 工作宣言
        this.lastSevenDays()  // 生成顶部近7天列表
        this.queryReportDetail(this.dataDate)  // 工作日报
        this.customertrends(this.dataDate)     // 客户增长趋势
        this.aumGrowthTrend(this.dataDate)     // AUM增长趋势
        this.loanGrowthTrend(this.dataDate)    // 贷款增长趋势
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
// 隐藏滚动条
.weekList::-webkit-scrollbar {
  display: none;
 }
.weekList {
  display: flex;
  justify-content: space-between;
  margin-top: 0.155rem;
  overflow-x: auto;
  .weekItem {
    min-width: 14.285%;
    height: 100%;
    padding: 0 0.09rem;
    text-align: center;
    .dateTitle {
      // width: 100%;
      .weekWeek {
        width: 100%;
        // height: 0.2rem;
        margin-bottom: 0.13rem;
        font-size: 0.14rem;
        line-height: 1;
        color: #bfbfbf;
      }
      .weekDate,
      .today,
      .future{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 0.28rem;
        text-align: center;
        font-size: 0.16rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #262626;
        line-height: 0.2rem;
      }
      .weekDate {
        position: relative;
        &:before {
          position: absolute;
          bottom: 0;
          content: '';
          width: 0.04rem;
          height: 0.04rem;
          border-radius: 50%;
          background:#37CD37;
        }
      }
      .today {
        border-radius: 50%;
        background-color: rgba(2, 109, 255, 1);
        color: #fff;
      }
      .future {
        color: #bfbfbf;
      }
    }
  }
}
	.bottomLine {
		width: 60%;
		margin: 0.2rem auto;
    padding-bottom: 0.2rem;
		display: flex;
		justify-content: space-between;
    align-items: center;
    &>span {
      width: 10.7%;
      height: 0.005rem;
      opacity: 0.7;
      border-top: 0.005rem solid rgba(191,191,191,1);
    }
    .bottomText {
      margin: 0 2.7%;
      font-size: 0.12rem;
      padding: 0 0.1rem;
      color: #BFBFBF;
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
  border-radius: 50%;
	background: url(../../assets/image/mine_main_userIcon.png) no-repeat center;
	background-size: contain;
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
  background-image: url(../../assets/image/home_cxh.png);
}

.icon-todo {
  background-image: url(../../assets/image/index_main_todoMessage.png);
}

.icon-message {
  background-image: url(../../assets/image/home_xx.png);
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
  border: 0 dashed rgba(255, 255, 255, 1);
  padding: 0 0.3rem;
  /* margin: 0.005rem 0; */
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