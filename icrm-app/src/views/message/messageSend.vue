<template>
  <div class="home">
    <nav-bar title="短信审批列表" leftIcon />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="vanList"
    >
      <div
        v-for="(msgItem, i) in msgList"
        :key="'msgItem' + i"
        class="msgCardOutBox"
      >
        <div class="msgCardBox" @click="openDetail(msgItem)">
          <div class="msgCard">
            <div class="msgValue1">
              <div class="msgValue1Left ycsl">{{ msgItem.tplNm }}</div>
              <div class="msgValue1Right">
                <div
                  class="msgValue1RightItem"
                  style="background-color: #026dff"
                >
                  {{ msgItem.tplTp }}
                </div>
                <div
                  class="msgValue1RightItem"
                  :style="{
                    'background-color':
                      msgItem.exapSt == '审批通过'
                        ? '#52C41A'
                        : msgItem.exapSt == '审批中'
                        ? '#026DFF'
                        : '#FF3A3A',
                  }"
                >
                  {{ msgItem.exapSt }}
                </div>
              </div>
            </div>
            <div class="msgValue2">
              <div class="msgValue2Left ycsl">
                <span class="msgTitleColor">短信条数：</span>
                <span>{{ msgItem.shrtmsgNum }}</span>
              </div>
              <div class="msgValue3Right">{{ msgItem.aplyTm }}</div>
            </div>
            <div class="msgValue3"></div>
            <div class="msgValue4">
              <div class="msgValue4Left ycsl">
                <span class="msgTitleColor">机构名称：</span>
                <span>{{ msgItem.belongOrgName }}</span>
              </div>
              <div class="msgValue4Right ycsl">
                <span class="msgTitleColor">客户经理：</span>
                <span>{{ msgItem.aplyUsrName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <div class="bottomZW"></div>
    <van-overlay :show="showApprove" @click="showApprove = false">
      <div class="wrapper"  @click.stop>
        <div class="block">
            <div class="formList">
              <van-cell-group title="审批">
                <div class="flexWrap">
                  <van-field
                    v-model="shrtmsgCntnt"
                    input-align="left"
                    border
                    maxlength="200"
                    autosize
                  
                    type="textarea"
                    readonly
                  >
                    <template #label>
                      <span>短信内容</span>
                    </template>
                  </van-field>
                </div>
                <van-field>
                  <template #label>
                    <span>审批结果</span>
                    <span style="color: #026dff; margin-left: 0.01rem">*</span>
                  </template>
                  <template #input>
                    <div class="busiBox">
                      <div
                        class="busiItem ycsl"
                        v-for="(approveItem, i) in approveTypeList"
                        :key="'approveItem' + i"
                        :class="i == approveIndex ? 'busiItem_a' : ''"
                        @click="approveIndex = i"
                      >
                        {{ approveItem.codeName }}
                      </div>
                    </div>
                  </template>
                </van-field>
                <div class="flexWrap">
                  <van-field
                    v-model="exapOpnn"
                    input-align="left"
                    border
                    autosize=""
                    maxlength="100"
                    rows="4"
                    type="textarea"
                  >
                    <template #label>
                      <span>审批意见</span>
                    </template>
                  </van-field>
                </div>
                
              </van-cell-group>
            </div>
            <div class="btnStyle">
                <van-button plain  type="primary" @click="showApprove = false">取消</van-button>
                <van-button  type="primary" @click="saveApprove">提交</van-button>
            </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Toast, Dialog,Overlay,Button  } from "vant";
import { queryMessageApproveList,approveMessageSendApply } from "../../request/market.js";
export default {
  data() {
    return {
      showApprove: false,
      finished: false,
      pageIndex: 0,
      approveIndex: null,
      shrtmsgCntnt:'',
      exapOpnn:'',
      formData:{

      },
      approveTypeList: [
        {
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
    saveApprove(){
      console.log(' this.approveIndex',this.approveIndex)

      let params = {
        id: this.formData.id,
        aplyRl:this.formData.aplyRl,
        exapSt: this.approveIndex+2,
        exapOpnn: this.exapOpnn,
      };
      if(this.approveIndex==null){
        Toast.fail("请选择审批结果");
					return false;
      }
      if(!params.exapOpnn && params.exapSt=='3'){
        Toast.fail("请输入审批意见");
					return false;
      }
      this.params = JSON.stringify(params);
      console.log('params',params)
      approveMessageSendApply(params, (res) => {
        if (res.data) {
          this.showApprove = false;
					Toast.success("审批成功");
          this.approveIndex=null;
          this.exapOpnn=''
          // this.$router.go(0)
          this.pageIndex=0
          this.msgList=[]
          // this.finished=false
          // this.loading=true
          this.onLoad()
        } else {
					Toast.fail("审批失败");
          
        }
        this.loading = false;
      });
    },
    openDetail(elment) {
      console.log('elment',elment)
      if(elment.exapSt=='审批中'){
        this.showApprove = true;
      }else{
        this.showApprove = true;

        // return false
      }
      this.formData=elment
      this.shrtmsgCntnt=elment.shrtmsgCntnt
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
        exapSt: "",
        belongOrg: "",
        userId: "",
      };
      console.log('params2',params)
      this.params = JSON.stringify(params);
      queryMessageApproveList(params, (res) => {
        if (res.data && res.data.records) {
          Toast.clear();
          this.allNum = res.data.total.toLocaleString();
          this.msgList = this.msgList.concat(res.data.records);
          if (this.msgList.length >= this.allNum) this.finished = true;
          console.log("this.msgList", this.msgList);
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

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
}
.home {
  overflow: hidden;
  background-color: #f5f5f5;
}
.vanList {
  margin-top: 0.2rem;
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
  background-color: #ffffff;
  box-shadow: 0 0 0.08rem -0.02rem #e0e0e0;
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
  background-color: #2c3e50;
  color: #ffffff;
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
  border-bottom: solid 0.01rem #f5f5f5;
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
:deep(.van-cell) {
  background-color: #ffffff;
  font-size: 0.16rem;
  padding: 0.15rem 0.15rem;
}
.flexWrap {
  width: 100%;
}
.flexWrap /deep/ .van-field__body{
  overflow: auto;
}
.flexWrap :deep(.van-cell) {
  flex-wrap: wrap;
}

.flexWrap :deep(.van-cell__title) {
  width: 100%;
  margin-right: 0;
  text-align: left;
}

.flexWrap :deep(.van-cell__value) {
  width: 100%;
  margin-right: 0;
  text-align: left;
  border: solid 1px #dddddd;
  border-radius: 0.08rem;
  padding: 0.1rem 0.1rem;
  margin-top: 0.1rem;
  font-size: 0.12rem;
  color: #8C8C8C;
}
.busiBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  margin-bottom: -0.1rem;
  text-align: right;
}

.busiItem {
  width: 0.76rem;
  font-size: 0.13rem;
  padding: 0.03rem 0;
  text-align: center;
  margin: 0 calc(10% / 6) 0.09rem;
  border: solid 0.01rem #e3e3e3;
  color: #4f4f4f;
  border-radius: 0.03rem;
}

.busiItem_a {
  background: url(../../assets/image/cust_zyqk_busiItem_a.png) no-repeat center;
  background-size: 100% 100%;
  border: solid 0.01rem #def1ff;
  color: #026aff;
}
 .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
	   border-radius: 0.08rem;

  }
   .block {
    position: relative;
    width: 90%;
    height: 68%;
    background-color: #fff;
	   border-radius: 0.08rem;
     overflow: auto;


  }
  .formList{
    width: 100%;
    height: 5rem;
    overflow: auto;
  }
  /* .block /deep/ .van-cell-group{
    height: 80%;
    overflow: auto;
  } */
  .block /deep/ .van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after{
    border-width:0px ;
  }
  .block /deep/ .van-cell-group__title{
    font-size: 0.16rem;
    color: #262626;
  }
  .btnStyle{
    width:100%;
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 00.16rem;
  }
  .btnStyle /deep/ .van-button--primary{
    width: 1.08rem;
    height: 0.3rem;
    /* background: #026DFF; */
    border-radius: 0.15rem;
  }
  .btnStyle /deep/.van-button--plain.van-button--primary{
    border:0.01rem solid #026aff;
  }
</style>
