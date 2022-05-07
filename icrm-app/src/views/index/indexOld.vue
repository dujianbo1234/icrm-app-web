<template>
  <div class="home">
    <nav-bar title="首页" />
    <div
      class="fixedPlace"
      :style="{
        height:
          $store.state.userMsg.roleId == '00000006' ? '1.44rem' : '2.14rem',
      }"
    >
      <div class="topMsg">
        <div class="topLeftMsg">
          <div class="topLeftMsg1">
            <div class="userName">{{ $store.state.userMsg.empname }}</div>
            <div class="chenxihui" @click="$router.push('/chenxihui')">
              晨夕会
            </div>
          </div>
          <div class="topLeftMsg2">当前数据时间：{{ showDate }}</div>
        </div>
        <div class="topRightMsg">
          <div class="topRightMsgChild" @click="$router.push('/business')">
            <span v-if="$store.state.userMsg.roleId == '00000004'"
              >{{ shangjiNum || "-" }} 条待跟进商机
            </span>
            <span v-else>{{ shangjiNum || "-" }} 条待分配商机 </span>
            <van-icon name="arrow" />
          </div>
          <div class="topRightMsgChild" @click="$router.push('/msgPage')">
            <span>{{ messageNum || "-" }} 条待阅读消息 </span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="weekList" v-if="$store.state.userMsg.roleId != '00000006'">
        <div
          class="weekItem"
          v-for="(week, i) in weekList"
          :key="'week' + i"
          @click="showWeek(week)"
        >
          <div class="weekWeek">{{ week.week }}</div>
          <div class="weekDate">{{ week.showDate }}</div>
        </div>
      </div>
      <van-tabs
        v-model:active="mianTabActive"
        color="#3399FF"
        @change="changeMainTab"
        line-width="30%"
        line-height="2px"
      >
        <van-tab v-for="(item, i) in mainTab" :key="'mainTab' + i">
          <template #title>
            <van-icon :name="item.icon" size="64" />
            <span>{{ item.title }}</span>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div
      style="width: 100%; background-color: #ffffff"
      :style="{
        height:
          $store.state.userMsg.roleId == '00000006' ? '1.49rem' : '2.19rem',
      }"
    ></div>
    <div class="khgm" v-if="mianTabActive == 0">
      <org-list
        type="0"
        showText="请选择机构"
        v-if="$store.state.userMsg.roleId != '00000004'"
        @activeOrg="khgmActiveOrg"
      />
      <div class="khgmBox">
        <div
          class="khgmItemBox"
          v-for="(item, i) in showData"
          :key="'khgm' + i"
        >
          <div class="khgmMainTitle">{{ item.title }} {{ item.unit }}</div>
          <div class="khgmValue">{{ item.value0 || "0" }}</div>
          <div class="khgmTitle">
            <span>较上日</span>
            <van-icon
              v-if="!item.value1 || item.value1 == '0' || item.value1 == '0.00'"
              :name="require('../../assets/image/index_main_numLine.png')"
              size="0.2rem"
            />
            <van-icon
              v-else-if="item.value1[0] == '-'"
              :name="require('../../assets/image/index_main_numDown.png')"
              size="0.2rem"
            />
            <van-icon
              v-else
              :name="require('../../assets/image/index_main_numUp.png')"
              size="0.2rem"
            />
          </div>
          <div class="khgmValue">{{ item.value1 || "0" }}</div>
          <div class="khgmTitle">
            <span>较上月</span>
            <van-icon
              v-if="!item.value2 || item.value2 == '0' || item.value2 == '0.00'"
              :name="require('../../assets/image/index_main_numLine.png')"
              size="0.2rem"
            />
            <van-icon
              v-else-if="item.value2[0] == '-'"
              :name="require('../../assets/image/index_main_numDown.png')"
              size="0.2rem"
            />
            <van-icon
              v-else
              :name="require('../../assets/image/index_main_numUp.png')"
              size="0.2rem"
            />
          </div>
          <div class="khgmValue">{{ item.value2 || "0" }}</div>
          <div class="khgmTitle">
            <span>较年初</span>
            <van-icon
              v-if="!item.value3 || item.value3 == '0' || item.value3 == '0.00'"
              :name="require('../../assets/image/index_main_numLine.png')"
              size="0.2rem"
            />
            <van-icon
              v-else-if="item.value3[0] == '-'"
              :name="require('../../assets/image/index_main_numDown.png')"
              size="0.2rem"
            />
            <van-icon
              v-else
              :name="require('../../assets/image/index_main_numUp.png')"
              size="0.2rem"
            />
          </div>
          <div class="khgmValue">{{ item.value3 || "0" }}</div>
          <van-icon class="khgmIcon" :name="item.icon" size="0.24rem" />
        </div>
      </div>
    </div>
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
        <div
          class="weekReportItem"
          v-for="(item, i) in weekReportDetail"
          :key="'weekReportItem' + i"
        >
          <div class="weekReportTitle">{{ item.title }}</div>
          <div class="weekReportValue">{{ item.value }}</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { formatNum } from "../../api/common.js";
