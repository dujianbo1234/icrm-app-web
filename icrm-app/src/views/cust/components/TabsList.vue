<template>
	<!-- 客户视图-产品信息列表 -->
	<div class="tabsLists">
		<div class="noData" v-if="listData.filter(item => item.disabled == false).length == 0">
			no Data
		</div>
		<van-tabs class="tabss" v-model:active="active" v-else>
			<van-tab :title="item.name" :disabled="item.disabled" v-for="(item, index) in listData" :key="index"
				style="width:100%">
				<el-table size="small" :data="showAll?item.list:item.list?item.list.slice(0,5):item.list" fit :header-row-style="headerStyle">
					<el-table-column :prop="i.key" :label="i.label" :fixed="i.fixed" :show-overflow-tooltip="i.tooltip"
						:align="i.align || 'center'" :width="i.width" v-for="(i, iIindex) in item.label" :key="iIindex">
						<template #default="scope" v-if="i.num">{{scope.row[i.key] || 0}}</template>
						<template #default="scope" v-else>{{scope.row[i.key] || '-'}}</template>
					</el-table-column>
				</el-table>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	export default {
		props: {
			setList: {
				type: Array,
				default: [],
			},
			showAll: {
				type: Boolean,
				default: true,
			},
		},
		computed: {
			listData() {
				return this.setList
			}
		},
		data() {
			return {
				headerStyle: {
					'font-size': '0.12rem',
					'font-family': 'PingFangSC-Medium, PingFang SC',
					'color': '#595959'
				},
				active: ""
			};
		},
		methods: {}
	};
</script>

<style lang="less" scoped>
	.tabsLists {
		width: 100%;

		.noData {
			padding: 0.12rem;
			border-top: 0.005rem solid #8C8C8C;
			border-bottom: 0.005rem solid #8C8C8C;
			color: #8C8C8C;
			opacity: 0.4;
			font-size: 0.12rem;
		}

		.tabss {
			--van-tab-text-color: #8C8C8C;
			--van-tab-active-text-color: #026DFF;
			--van-tabs-bottom-bar-color: #026DFF;

			&:deep(.van-tabs__content) {
				margin-top: 0.12rem;
			}

			&:deep(.van-tabs__line) {
				width: 0.6rem;
			}

			&:deep(.van-tabs__nav) {
				border-radius: 0 !important;
			}
		}
	}
</style>
