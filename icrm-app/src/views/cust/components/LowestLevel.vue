<template>
  <div class="plate5">
    <div class="plate5_item" @click="openMbox(false)">
      <div :class="`plate5_item_icon ${this.custBase.ctcTel ? 'dx' : 'dx_g' }`"></div>
      <div class="plate5_item_text">发送短信</div>
    </div>
    <div class="plate5_item" @click="callPhone">
      <div :class="`plate5_item_icon ${this.custBase.ctcTel ? 'dh' : 'dh_g' }`"></div>
      <div class="plate5_item_text">拨打电话</div>
    </div>
    <div class="plate5_item" @click="openVisit">
      <div class="plate5_item_icon bf"></div>
      <div class="plate5_item_text">登门拜访</div>
    </div>
  </div>
  <!-- 打电话 -->
  <van-overlay :show="showCall" style="z-index: 99;">
    <div class="plate6">
      <div class="plate6_1">提示</div>
      <div class="plate6_5">是否拨打电话：{{ custBase.ctcTel }}</div>
      <div class="plate6_4">
        <div class="palte6_4_1" @click="showCall = false">取消</div>
        <div class="palte6_4_2" @click="openMbox(true)">确定</div>
      </div>
    </div>
  </van-overlay>
  <!-- 发短信组件 -->
  <send-message ref="sendMessage" @commitSuccess="sendSuccess" />
  <!-- 登门拜访 -->
  <van-popup class="dmbf" v-model:show="showVisit" round position="bottom" z-index="99999" :close-on-click-overlay="false">
    <div class="popTitle">
      <div class="popTitle1" @click="cancle">取消</div>
      <div class="popTitle2">登门拜访</div>
      <div class="popTitle3" @click="addVisit">添加</div>
    </div>
    <div class="popPlate1">
      <van-field v-model="followValue" type="textarea" placeholder="请输入拜访记录（非必填）" rows="5" autosize maxlength="150"/>
    </div>
    <div class="popPlate2">
      <div class="cameraBox" v-for="(photo, i) in photoList" :key="'photo' + i">
        <van-icon class="delBtn" :name="require('@/assets/image/common_delete.png')" color="##8C8C8C" size="20" @click="delPhoto(i)"/>
        <div class="imgBox" @click="openPhoto('data:image/jpeg;base64,' + photo.url)">
          <img :src="'data:image/jpeg;base64,' + photo.url" />
        </div>
      </div>
      <div class="cameraBox" v-if="photoList.length < 8" @click="openCamera">
        <van-icon name="photograph" color="#BFBFBF" size="32" />
      </div>
    </div>
    <div class="popPlate3">
      <van-icon :name="require('@/assets/image/common_dingwei_blue.png')" size="15" style="margin-right: 0.04rem; flex-shrink: 0; padding: 0.03rem 0"/>
      <div class="popPlate3_1" v-if="openLocation">
        <div class="popPlate3_1_1">{{ dingwei.split("------")[1] ? dingwei.split("------")[1] : dingwei.split("------")[0]}}</div>
        <div class="popPlate3_1_2">{{ dingwei.split("------")[1] ? dingwei.split("------")[0] : "" }}</div>
      </div>
      <div class="popPlate3_1" v-else>
        <div class="popPlate3_1_1">未获取到定位信息！</div>
        <div class="popPlate3_1_2">请确认设备是否已开启APP定位权限及GPS信号是否正常</div>
      </div>
      <van-icon class="popPlate3_2" :name="require('@/assets/image/common_reset.png')" size="20" @click="getLocation"/>
    </div>
    <div class="bottomZW"></div>
  </van-popup>
</template>