import {
  queryBusiDt,
  queryHomeDayReportList,
  queryHomeOrgDayReportList,
  queryHomPeCstAum,
  queryHomPeCstBalDgrm,
  queryHomCusts,
  queryAst,
  queryHomPeCstSvrLvlDgrm,
} from "../../request/index.js";
import { queryCommercialOpportunityCount } from "../../request/market.js";
import { queryWarningRmdMgtSum } from "../../request/product.js";
import { Toast } from "vant";
import echartsPie from "../../components/common/echarts-pie.vue";
import echartsLine from "../../components/common/echarts-line.vue";
import echartsFunnel from "../../components/common/echarts-funnel.vue";
export default {
  components: {
    echartsPie,
    echartsLine,
    echartsFunnel,
  },
  data() {
    return {
      dataDate: "",
      weekList: [],
      shangjiNum: "",
      messageNum: "",
      showWeekReportBox: false,
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
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_lskhs.png"),
        },
        {
          title: "有效客户数",
          unit: "(人)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_yxkhs.png"),
        },
        {
          title: "AUM",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_aum.png"),
        },
        {
          title: "定期存款",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_dqck.png"),
        },
        {
          title: "活期存款",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_hqck.png"),
        },
        {
          title: "贷款",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_dk.png"),
        },
        {
          title: "理财",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_lc.png"),
        },
        {
          title: "信托",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_xt.png"),
        },
        {
          title: "保险",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_bx.png"),
        },
        {
          title: "基金",
          unit: "(万元)",
          value0: "",
          value1: "",
          value2: "",
          value3: "",
          icon: require("../../assets/image/index_main_jj.png"),
        },
      ],
      aumDisDiaData: [],
      custLvDisDiaData: [],
      serveLvDisDiaData: [],
      custNumDisDiaData: [],
      custNumDisDiaDate: [],
    };
  },
  computed: {
    showDate() {
      return `${this.dataDate.slice(0, 4)}-${this.dataDate.slice(
        4,
        6
      )}-${this.dataDate.slice(6, 8)}`;
    },
  },
  methods: {
    showWeek(week) {
      Toast.loading({
        message: "正在加载",
        forbidClick: true,
        duration: 0,
      });
      this.weekReportTitle = `${week.date.slice(0, 4)}-${week.date.slice(
        4,
        6
      )}-${week.date.slice(6, 8)} 工作日报`;
      var setWeekReportDetail = (res) => {
        if (res.data && res.data.records && res.data.records.length) {
          var weekReportDetail = res.data.records[0];
          this.weekReportDetail = [
            {
              title: "商机跟进数",
              value: weekReportDetail.cmrcOpptFollowUpCnt,
            },
            {
              title: "商机成交数",
              value: weekReportDetail.cmrcOpptTranxCnt,
            },
            {
              title: "客户拜访数",
              value: weekReportDetail.visitCustCnt + "人",
            },
            {
              title: "新增贷款余额",
              value: formatNum(weekReportDetail.addLoanBal / 10000) + "万元",
            },
            {
              title: "新增定期存款余额",
              value:
                formatNum(weekReportDetail.addTimeDpsitBal / 10000) + "万元",
            },
            {
              title: "新增活期存款余额",
              value:
                formatNum(weekReportDetail.adCurrDpsitBal / 10000) + "万元",
            },
            {
              title: "新增理财余额",
              value: formatNum(weekReportDetail.addCftBal / 10000) + "万元",
            },
          ];
          Toast.clear();
          this.showWeekReportBox = true;
        } else {
          Toast.fail("日报数据为空");
        }
      };
      if (this.$store.state.userMsg.roleId == "00000004") {
        queryHomeDayReportList(
          {
            etlDt: week.date,
          },
          (res) => {
            setWeekReportDetail(res);
          }
        );
      } else {
        queryHomeOrgDayReportList(
          {
            etlDt: week.date,
          },
          (res) => {
            setWeekReportDetail(res);
          }
        );
      }
    },
    getKHGMMsg(dataEncode) {
      queryHomPeCstAum(
        {
          etlDt: this.dataDate,
          dataEncode: dataEncode || "",
        },
        (res) => {
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            for (let item of this.showData) {
              switch (item.title) {
                case "零售客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.custCnt,
                    dataObj.custCntToYstd,
                    dataObj.custCntToLastMonth,
                    dataObj.custCntToBegng,
                  ].map((item) => item.toLocaleString());
                  break;
                case "有效客户数":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.efftCstCnt,
                    dataObj.efftCstCntToYstd,
                    dataObj.efftCstCntToLastMonth,
                    dataObj.efftCstCntToBegng,
                  ].map((item) => item.toLocaleString());
                  break;
                case "AUM":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.aumBal,
                    dataObj.aumBalToYstd,
                    dataObj.aumBalToLastMonth,
                    dataObj.aumBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "定期存款":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.timeDpsitBal,
                    dataObj.timeDpsitBalToYstd,
                    dataObj.timeDpsitBalToLastMonth,
                    dataObj.timeDpsitBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "活期存款":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.currDpsitBal,
                    dataObj.currDpsitBalToYstd,
                    dataObj.currDpsitBalToLastMonth,
                    dataObj.currDpsitBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "贷款":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.loanBal,
                    dataObj.loanBalToYstd,
                    dataObj.loanBalToLastMonth,
                    dataObj.loanBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "理财":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.cftBal,
                    dataObj.cftBalToYstd,
                    dataObj.cftBalToLastMonth,
                    dataObj.cftBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "信托":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.entrstBal,
                    dataObj.entrstBalToYstd,
                    dataObj.entrstBalToLastMonth,
                    dataObj.entrstBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "保险":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.insBal,
                    dataObj.insBalToYstd,
                    dataObj.insBalToLastMonth,
                    dataObj.insBalToBegng,
                  ].map((item) => formatNum(item / 10000));
                  break;
                case "基金":
                  [item.value0, item.value1, item.value2, item.value3] = [
                    dataObj.fndBal,
                    dataObj.fndBalToYstd,
                    dataObj.fndBalToLastMonth,
                    dataObj.fndBalToBegng,
                  ].map((item) => formatNum(item / 10000));
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
          console.log(this.dataDate, dataEncode)
          if (res.data && res.data.records && res.data.records.length) {
            var dataObj = res.data.records[0];
            this.aumDisDiaData = [
              {
                name: "定期存款",
                value: Number((dataObj.timeDpsitBal / 10000).toFixed(2)),
              },
              {
                name: "活期存款",
                value: Number((dataObj.currDpsitBal / 10000).toFixed(2)),
              },
              {
                name: "理财",
                value: Number((dataObj.cftBal / 10000).toFixed(2)),
              },
              {
                name: "信托",
                value: Number((dataObj.entrstBal / 10000).toFixed(2)),
              },
              {
                name: "基金",
                value: Number((dataObj.fndBal / 10000).toFixed(2)),
              },
              {
                name: "保险",
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
      queryHomCusts(
        {
          etlDt: this.dataDate,
        },
        (res) => {
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
        this.zbstActiveOrg({
          value: "",
        });
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
  },
  mounted() {
    queryBusiDt({}, (res1) => {
      if (res1.data) {
        this.dataDate = res1.data.workDate;
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
              this.messageNum = res3.data[0].allSum.toLocaleString();
            } else {
              Toast.fail("消息数据为空");
            }
          }
        );
        this.getKHGMMsg();
        let todayDate = new Date(
          `${this.dataDate.slice(0, 4)}-${this.dataDate.slice(
            4,
            6
          )}-${this.dataDate.slice(6, 8)}`
        );
        let sjc = todayDate.getTime();
        this.weekList = [];
        for (var i = 6; i >= 0; i--) {
          var todaySjc = sjc - i * 24 * 60 * 60 * 1000;
          var b = new Date(todaySjc);
          var year = b.getFullYear();
          var month = b.getMonth() + 1;
          var date = b.getDate();
          var day = b.getDay();
          var weeks = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"];
          if (month < 10) {
            month = "0" + (b.getMonth() + 1);
          } else {
            month = b.getMonth() + 1;
          }
          if (date < 10) {
            date = "0" + b.getDate();
          }
          this.weekList.push({
            week: weeks[day],
            date: String(year) + String(month) + String(date),
            showDate: String(month) + "-" + String(date),
          });
        }
      } else {
        Toast.fail("数据日期数据为空");
      }
    });
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
}

.fixedPlace {
  width: 100%;
  position: fixed;
  top: calc(constant(safe-area-inset-top) + 0.46rem);
  top: calc(env(safe-area-inset-top) + 0.46rem);
  left: 0;
  z-index: 9;
}

.topMsg {
  background-color: #4477cc;
  width: 100%;
  padding: 0.12rem 3.5% 0;
  height: 0.84rem;
  color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
}

.topLeftMsg {
  width: 50%;
  height: 100%;
  text-align: left;
}

.topLeftMsg1 {
  display: flex;
  flex-wrap: nowrap;
  height: 0.32rem;
  align-items: center;
}

.userName {
  font-size: 0.2rem;
  margin-right: 0.16rem;
  font-weight: 600;
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

.topRightMsg {
  width: 50%;
  height: 100%;
}

.topRightMsgChild {
  width: 100%;
  line-height: 0.32rem;
  font-size: 0.13rem;
  text-align: right;
  white-space: nowrap;
}

.weekList {
  height: 0.7rem;
  padding: 0 0.1rem;
  border-bottom: solid 1px #ebebeb;
  display: flex;
  flex-wrap: nowrap;
  background-color: #ffffff;
}

.weekItem {
  height: 100%;
  width: calc(100% / 7);
  padding: 0.1rem 0;
}

.weekWeek {
  width: 100%;
  text-align: center;
  font-size: 0.16rem;
  line-height: 0.3rem;
}

.weekDate {
  width: 100%;
  text-align: center;
  font-size: 0.14rem;
  color: #ff0000;
  line-height: 0.2rem;
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
  padding: 0.05rem 3.5% 0.1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.khgmItemBox {
  font-size: 0.15rem;
  width: 48%;
  margin-bottom: 0.15rem;
  background-color: #f6f7fa;
  text-align: left;
  padding: 0.1rem 0.12rem;
  border-radius: 0.05rem;
  position: relative;
}

.khgmMainTitle {
  font-weight: 600;
  font-size: 0.16rem;
  color: #333333;
}

.khgmTitle {
  margin-top: 0.05rem;
  font-weight: 500;
  font-size: 0.15rem;
  color: #666666;
  display: flex;
  align-items: center;
}

.khgmValue {
  font-weight: 500;
  font-size: 0.14rem;
  color: #999999;
}

.khgmIcon {
  position: absolute;
  top: 0.09rem;
  right: 0.09rem;
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
