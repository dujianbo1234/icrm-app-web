<template>
	<div class="addNewRecord">
		<!-- 顶部title -->
		<div class="topTitle">
			<div class="left" @click="clearBtn">取消</div>
			<div class="mid">{{type ? '新增记录' : '修改记录'}}</div>
			<div class="right" @click="saveBtn">保存</div>
		</div>
		<!-- 会议记录 -->
		<div class="minutesMeeting">
			<div class="label">会议主题</div>
			<div class="card">
				<van-field v-model="soundRecCaption" rows="4" autosize type="textarea" maxlength="100"
					placeholder="请输入会议主题" show-word-limit />
			</div>
		</div>
		<!-- 上传录音 -->
		<div class="meetingPhotos">s
			<div class="label">上传录音</div>
			<div class="imgContent">
				<van-uploader ref="upload" v-model="soundList" :after-read="afterReads" :preview-full-image="false"
					max-count="3" preview-size="0.73rem" accept="audio/*, .m4a">
					<!-- <template #preview-cover="{ file }">
						<div class="preview-cover van-ellipsis">{{ file.name }}</div>
					</template> -->
					<template #default>
						<van-icon :name="require(`@/assets/image/index_upload.png`)" size="0.735rem" color="#E6E6E6"
							style="display: flex;" />
					</template>
				</van-uploader>
			</div>
		</div>
		<!-- <div class="audioManagement">
      <div class="label">上传录音</div>
      <div class="card">
        <div class="audioList_list">
          <div v-for="(item, index) in soundList" :key="item">
            <div class="list_item">
              <van-icon class="iconR" :name="require(`@/assets/image/play-mp3.png`)" size="0.35rem" >
                <van-icon class="iconA" :name="require(`@/assets/image/common_delete.png`)" size="0.2rem" @click.stop="itemDel(item, index)"/>
              </van-icon>
              <div class="audioName" :style="{color : iconSize == index ? '#026DFF' : '#131313'}">{{item.name}}</div>
            </div>
          </div>
          <div v-if="soundList.length < 3">
            <div class="list_item" @click="uploadAudio(0)">
              <van-icon :name="require(`@/assets/image/index_upload.png`)" size="0.735rem" color="#E6E6E6" style="display: flex;"/>
            </div>
          </div>
        </div>
      </div>
    </div> -->
		<!-- 会议照片 -->
		<div class="meetingPhotos">
			<div class="label">上传照片</div>
			<div class="imgContent">
				<van-uploader v-model="photoList" :after-read="afterRead" max-count="6" preview-size="0.73rem"
					accept="image/*" />
			</div>
		</div>
		<div class="bottomZW"></div>
	</div>
</template>