<script>
import { custServiceAdd, custServUpload } from "@/request/custinfo.js";
import { Toast, ImagePreview } from "vant";
import sendMessage from "@/components/common/sendMessage.vue";
export default {
  components: {
    sendMessage,
  },
  props: {
    custBase: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      openLocation: true,
      followValue: "",
      photoList: [],
      dingwei: "",
      showVisit: false,
      showCall: false,
    };
  },
  methods: {
    callPhone(){
      if(!this.custBase.ctcTel){
        return
      }
      this.showCall = true
    },
    /* 发送短信 */
    openMbox(type) {
      if(!this.custBase.ctcTel){
        return
      }
      if (isNaN(this.custBase.ctcTel)) {
        Toast.fail("电话号码格式有误");
        return;
      }
      if (type) {
        AlipayJSBridge.call(
          "callHandler",
          { phone: this.custBase.ctcTel },
          (res) => {
            if (res.status == "000000") {
              let body = {
                custName: this.custBase.cstName,
                custNo: this.custBase.custNum,
                mobileNum: this.custBase.ctcTel,
                communictionChannel: "02",
                custType: '1',
              };
              custServiceAdd(body, (ress) => {
                this.showCall = false;
              });
            } else {
              Toast.fail(res.msg);
            }
          }
        );
      } else {
        this.$refs.sendMessage.openMbox({
          type: "",
          searchData: {},
          list: [
            {
              cstName: this.custBase.cstName,
              custNum: this.custBase.custNum,
              ctcTel: this.custBase.ctcTel,
            },
          ],
          shrtmsgCnl: "1",
        });
      }
    },
    /* 发短信的回调 */
    sendSuccess(msg) {},
    /* 登门拜访 */
    openVisit() {
      this.followValue = "";
      this.photoList = [];
      this.dingwei = "";
      this.showVisit = true;
      this.getLocation();
    },
    /* 获取位置信息 */
    getLocation() {
      this.openLocation = true;
      this.dingwei = "正在获取位置信息...";
      AlipayJSBridge.call("getLocation", {}, (res) => {
        if (res.status == "000000") {
          this.dingwei = res.result;
        } else {
          this.openLocation = false;
        }
      });
    },
    /* 登门拜访取消 */
		cancle() {
			this.showVisit = false;
		},
    /* 登门拜访添加 */
		addVisit() {
			if (this.photoList.length < 1) {
				Toast.fail("请至少上传一张照片");
				return;
			}
			if (this.dingwei == "") {
				Toast.fail("请先获取定位信息");
				return;
			}
			if (this.dingwei == "正在获取位置信息...") return;
			Toast.loading({
				message: "正在提交",
				forbidClick: true,
				duration: 0
			});
      let body = {
        custName: this.custBase.cstName,
        custNo: this.custBase.custNum,
        mobileNum: this.custBase.ctcTel,
        communictionChannel: "01",
        custType: '1',
        uploadIds: this.photoList.map(item => item.tableKey)
      };
			custServiceAdd(body, (res) => {
				// this.getFollowMsg();
        if(res && res.data){
          Toast.success(res.msg)
          this.showVisit = false;
        }else{
          if(res.msg){
            Toast.fail(res.msg)
          }else{
            Toast.clear();
          }
        }
			})
		},
		delPhoto(i) {
			this.photoList.splice(i, 1)
		},
		openPhoto(file) {
			ImagePreview({
				images: [file],
				showIndex: false
			});
		},
		openCamera() {
			AlipayJSBridge.call('openPickerV', {openType: "0"}, (res1) => {
				if (res1.status == "000000") {
					Toast.loading({	message: "正在上传", forbidClick: true, duration: 0 });
					custServUpload({file: res1.result},(res2)=>{
						Toast.success("上传成功");
						this.photoList.push({
							url: res1.result,
							tableKey: res2.data[0].tableKey
						})
					})
				} else if (res1.status != "000004") {
					Toast.fail(res1.msg)
				}
			});
		},
  },
};
</script>

