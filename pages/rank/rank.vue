<template>
	<view>
		<iheader title="排行榜" :showBorder='true'></iheader>
		<view class="row top base-padding text-center font-lv3">
			<view class="col color-red"><text>总榜</text></view>
			<view class="col"><text>阅读</text></view>
			<view class="col"><text>签到</text></view>
			<view class="col"><text>人气</text></view>
			<view class="col"><text>收藏</text></view>
		</view>
		<view class="row content">
			<view class="col-3 content-left font-lv3 text-center" :style="menuStyle">
				<block v-if="tab == 'all'">
					<view>阅读时长</view>
					<view class="color-red">连续签到</view>
					<view>累计签到</view>
					<view>热门收藏</view>
					<view>人气热读</view>
					<view>热门点评</view>
				</block>
			</view>
			<view class="col-9 content-right pdt-30 base-padding">
				右侧内容
			</view>
		</view>
	</view>
</template>

<script>
	import iheader from '../../components/header.vue'
	import util from '../../utils/util.js'
	export default {
		components: {
			iheader,
		},
		data() {
			return {
				menuStyle: 'top: 85px;',
				tab: 'all', // all、reading、sign、popular、star,
				subTab: '',
			}
		},
		onLoad() {
			let sysInfo = util.getSysInfo()
			let top = 50 + sysInfo.statusBarHeight + sysInfo.titleBarHeight
			console.log('statusBarHeight', sysInfo.statusBarHeight, 'titleBarHeight', sysInfo.titleBarHeight)
			this.menuStyle = `top: ${top}px;`
		},
		methods: {

		}
	}
</script>
<style>
	.top {
		height: 50px;
		line-height: 50px;
		position: fixed;
		left: 0;
		right: 0;
		background-color: #FFFFFF;
	}

	.top .active text {
		border-bottom: 1px solid red;
		line-height: 35px;
		display: inline-block;
	}

	.content-left {
		background-color: #EFEFEF;
		line-height: 360%;
		position: fixed;
		width: 25%;
		top: 94px;
		bottom: 0;
		height: 100%;
	}

	.content-left>view {
		cursor: pointer;
	}

	.content-left .color-red {
		background-color: #FFFFFF;
		border-left: 2px solid red;
	}

	.content-right {
		margin-left: 25%;
		margin-top: 65px;
	}
</style>
