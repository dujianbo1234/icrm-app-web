<template>
  <div class="home">
    <div class="top">
      <!-- 顶部title -->
      <nav-bar title="存量客户列表" type="2" leftIcon :rightText="$store.state.userMsg.roleId != '00000004' ? '选择机构' : ''" rightColor="rgba(2, 109, 255, 1)" @touchRight="$refs.orgList.showPopup()"/>
      <!-- 搜索栏 -->
      <van-search class="searchBox" v-model="searchValue" shape="round" show-action placeholder="请输入客户名称/归属客户经理工号" @search="reload">
        <template #action>
          <div style="color: rgba(2, 109, 255, 1); font-size: 0.14rem; padding-left: 0.1rem" @click="reload">搜索</div>
        </template>
      </van-search>
      <!-- 排序 -->
      <div class="orderList">
        <div class="orderItem" v-for="(orderItem, i) in orderList" :key="'orderItem' + i" @click="changeOrder(i)">
          <span>{{ orderItem }}</span>
          <van-icon v-if="i != orderIndex" :name="require('@/assets/image/cust_zyqk_order0.png')" size="10"/>
          <van-icon v-else-if="orderType" :name="require('@/assets/image/cust_zyqk_order1.png')" size="10"/>
          <van-icon v-else :name="require('@/assets/image/cust_zyqk_order2.png')" size="10"/>
        </div>
      </div>
      <!-- 选择tabs -->
      <div class="list">
        <van-tabs class="month" v-model:active="tageListActive" type="card" @change="tageListChange">
          <van-tab v-for="item in tageList" :key="item.key" :title="item.title">
          </van-tab>
        </van-tabs>
      </div>
      <!-- 筛选结果 -->
      <div class="listNum">
        <div class="allNum">
          <span>筛选结果：共{{total}}条数据 </span>
          <!-- <span style="color: #0088ff">{{ total }}</span>
          <span> 人</span> -->
        </div>
        <div class="sendAll" @click="showBatchSend = !showBatchSend">
          <span v-if="showBatchSend">取消</span>
          <span v-else>批量发送</span>
        </div>

        <!-- <div class="sendAll" v-if="msgOrPhone" @click="showBatchSend=!showBatchSend">
          <span v-if="showBatchSend">取消</span>
          <span v-else>批量发送</span>
        </div>
        <div v-else></div> -->
      </div>
    </div>
    <!-- <div style="width: 100%; height: 1.4rem"></div> -->
    <van-checkbox-group v-model="chooseItems" style="padding-top: 1.83rem;">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getCustList">
        <!-- 
          cstName          客户名称
          belgCustMgr      管户经理
          belgCustMgrNm    管户经理名称
          belongOrg        归属机构
          belongOrgNm      归属机构名称
          cstLvl           客户等级
          svcLvl           服务等级
          ctcTel           联系电话
          aumDifVal        aum差额值
          aumHistHestVal   aum历史最高值
          aumBal           aum余额
          loanBal          贷款余额
          timeDpsitBal     定期存款余额
          currDpsitBal     活期存款余额
          newCstFlg        新客客户标志
          vipCstFlg        财富客户标志
          agentPayCstFlg   代发客户标志
          merntCstFlg      商户客户标志
          ioinHoldLoan     是否持有贷款
          ioinSgnAlpy      是否签约支付宝
          ioinSgnWchtPymt  是否签约微信支付
          ioinSgnYsf       是否签约云闪付 
        -->
        <div class="custItem" v-for="(item,i) in custList" :key="'item'+i">
          <div class="custItem1">
            <div class="custItem1_2">
              <div class="custItem1_2_1">{{item.cstName}}</div>
              <div class="custItem1_2_2" :style="`background-image:url(${require(`@/assets/image/business_chooseCust_type${item.svcLvlCount || 0}.png`)})`"></div>
              <div class="custItem1_2_3">

                <template v-for="(text, j) in ['vipCstFlg','agentPayCstFlg', 'basicCstCnt', 'merntCstFlg', 'ioinHoldLoan']">
                  <div :class="text" v-if="item[text] =='1'" :key="j">{{['财','代','新','商','贷'][j]}}</div>
                </template>

                <template v-for="(ioinSgn, s) in ['ioinSgnAlpy','ioinSgnWchtPymt', 'ioinSgnYsf']" :key="s">
                  <van-icon :name="require(`@/assets/image/business_chooseCust_${['zfb','wx','ysf'][s]}${['.png','_a.png'][item[ioinSgn] || 0]}`)" size="16" style="margin-right: 0.04rem;" />
                </template>

              </div>
            </div>
            <!-- <div class="custItem1_3" v-if="item.cmrcOpptSt=='2'" style="background-color: #026DFF;">待跟进</div>
            <div class="custItem1_3" v-if="item.cmrcOpptSt=='4'" style="background-color: #FFBA00;">已跟进</div>
            <div class="custItem1_3" v-if="item.cmrcOpptSt=='5'" style="background-color: #52C41A;">已成交</div> -->
          </div>
          <div class="custItem2">
            <div class="custItem2_child">
              <span class="custItem2_childName">极差值：</span>
              <span class="custItem2_childValue">{{formatNum(item.aumDifVal/10000)}}万元</span>
            </div>
            <div class="custItem2_child">
              <span class="custItem2_childName">历史最高资产：</span>
              <span class="custItem2_childValue">{{formatNum(item.aumHistHestVal/10000)}}万元</span>
            </div>
            <div class="custItem2_child">
              <span class="custItem2_childName">AUM资产：</span>
              <span class="custItem2_childValue">{{formatNum(item.aumBal/10000)}}万元</span>
            </div>
            <div class="custItem2_child">
              <span class="custItem2_childName">定期：</span>
              <span class="custItem2_childValue">{{formatNum(item.timeDpsitBal/10000)}}万元</span>
            </div>
            <div class="custItem2_child">
              <span class="custItem2_childName">活期：</span>
              <span class="custItem2_childValue">{{formatNum(item.currDpsitBal/10000)}}万元</span>
            </div>
            <div class="custItem2_child">
              <span class="custItem2_childName">贷款：</span>
              <span class="custItem2_childValue">{{formatNum(item.loanBal/10000)}}万元</span>
            </div>
          </div>
          <div class="custItem3"></div>
          <div class="bottomText">
            <div>客户经理：{{ item.belgCustMgrNm }}</div>
            <div>机构名称：{{ item.belongOrgNm }}</div>
          </div>
        </div>
      </van-list>
    </van-checkbox-group>
    <div style=" height: calc(constant(safe-area-inset-bottom) + 0.6rem); height: calc(env(safe-area-inset-bottom) + 0.6rem);" v-show="showBatchSend"></div>
    <div class="sendMsgBtnBox" v-if="showBatchSend">
      <div class="sendMsgBtn" @click="msgBatchSend(true)">全部发送</div>
      <div class="sendMsgBtn" @click="msgBatchSend(false)">批量发送</div>
    </div>
    <org-list ref="orgList" type="2" @close="closeOrg" @activeOrg="activeOrg" />
  </div>