<style lang="less" scoped>
.plate5 {
  width: 80%;
  height: calc(constant(safe-area-inset-bottom) + 0.4rem);
  height: calc(env(safe-area-inset-bottom) + 0.4rem);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 -0.005rem 0 0 rgba(0, 0, 0, 0.3);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.05rem 0.4rem;
  .plate5_item_icon {
    margin: 0 auto;
    width: 0.24rem;
    height: 0.24rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-bottom: 0.04rem;
  }
  .dx {
    background-image: url(~@/assets/image/business_detail_message.png);
  }
  .dx_g {
    background-image: url(~@/assets/image/dx_gray.png);
  }
  .dh {
    background-image: url(~@/assets/image/business_detail_call.png);
  }
  .dh_g {
    background-image: url(~@/assets/image/dh_gray.png);
  }
  .bf {
    background-image: url(~@/assets/image/business_detail_visit.png);
  }
  .plate5_item_text {
    height: 0.18rem;
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #262626;
    letter-spacing: 0;
    line-height: 0.18rem;
    font-weight: 400;
  }
}
.plate6 {
  width: 68%;
  background: #ffffff;
  border-radius: 0.08rem;
  position: absolute;
  top: calc(50% - 1rem);
  left: 12.65%;
  padding: 0.2rem 0.12rem;
  .plate6_1 {
    width: 100%;
    height: 0.22rem;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #262626;
    text-align: center;
    line-height: 0.22rem;
    font-weight: 500;
    margin-bottom: 0.24rem;
  }
  .plate6_2 {
    width: 100%;
    height: 0.24rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .plate6_3 {
    width: 100%;
    height: 0.27rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.08rem;
    .plate6_3_1 {
      margin-left: 0;
    }
    .plate6_3_2 {
      margin-left: 0.125rem;
    }
  }
  .plate6_4 {
    width: 100%;
    height: 0.3rem;
    margin-top: 0.24rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    .palte6_4_1 {
      width: 1.08rem;
      height: 0.3rem;
      border: 0.01rem solid #026dff;
      border-radius: 0.15rem;
      font-family: PingFangSC-Medium;
      font-size: 0.13rem;
      color: #026dff;
      text-align: center;
      line-height: 0.3rem;
      font-weight: 500;
    }
    .palte6_4_2 {
      width: 1.08rem;
      height: 0.3rem;
      background: #026dff;
      border-radius: 0.15rem;
      font-family: PingFangSC-Medium;
      font-size: 0.13rem;
      color: #ffffff;
      text-align: center;
      line-height: 0.3rem;
      font-weight: 500;
    }
  }
  .plate6_5 {
    width: 100%;
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #262626;
    text-align: center;
    line-height: 0.22rem;
    font-weight: 400;
    margin-bottom: 0.24rem;
  }
}
.dmbf {
  background-color: #f8f8f8;
  height: 80%;
  .popTitle {
		width: 100%;
		height: 0.51rem;
		background: #F8F8F8;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		font-family: PingFangSC-Regular;
		font-size: 0.16rem;
		letter-spacing: 0;
		font-weight: 400;
		position: relative;
    .popTitle1 {
      position: absolute;
      left: 0.16rem;
      color: #8C8C8C;
    }
    .popTitle2 {
      color: #262626;
      font-size: 0.18rem;
      font-weight: 500;
    }
    .popTitle3 {
      position: absolute;
      right: 0.16rem;
      color: #026DFF;
    }
	}
	.popPlate1 {
		width: calc(100% - 0.48rem);
		padding: 0.12rem;
		margin: 0.08rem 0.12rem 0;
    background-color: #f8f8f8;
		border-radius: 0.08rem;
	}
	.popPlate2 {
		width: calc(100% - 0.48rem);
		padding: 0.12rem 0.12rem 0;
		margin: 0.12rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	.popPlate3 {
		width: calc(100% - 0.48rem);
		padding: 0.12rem;
		margin: 0.12rem auto;
		background: #FFFFFF;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		position: relative;
    .popPlate3_1 {
      max-width: 85%;
    }
    .popPlate3_1_1 {
      font-family: PingFangSC-Medium;
      font-size: 0.14rem;
      color: #262626;
      letter-spacing: 0;
      line-height: 0.21rem;
      font-weight: 500;
      text-align: left;
      margin-bottom: 0.02rem;
    }
    .popPlate3_1_2 {
      font-family: PingFangSC-Regular;
      font-size: 0.12rem;
      color: #8C8C8C;
      letter-spacing: 0;
      line-height: 0.18rem;
      font-weight: 400;
      text-align: left;
    }
    .popPlate3_2 {
      position: absolute;
      top: 0.12rem;
      right: 0.12rem;
    }
	}
	.cameraBox {
		width: 0.73rem;
		height: 0.73rem;
		background: #F8F8F8;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin-bottom: 0.12rem;
		margin-right: calc(calc(100% - 2.92rem) / 3);
		position: relative;
    .delBtn {
      position: absolute;
      top: -0.06rem;
      right: -0.06rem;
    }
    .imgBox {
      width: 100%;
      height: 100%;
      border-radius: 0.08rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      img {
        width: 100%;
      }
    }
	}
	.cameraBox:nth-child(4n) {
		margin-right: 0;
	}
}
</style>