<script>
	import axios from 'axios' //引入
	import {
		memSoundUpload
	} from "@/api/api"
	import PlayAudio from "@/components/common/PlayAudio.vue"
	import moment from "moment";
	import {
		Toast
	} from 'vant';
	import {
		memSoundPicUpload,
		memSoundRecUpload,
		uploadImg,
		saveMemSoundRec
	} from "@/request/index"
	export default {
		name: "addNewRecord",
		components: {
			PlayAudio
		},
		props: {
			type: Boolean,
			record: Object
		},
		data() {
			return {
				soundRecCaption: "",
				// creatUser: this.$store.state.userMsg.empname,
				orgValue: {},
				// creatDate:'2021-05-18 08:00-10:00',
				audioItem: {},
				soundList: [],
				totalDuration: 0, // 录音总时长(毫秒)
				initFileList: [
					// // Uploader 根据文件后缀来判断是否为图片文件
					// // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
					{
						url: 'http://devmap.eqianjin.com.cn/icrmmap/home/appuser/jjbank/upload/sound/001343_2022061510591718.jpg'
					},
					// { url: 'https://cloud-image', isImage: true },
					// { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
					// { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
					// { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
					// { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
					// { url: 'https://cloud-image', isImage: true },
					// { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
				],
				photoList: []
				// audioFile: 'file:///private/var/mobile/Containers/Data/Application/C9BBC1D5-B1B2-40CD-A53D-E1BB821ADE94/tmp/com.JJbank.pactera-Inbox/%E9%87%91%E8%9E%8D%E6%B8%AF%E8%B7%AF.m4a'
			};
		},
		mounted() {
			// console.log(this.type)
			if (this.type) {
				this.soundList = []
				this.photoList = []
				this.soundRecCaption = ''
			} else {
				console.log(this.record)
				this.soundRecCaption = this.record.soundRecCaption
				this.soundList = this.record.soundList || []
				this.photoList = this.record.photoList || []
				// let arrImg = []
				// this.record.photoList.forEach(item => {
				//   let obj = item
				//   obj.url = `${this.$store.state.baseUrl}${item.fileId}` // 必须有个url组件才能回显
				//   arr.push(obj)
				// })
				// this.photoList = arrImg
			}
		},
		methods: {
			moment,
			/* 选择机构 */
			activeOrg(orgValue) {
				this.orgValue = orgValue
			},
			/* 选择录音 */
			// selectSound(item, index){
			//   this.$refs['PlayAudio'].init()
			//   this.audioItem = item
			//   this.iconSize = index
			//   this.uploadAudio(1)
			// },
			/* 删除录音 */
			// itemDel(v, i){
			//   this.soundList = this.soundList.filter((item , index) => index != i)
			// },
			/* 音频控制 */
			// uploadAudio(type){
			//   let body = {
			//     type: type,
			//     url: this.audioItem.url
			//   }
			//   AlipayJSBridge.call("openRecord", body, (res) => {
			//     switch (body.type) {
			//       case 0 :
			//         if(res.status == '000000'){
			//           let obj = {
			//             url: res.result,
			//             name: decodeURI(res.result.substring(res.result.lastIndexOf("/")+1))
			//           }
			//           this.soundList.push(obj)
			//         }
			//       break;
			//       case 1 :
			//         this.totalDuration = Number(res.result).toFixed(0) || 0
			//       break;
			//       case 2 :
			//         // console.log('播放',res)
			//         if(res.msg == '播放完成'){
			//           this.$refs['PlayAudio'].init()
			//         }
			//       break;
			//       case 3 :
			//         console.log('暂停',res)
			//       break;
			//       case 4 :
			//         // 无法控制前进秒数单位(需改造接口)
			//         console.log('快进',res)
			//       break;
			//       case 5 :
			//         // 无法控制后退秒数单位(需改造接口)
			//         console.log('快退',res)
			//       break;
			//       case 6 :
			//         console.log('停止',res)
			//       break;
			//     }
			//   });
			// },
			/* 播放暂停按钮 */
			// playStop(v){
			//   if(this.soundList.length > 0 && this.audioItem.name){
			//     this.uploadAudio(v)
			//   }
			// },
			/* 保存 */
			saveBtn() {
				if (!this.soundRecCaption) {
					Toast('请输入会议主题')
				} else if (!this.soundList.length) {
					Toast('请上传录音')
				} else if (!this.photoList.length) {
					Toast('请上传照片')
				} else {
					Toast.loading({
						message: "正在保存",
						duration: 0
					});
					// 遍历数组生成一个只有ID的列表
					let getId = (arr) => {
						let newList = []
						if (arr.length > 0) {
							arr.forEach(item => {
								newList.push(item.fileId)
							})
						}
						return newList
					}
					let body = {
						soundRecCaption: this.soundRecCaption,
						soundList: getId(this.soundList),
						photoList: getId(this.photoList)
					}
					if (!this.type) {
						body.id = this.record.id
					}
					saveMemSoundRec(body, res => {
						// console.log(res)
						Toast.clear()
						this.$emit('clearBtn', true)
					})
				}
			},
			/* 取消 */
			clearBtn() {
				this.$emit('clearBtn', true)
			},
			/* 点击上传区域时 */
			// clickUpload(){
			// AlipayJSBridge.call('openPickerV', {openType: "2"}, (res) => {
			// 	if (res.status == "000000") {
			//     // console.log(res)
			// 		Toast.loading({	message: "正在上传", forbidClick: true, duration: 0 });
			// 		memSoundPicUpload({file: res.result},(img)=>{
			// 			Toast.success("上传成功");
			// 			this.photoList.push({
			// 				url: res1.result,
			// 				tableKey: img.data[0].tableKey
			// 			})
			// 		})
			// 	} else if (res.status != "000004") {
			// 		Toast.fail(res.msg)
			// 	}
			// })
			// },
			// 文件流
			// afterReads(file) {
			//   // Toast.loading({message: "正在上传",duration: 0});
			//   // console.log(file);
			//   const formData = new FormData();
			//   formData.append("file", file.file);
			//   formData.append("fileList", file.file);
			//   formData.append("multipartFile", file.file);
			//   memSoundUpload(formData, res => {
			//     console.log(res)
			//   })
			// },
			// async afterReads(file) {
			//   var formdata = new FormData();
			//   formdata.append("file",file.file);
			//   console.log('formdata',formdata)
			//   let upRes = await memSoundUpload(formdata);
			//   if(upRes.code==0){
			//     console.log(upRes)
			//     // Toast.clear();
			//   }else{
			//     // Toast.fail("上传失败："+msg)
			//   }
			// },
			// afterReads(file){
			//   // console.log(file.file)
			//   const serivce = axios.create({withCredentials: true})
			//   let formdata = new FormData();
			//   formdata.append("file", file.file);
			//   formdata.append("data", {})
			//   let config = {
			//     headers: {'Content-Type': 'multipart/form-data'},
			//     method: 'POST'
			//   }
			//   serivce.post(`${this.store.state.baseUrl}/jjbank/api/memsound/memSoundRecUpload`, formdata, config).then(res => {
			//     console.log(res)
			//   }).catch(error => {
			//     console.log(error)
			//   })
			// },
			// bsea64音频文件
			async afterReads(file) {
				Toast.loading({
					message: "正在上传",
					duration: 0
				});
				let body = {
					file: file.content.replace(`${file.content.split(',')[0]},`, '')
				}
				let res = await memSoundUpload(body)
				if (res.code == 0) {
					let obj = {
						// url: `./assets/image/play-mp3.png`,
						url: `${this.$store.state.baseUrl}${res.data[0].fileServerPath}${res.data[0].fileName}`,
						fileId: res.data[0].tableKey,
						// isImage: false
					}
					this.soundList[this.soundList.length - 1] = obj
					// console.log(this.soundList)
					Toast.clear();
				} else {
					Toast.fail("上传失败")
				}
				// memSoundUpload(body, res => {
				//   console.log('上传音频',res)
				//   // Toast.success("上传成功");
				//   // let obj = {
				//   //   // url: `./assets/image/play-mp3.png`,
				//   //   url: `${this.$store.state.baseUrl}${res.data[0].fileServerPath}${res.data[0].fileName}`,
				//   //   tableKey: res.data[0].tableKey,
				//   //   isImage: true
				//   // }
				//   // this.soundList[this.soundList.length - 1] = obj
				// })
			},
			/* 上传图片至服务器 */
			afterRead(img) {
				Toast.loading({
					message: "正在上传",
					forbidClick: true,
					duration: 0
				});
				let body = {
					file: img.content.replace(`${img.content.split(',')[0]},`, '')
				}
				memSoundPicUpload(body, res => {
					// console.log('上传图片',res)
					Toast.success("上传成功");
					let obj = {
						url: `${this.$store.state.baseUrl}${res.data[0].fileServerPath}${res.data[0].fileName}`,
						fileId: res.data[0].tableKey
					}
					this.photoList[this.photoList.length - 1] = obj
					// this.photoList[this.photoList.length - 1].url = `${this.$store.state.baseUrl}${res.data[0].fileServerPath}${res.data[0].fileName}`
					// this.photoList[this.photoList.length - 1].tableKey = res.data[0].tableKey
					// this.photoList.push({
					// 	url: `${this.$store.state.baseUrl}${res.data[0].fileServerPath}${res.data[0].fileName}`,
					// 	tableKey: res.data[0].tableKey
					// })
					// console.log(this.photoList[this.photoList.length - 1].url)
				})
				// this.photoList.push(file)
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
		padding: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;

		.label {
			text-align: left;
			padding: 0.065rem 0;
			font-size: 0.17rem;
			font-weight: 400;
			color: #222222;
		}

		.topTitle {
			display: flex;
			justify-content: space-between;

			.left,
			.right {
				font-size: 0.16rem;
				font-weight: 400;
			}

			.mid {
				font-size: 0.18rem;
				font-weight: 500;
				color: #262626;
			}

			.left {
				color: #8C8C8C;
			}

			.right {
				color: #026DFF;
			}
		}

		// .minutesMeeting {

		// }
		.card {
			background: #fff;
			padding: 0.12rem;
			border-radius: 0.08rem;

			&:deep(.van-cell) {
				padding: 0;
			}
		}

		// .title {
		//   display: flex;
		//   justify-content: space-between;
		//   padding: 0.12rem;
		//   font-size: 0.15rem;
		//   font-family: PingFangSC-Regular, PingFang SC;
		//   font-weight: 400;
		//   .label {
		//     color: #222222;
		//   }
		// }
		// .minutesMeeting {
		//   .minutesList {
		//     // background: pink;
		//     font-size: 0.15rem;
		//     --van-field-label-color: #222222;
		//     & > div {
		//       // display: flex;
		//       // justify-content: space-between;
		//       padding: 0.12rem 0;
		//     }
		//     div:nth-child(2) {
		//       border-top: 0.005rem solid #e5e5e5;
		//       border-bottom: 0.005rem solid #e5e5e5;
		//     }
		//     div:nth-child(3) {
		//       padding-bottom: 0;
		//     }
		//   }
		// }
		.audioManagement {
			.audioList_list {
				width: 100%;
				display: flex;
				justify-content: flex-start;

				&>div {
					display: flex;
					height: 0.735rem;
					margin-right: 0.12rem;

					.list_item {
						font-size: 0.15rem;

						.iconR {
							padding-top: 0.11rem;
							position: relative;

							.iconA {
								position: absolute;
								top: 0;
								right: -0.1rem;
							}
						}

						.audioName {
							max-width: 0.73rem;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}

			// .audio {
			//   background: #fff;
			//   padding: 0.12rem 0.12rem 0 0.12rem;
			//   .audioList {
			//     padding-top: 0.36rem;
			//     font-size: 0.15rem;
			//     color: #131313;
			//     .audioList_title {
			//       text-align: left;
			//     }
			//     .audioList_list {
			//       width: 100%;
			//       overflow: hidden;
			//       &>div {
			//         display: flex;
			//         float: left;
			//         width: 25%;
			//         height: 1.025rem;
			//         .list_item {
			//           font-size: 0.15rem;
			//           margin: auto;
			//           .audioName {
			//             max-width: 0.8rem;
			//             overflow: hidden;
			//             text-overflow: ellipsis;
			//             white-space: nowrap;
			//           }
			//         }
			//       }
			//     }
			//   }
			// }
		}

		.meetingPhotos {
			.imgContent {
				background: #fff;
				border-radius: 0.08rem;
				border: 0.005rem solid #E5E5E5;
				padding: 0.12rem 0 0 0.12rem;
				width: 100%;
				min-height: 0.97rem;
				display: flex;

				&:deep(.van-uploader__preview) {
					margin: 0 0.11rem 0.12rem 0;
				}

				&:deep(.van-uploader__preview-image),
				&:deep(.van-uploader__upload) {
					border-radius: 0.08rem;
				}

				.preview-cover {
					position: absolute;
					bottom: 0;
					box-sizing: border-box;
					width: 100%;
					padding: 0.02rem;
					color: #fff;
					font-size: 0.06rem;
					text-align: center;
					background: rgba(0, 0, 0, 0.3);
				}
			}
		}

		// .addRecord {
		//   position: fixed;
		//   width: 100%;
		//   bottom: 0;
		//   left: 0;
		//   z-index: 99;
		//   background: #fff;
		//   padding: 0.12rem 0.15rem 0.46rem;
		//   .addBtn {
		//     border-radius: 0.08rem;
		//   }
		// }
	}
</style>
