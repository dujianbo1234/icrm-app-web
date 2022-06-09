<template>
  <div class="addNewRecord">
    <!-- 顶部title -->
    <nav-bar type="2" title="新增记录" leftIcon />
    <!-- 会议记录 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">会议记录</div>
      </div>
      <div class="card">
        <div style="display: flex">
          <el-input type="textarea" :rows="4" placeholder="请输入会议记录…" v-model="textarea"></el-input>
        </div>
        <div class="minutesList">
          <van-field v-model="creatUser" label="创建人" size="large" input-align="right" :border="false" placeholder="请输入"/>
          <van-field v-model="orgValue.text" is-link readonly label="机构" size="large" input-align="right" :border="false" placeholder="请选择" @click="$refs.orgList.showPopup()"/>
          <van-field v-model="creatDate" label="创建时间" size="large" input-align="right"/>
        </div>
      </div>
    </div>
    <!-- 音频管理 -->
    <div class="audioManagement">
      <div class="title">
        <div class="label">音频管理</div>
      </div>
      <div class="audio">
        <play-audio ref="PlayAudio" :audioTitle="audioItem.name" :totalDuration="totalDuration" @playStop="playStop"></play-audio>
        <div class="audioList">
          <div class="audioList_title">录音记录</div>
          <div class="audioList_list">
            <div v-for="(item, index) in fileList_audio" :key="item">
              <div class="list_item" @click="selectSound(item, index)">
                <van-icon :name="require(`@/assets/image/play-mp3.png`)" size="0.35rem" style="margin-right: 0.04rem;" />
                <div class="audioName" :style="{color : iconSize == index ? '#026DFF' : '#131313'}">{{item.name}}</div>
              </div>
            </div>
            <div >
              <div class="list_item" @click="uploadAudio(0)">
                <van-icon :name="require(`@/assets/image/index_upload.png`)" size="0.735rem" color="#E6E6E6"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 会议照片 -->
    <div class="meetingPhotos">
      <div class="title">
        <div class="label">会议照片</div>
      </div>
      <div class="imgContent">
        <van-uploader v-model="fileList_img" preview-size="0.78rem" accept="image/*"/>
      </div>
    </div>
    <!-- 新增记录 -->
    <div class="addRecord">
      <van-button class="addBtn" type="primary" block @click="addNewRecord">保存</van-button>
    </div>
    <!-- 选择机构组件 -->
    <org-list ref="orgList" :type="2" @activeOrg="activeOrg" />
    <!-- 这是底线 -->
    <div class="bottomLine">
      <span></span>
      <div class="bottomText">到底啦，我是有底线的</div>
      <span></span>
    </div>
  </div>
</template>

<script>
import PlayAudio from "@/components/common/PlayAudio.vue"
import moment from "moment";
export default {
  name: "addNewRecord",
  components: {
    PlayAudio
  },
  data() {
    return {
      textarea: "",
      creatUser: this.$store.state.userMsg.empname,
      orgValue: {},
      creatDate:'2021-05-18 08:00-10:00',
      audioItem: {},
      fileList_audio: [],
      totalDuration: 0, // 录音总时长(毫秒)
      initFileList: [
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://cloud-image', isImage: true },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://cloud-image', isImage: true },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
      ],
      fileList_img: [
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
      ],
      audioFile: 'file:///private/var/mobile/Containers/Data/Application/C9BBC1D5-B1B2-40CD-A53D-E1BB821ADE94/tmp/com.JJbank.pactera-Inbox/%E9%87%91%E8%9E%8D%E6%B8%AF%E8%B7%AF.m4a'
    };
  },
  mounted() {
    this.fileList_audio = []
  },
  methods: {
    moment,
    /* 选择机构 */
    activeOrg(orgValue) {
      this.orgValue = orgValue
    },
    /* 选择录音 */
    selectSound(item, index){
      this.$refs['PlayAudio'].init()
      this.audioItem = item
      this.iconSize = index
      this.uploadAudio(1)
    },
    /* 音频控制 */
    uploadAudio(type){
      let body = {
        type: type,
        url: this.audioItem.url
      }
      AlipayJSBridge.call("openRecord", body, (res) => {
        switch (body.type) {
          case 0 :
            let obj = {
              url: res.result,
              name: decodeURI(res.result.substring(res.result.lastIndexOf("/")+1))
            }
            this.fileList_audio.push(obj)
          break;
          case 1 :
            this.totalDuration = Number(res.result).toFixed(0) || 0
          break;
          case 2 :
            // console.log('播放',res)
            if(res.msg == '播放完成'){
              this.$refs['PlayAudio'].init()
            }
          break;
          case 3 :
            console.log('暂停',res)
          break;
          case 4 :
            // 无法控制前进秒数单位(需改造接口)
            console.log('快进',res)
          break;
          case 5 :
            // 无法控制后退秒数单位(需改造接口)
            console.log('快退',res)
          break;
          case 6 :
            console.log('停止',res)
          break;
        }
      });
    },
    /* 播放暂停按钮 */
    playStop(v){
      if(this.fileList_audio.length > 0 && this.audioItem.name){
        this.uploadAudio(v)
      }
    },
    /* 保存 */
    addNewRecord(){

    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>
<style lang="less" scoped>
.addNewRecord {
  .card {
    background: #fff;
    padding: 0.12rem;
    border-radius: 0.08rem;
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0.12rem;
    font-size: 0.15rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .label {
      color: #222222;
    }
  }
  .minutesMeeting {
    .minutesList {
      // background: pink;
      font-size: 0.15rem;
      --van-field-label-color: #222222;
      & > div {
        // display: flex;
        // justify-content: space-between;
        padding: 0.12rem 0;
      }
      div:nth-child(2) {
        border-top: 0.005rem solid #e5e5e5;
        border-bottom: 0.005rem solid #e5e5e5;
      }
      div:nth-child(3) {
        padding-bottom: 0;
      }
    }
  }
  .audioManagement {
    .audio {
      background: #fff;
      padding: 0.12rem 0.12rem 0 0.12rem;
      .audioList {
        padding-top: 0.36rem;
        font-size: 0.15rem;
        color: #131313;
        .audioList_title {
          text-align: left;
        }
        .audioList_list {
          width: 100%;
          overflow: hidden;
          &>div {
            display: flex;
            float: left;
            width: 25%;
            height: 1.025rem;
            .list_item {
              font-size: 0.15rem;
              margin: auto;
              .audioName {
                max-width: 0.8rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
  .meetingPhotos {
    .imgContent {
      background: #fff;
      border-radius: 0.08rem;
      border: 0.005rem solid #E5E5E5;
      padding: 0.12rem 0 0 0.12rem;
      width: 100%;
      display: flex;
      &:deep(.van-uploader__preview){
        margin: 0 0.12rem 0.12rem 0;
      }
    }
  }
  .addRecord {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: #fff;
    padding: 0.12rem 0.15rem 0.46rem;
    .addBtn {
      border-radius: 0.08rem;
    }
  }
  .bottomLine {
    width: 60%;
    margin: 0.5rem auto 0.35rem;
    padding-bottom: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
      width: 10.7%;
      height: 0.005rem;
      opacity: 0.7;
      border-top: 0.005rem solid rgba(191, 191, 191, 1);
    }
    .bottomText {
      margin: 0 2.7%;
      font-size: 0.12rem;
      padding: 0 0.1rem;
      color: #bfbfbf;
    }
  }
}
</style>