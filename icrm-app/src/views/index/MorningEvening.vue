<template>
  <div class="MorningEvening">
    <!-- 顶部title -->
    <nav-bar type="2" title="晨夕会" leftIcon/>
    <!-- 日历 -->
    <div class="calendar">
      <div class="date">{{showTime}}</div>
      <span class="toDay" @click="toDay">当日</span>
    </div>
    <!-- 日历选择器 -->
    <div class="arrow">
      <!-- 2022.06.24 -->
      <van-calendar ref="calendar" :default-date="defaultDate._d" :min-date="minDate._d" :max-date="maxDate._d" row-height="40" :poppable="false" teleport=".arrow" color="#026DFF" :show-confirm="false" :show-title="false" :show-subtitle="false" :safe-area-inset-bottom="false" :style="{ height: '3rem' }" @select="selectDate" v-if="showWeekDetial"/>
      <!-- 分割线 -->
      <van-divider style="margin: 0; padding: 0 0.12rem;" @click.stop="showDate"><van-icon :name="showWeekDetial ? 'arrow-up' : 'arrow-down'" size="0.22rem" color="#ccc"/></van-divider>
    </div>
    <!-- 会议记录 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">会议记录</div>
        <div class="editBtn" @click="minutesEdit">{{minuDisabled ? '编辑' : '保存'}}</div>
      </div>
      <div class="card">
        <div style="display: flex">
          <el-input type="textarea" :rows="4" :disabled="minuDisabled" placeholder="请输入内容" v-model="textarea"></el-input>
        </div>
        <div class="minutesList">
          <div>
            <span>创建人</span>
            <span>李白</span>
          </div>
          <div>
            <span>机构</span>
            <span>九江银行八里湖支行</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>2021-12-01 08:00-10</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 音频管理 -->
    <div class="audioManagement">
      <div class="title">
        <div class="label">音频管理</div>
        <!-- <div class="editBtn">编辑</div> -->
      </div>
      <div class="card">
        <play-audio ref="PlayAudio" :audioTitle="audioTitle"></play-audio>
        <div class="audioList">
          <div class="audioList_title">录音记录</div>
          <div class="audioList_list">
            <template v-for="(item, index) in audioList" :key="item">
              <div v-if="openPlay ? index < 4 : true">
                <div class="list_item" @click="selectSound(item, index)" v-if="openPlay ? index < 3 : true">
                  <van-icon :name="require(`@/assets/image/play-mp3.png`)" :size="iconSize == index ? '0.45rem' : '0.3rem'" style="margin-right: 0.04rem;" />
                  <div :style="{color : iconSize == index ? '#026DFF' : '#131313'}">{{item}}</div>
                </div>
                <div class="list_item" v-if="openPlay && index == 3" @click="openPlay = !openPlay">
                  <van-icon name="ellipsis" size="0.3rem" color="#E6E6E6"/>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 会议照片 -->
    <div class="meetingPhotos">
      <div class="title">
        <div class="label">会议照片</div>
        <div class="editBtn" @click="deleBtn">{{deletable ? '保存' : '编辑'}}</div>
      </div>
      <div class="imgContent">
        <van-uploader v-model="fileList" :upload-icon="require('@/assets/image/common_more.png')" preview-size="1.1rem" :deletable="deletable" :readonly="true" :show-upload="initFileList.length > 5 && showUpload" @click-upload="clickUpload" @delete="deleteImg"/>
      </div>
    </div>
    <!-- 新增记录 -->
    <div class="addRecord">
      <van-button class="addBtn" type="primary" block @click="addNewRecord">新增记录</van-button>
    </div>
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
import moment from 'moment';
export default {
  name: 'MorningEvening',
  components: {
    PlayAudio
  },
  data() {
    return {
      showWeekDetial: true,
      defaultDate: moment(),
      showTime: moment().format('YYYY年MM月DD日'),
      minDate: moment().subtract(3, 'month'),
      maxDate: moment(),
      textarea: '测试内容',
      minuDisabled: true,
      iconSize: 0,
      openPlay: true,
      openImg: true,
      audioList: ['录音1','录音2','录音3','录音4','录音5'],
      audioTitle: '',
      showUpload: true,
      deletable: false,
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
      fileList: []
    };
  },
  /* 判断是从哪个路由过来的，若是判断是否需要开启缓存 */
  beforeRouteEnter(to, from, next) {
    if(from.name === 'addNewRecord') {
      to.meta.keepAlive = true;
    }else{
      to.meta.keepAlive = false;
    }
    next();
  },
  created(){
    this.audioList = ['录音1','录音2','录音3','录音4','录音5']
    this.audioTitle = this.audioList[0]
    this.fileList = this.initFileList.length > 5 ? this.initFileList.slice(0,5) : this.initFileList
  },
  methods: {
    moment,
    /* 展开或者收起日历 */
    showDate(){
      this.showWeekDetial = !this.showWeekDetial
    },
    /* 选中日期时 */
    selectDate(value){
      this.showTime = moment(value).format('YYYY年MM月DD日')
    },
    /* 当日 */
    toDay(){
      this.showTime = moment().format('YYYY年MM月DD日')
      this.$refs['calendar'].reset()
    },
    /* 会议记录修改 */
    minutesEdit(){
      this.minuDisabled = !this.minuDisabled
    },
    /* 新增记录 */
    addNewRecord(){
      this.$refs['PlayAudio'].init()
      this.$nextTick(()=>{
        this.$router.push('/addNewRecord')
      })
    },
    /* 选择录音 */
    selectSound(item, index){
      this.$refs['PlayAudio'].init()
      this.audioTitle = item
      this.iconSize = index
    },
    /* 点击上传区 */
    clickUpload(){
      this.showUpload = !this.showUpload
      this.fileList = this.initFileList
    },
    /* 编辑图片 */
    deleBtn(){
      this.deletable = !this.deletable
    },
    /* 文件删除时的回调 */
    deleteImg(v){
      if(this.showUpload){
        this.initFileList = this.initFileList.filter(item => item != v)
        this.fileList = this.initFileList.length > 5 ? this.initFileList.slice(0,5) : this.initFileList
      }
    }
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>
<style lang="less" scoped>
.MorningEvening {
  .card {
    background: #fff;
    padding: 0.12rem;
    border-radius: 0.08rem;
    border: 0.005rem solid #E5E5E5;
  }
  .calendar {
    position: relative;
    padding: 0.12rem;
    font-size: 0.15rem;
    text-align: center;
    border: 0.005rem solid #E5E5E5;
    background: #fff;
    .date {
      margin: 0 auto;
      color: #1D70F5;
    }
    .toDay {
      position: absolute;
      right: 0.12rem;
      top: 50%;
      transform: translateY(-50%);
      color: #1D70F5;
    }
  }
  .arrow {
    background: #fff;
    border-radius: 0 0 0.08rem 0.08rem;
    &:deep(.van-calendar__selected-day){
      width: 0.28rem;
      height: 0.28rem;
      border-radius: 50%;
    }
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
    .editBtn {
      color: #026DFF;
    }
  }
  .minutesMeeting {
    .minutesList {
      font-size: 0.15rem;
      &>div {
        display: flex;
        justify-content: space-between;
        padding: 0.12rem 0;
      }
      div:nth-child(1){
        span:nth-child(2) {
          font-size: 0.14rem;
          color: #666666;
        }
      }
      div:nth-child(2){
        border-top: 0.005rem solid #E5E5E5;
        border-bottom: 0.005rem solid #E5E5E5;
      }
      div:nth-child(3){
        padding-bottom: 0;
      }
    }
  }
  .audioManagement {
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
      padding: 0.11rem 0 0 0.11rem;
      width: 100%;
      display: flex;
      &:deep(.van-uploader__preview){
        margin: 0 0.11rem 0.11rem 0;
      }
      &:deep(.van-uploader__upload){
        background: #fff;
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
}
</style>