</template>

<script>
import { getSysCodeByType } from "../../request/common.js";
import { formatNum } from "../../api/common.js";
import { queryCustSearchList } from "../../request/custinfo.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      cstLvl: "",
      cstLvlList: [],
      orderList: ["极差值", "AUM余额", "贷款余额"],
      svcLvl: "",
      svcLvlList: [],
      chooseOrg: {
        text: "归属机构",
        value: "",
      },
      searchValue: "",
      loading: true,
      finished: false,
      pageIndex: 0,
      custList: [],
      total: "0",
      msgOrPhone: false,
      showBatchSend: false,
      chooseItems: [],
			params: {
				pageSize: "10",
				pageNum: "1",
				orderType: "",
				cstName: "",
				cstMagNo: "",
				busiType: "",
				curTage: "",
				estCstStart: "",
				estCstEnd: "",
				estAmtStart: "",
				estAmtEnd: "",
				orgId: ""
			},
      tageList: [
        { key: '', title: "全部" },
        { key: 6, title: "私行级" },
        { key: 5, title: "钻石级" },
        { key: 4, title: "白金卡级" },
        { key: 3, title: "金卡级" },
        { key: 2, title: "理财级" },
        { key: 1, title: "大众级" },
        { key: 0, title: "未达标" }
      ],
      tageListActive: '',
			orderIndex: null,
			orderType: true,
    };
  },
  mounted() {
    this.msgOrPhone = this.$store.state.userMsg.orgClass != "90000001";
    // getSysCodeByType({codeType: "CST_LVL"},(res) => {
    //     if (res.data) {
    //       this.cstLvlList = [
    //         {
    //           text: "全部",
    //           value: "",
    //         },
    //         ...res.data.map((item) => {
    //           return {
    //             text: item.codeName,
    //             value: item.codeValue,
    //           };
    //         }),
    //       ];
    //     } else {
    //       Toast.fail("AUM等级列表数据为空");
    //     }
    //   });
    // getSysCodeByType({codeType: "SVC_LVL"},(res) => {
    //     if (res.data) {
    //       this.svcLvlList = [
    //         {
    //           text: "全部",
    //           value: "",
    //         },
    //         ...res.data.map((item) => {
    //           return {
    //             text: item.codeName,
    //             value: item.codeValue,
    //           };
    //         }),
    //       ];
    //     } else {
    //       Toast.fail("服务等级列表数据为空");
    //     }
    //   });
    // var oldParams = JSON.parse(localStorage.getItem("oldParams"));
    // if (oldParams) {
    // } else {
    // }
  },
  methods: {
    formatNum,
    getCustList() {
      Toast.loading({
        message: "正在加载",
        forbidClick: true,
        duration: 0,
      });
      this.pageIndex++;
      let params = {
        pageNum: this.pageIndex.toString(),
        pageSize: "10",
        cstName: "",
        ctcTel: "",
        certNum: "",
        cstLvl: this.cstLvl,
        svcLvl: this.svcLvl,
        belongOrg: this.chooseOrg.value,
        orderType: '',
      };
      if (this.searchValue) {
        if (this.searchValue.length == 11) {
          params.ctcTel = this.searchValue;
        } else if (this.searchValue.length == 18) {
          params.certNum = this.searchValue;
        } else {
          params.cstName = this.searchValue;
        }
      }
      this.params = JSON.stringify(params);
      queryCustSearchList(params, (res) => {
        console.log('params',params,res)
        if (res.data && res.data.records) {
          Toast.clear();
          this.total = res.data.total.toLocaleString();
          this.custList = this.custList.concat(res.data.records);
          if (this.custList.length >= this.total) this.finished = true;
        } else {
          Toast.fail("存量客户列表数据为空");
          this.finished = true;
        }
        this.loading = false;
      });
    },
    activeOrg(orgValue) {
      if (orgValue.value) {
        this.chooseOrg = orgValue;
      } else {
        this.chooseOrg = {
          text: "归属机构",
          value: "",
        };
      }
      this.$refs.orgDrop.toggle(false);
      this.reload();
    },
    reload() {
      this.loading = true;
      this.finished = false;
      this.pageIndex = 0;
      this.custList = [];
      this.showBatchSend = false;
      this.getCustList();
    },
    gaveCall(phone) {
      AlipayJSBridge.call("callHandler", {
        phone,
      });
    },
    gaveMessage() {
      Toast("功能开发中...");
    },
    goCustView(item) {
      Toast("功能开发中...");
    },
    msgBatchSend(sendAll) {
      Toast("功能开发中...");
    },
    closeOrg() {
      this.$refs.orgDrop.toggle(false);
    },
    /* 点击排序 */
    changeOrder(i) {
      if (i == this.orderIndex) {
        this.orderType = !this.orderType;
      } else {
        this.orderIndex = i;
        this.orderType = true;
      }
      this.params.orderType = `${['aumDifVal','aumBal','loanBal'][i]}${this.orderType ? 'D' : 'Z'}`
      this.pageIndex = 0;
      this.custList = [];
      this.onLoad();
    },
    tageListChange(v) {
      console.log(v);
    },
    onLoad() {
      this.finished = false;
      Toast.loading({
        message: "正在加载",
        forbidClick: true,
        duration: 0,
      });
      this.params.pageNum = (++this.pageIndex).toString();
      this.params.orgId = this.chooseOrg.value;
      this.loading = true;
      queryCustSearchList(this.params, (res) => {
        if (res.data && res.data.records) {
          this.total = res.data.total;
          this.custList = this.custList.concat(res.data.records);
          this.checkAll = false;
          if (this.custList.length >= res.data.total) this.finished = true;
        } else {
          this.finished = true;
        }
        this.$nextTick(() => {
          Toast.clear();
          this.loading = false;
          this.$forceUpdate();
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  font-size: 0.14rem;
  .top {
    position: fixed;
    // top: 0;
    width: 100%;
    // min-height: 0.5rem;
    // border: 0.005rem solid black;
    z-index: 2;
    .searchBox {
      width: 100%;
      height: 0.5rem;
      background-color: #ffffff;
      padding: 0 8%;
    }
    .orderList {
      width: 100%;
      display: flex;
      // flex-wrap: nowrap;
      justify-content: space-around;
      padding: 0.14rem 0;
      background: #fff;
      border-bottom: solid 0.01rem #f0f0f0;
      border-top: solid 0.01rem #f0f0f0;
      .orderItem {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }
    }
    &:deep(.van-tabs__nav--card) {
      margin: 0;
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
    .listNum {
      background: pink;
      font-size: 0.1rem;
      color: #262626;
      line-height: 0.4rem;
      width: 100%;
      height: 0.4rem;
      padding: 0 3.5%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      background-color: #f5f6fa;
      .sendAll {
        color: rgba(2, 109, 255, 1);
        font-size: 0.14rem;
      }
    }
  }
	.custItem {
		width: 93.6%;
		margin: 0.12rem auto;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
    .custItem1 {
      width: 100%;
      height: 0.44rem;
      display: flex;
      flex-wrap: nowrap;
      .custItem1_2 {
        display: flex;
        flex-wrap: wrap;
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
            .vipCstFlg,
            .agentPayCstFlg,
            .basicCstCnt,
            .merntCstFlg,
            .ioinHoldLoan{
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
              background-color: rgba(2,109,255,0.08);
              color: #026DFF;
            }
            .agentPayCstFlg {
              background-color: rgba(255,133,0,0.08);
              color: #FF8500;
            }
            .basicCstCnt {
              background-color: rgba(255,58,58,0.08);
              color: #FF3A3A;
            }
            .merntCstFlg {
              background-color: rgba(68,107,161,0.08);
              color: #446BA1;
            }
            .ioinHoldLoan {
              background-color: rgba(55,205,55,0.08);
              color: #13AD13;
            }
        }
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
    }
	}
	.custItem2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.12rem;
		margin-bottom: 0.04rem;
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
	}
	.custItem3 {
		width: 100%;
		margin: 0 auto 0.1rem;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}
  .bottomText {
    display: flex;
    font-size: 0.12rem;
    &>div {
      width: 50%;
      text-align: left;
      letter-spacing: 0;
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

.msgItem {
  width: 93%;
  margin: 0 auto 0.1rem;
  padding: 0.11rem 0 0.11rem 0.11rem;
  background-color: #ffffff;
  border-radius: 0.05rem;
  display: flex;
  box-shadow: 0rem 0rem 0.06rem -0.04rem #888888;
  text-align: left;
}

.msgItem * {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.msgItem1 {
  width: 8%;
  display: flex;
  text-align: center;
  align-items: center;
  flex-shrink: 0;
}

.msgItem2 {
  width: 30%;
  line-height: 0.2rem;
  font-size: 0.13rem;
  color: #666666;
  padding: 0.1rem 0;
  flex-shrink: 0;
}

.msgItem3 {
  width: 20%;
  display: flex;
  flex-shrink: 0;
}

.msgItem3 > div {
  width: 48%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 85%;
}

.msgItem4 {
  width: 62%;
  line-height: 0.2rem;
  font-size: 0.13rem;
  color: #666666;
  flex-shrink: 1;
}

.msgItem5 {
  width: 8%;
  display: flex;
  text-align: center;
  align-items: center;
  flex-shrink: 0;
}

.sendMsgBtnBox {
  width: 100%;
  border-top: solid 1px #dfefff;
  height: calc(constant(safe-area-inset-bottom) + 0.6rem);
  height: calc(env(safe-area-inset-bottom) + 0.6rem);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: 3.5%;
  padding-right: 3.5%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.sendMsgBtn {
  width: 42.5%;
  line-height: 0.35rem;
  font-size: 0.15rem;
  border: solid 1px #3399ff;
  background-color: #e2f7ff;
  color: #3399ff;
  text-align: center;
  border-radius: 1.599147rem;
}
</style>
