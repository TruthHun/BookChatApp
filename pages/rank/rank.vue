<template>
	<view>
		<iheader title="排行榜" :showBorder='true'></iheader>
		<view class="row top base-padding text-center font-lv3">
			<block v-for="item in tabs" :key='item.tab'>
				<view @click="changeTab" :class="['col', tab == item.tab ? 'color-red': '']" :data-tab="item.tab"><text>{{item.title}}</text></view>
			</block>
		</view>
		<view class="row content">
			<view class="col-3 content-left font-lv3 text-center" :style="menuStyle">
				<block v-for="(item,idx) in tabs" :key='idx'>
					<block v-if="tab == item.tab">
						<view @click="changeSubTab" :class="subTab == subItem.tab ? 'color-red': ''" v-for="subItem in item.subTabs"
						 :data-tab="subItem.tab" :key='subItem.tab'>{{subItem.title}}</view>
					</block>
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
	import config from '../../config.js'
	export default {
		components: {
			iheader,
		},
		data() {
			return {
				menuStyle: 'top: 85px;',
				tab: 'all', // all、reading、sign、popular、star,
				subTab: 'total_reading',
				tabs: [{
					title: '总榜',
					tab: 'all',
					subTabs: [{
							title: '阅读时长',
							tab: 'total_reading',
						},
						{
							title: '连续签到',
							tab: 'continuous_sign',
						},
						{
							title: '累计签到',
							tab: 'total_sign',
						},
						{
							title: '热门收藏',
							tab: 'star_books',
						},
						{
							title: '人气热读',
							tab: 'vcnt_books',
						},
						{
							title: '热门点评',
							tab: 'comment_books',
						}
					]
				}, {
					title: '阅读',
					tab: 'reading',
					subTabs: [{
							title: '阅读总榜',
							tab: 'all',
						}, {
							title: '今日阅读',
							tab: 'today',
						},
						{
							title: '本周阅读',
							tab: 'week',
						},
						{
							title: '上周阅读',
							tab: 'last_week',
						},
						{
							title: '本月阅读',
							tab: 'month',
						},
						{
							title: '上月阅读',
							tab: 'last_month',
						}
					]
				}, {
					title: '签到',
					tab: 'sign',
					subTabs: [{
							title: '连续签到',
							tab: 'continuous_sign'
						},
						{
							title: '最高连签',
							tab: 'history_continuous_sign'
						},
						{
							title: '累计签到',
							tab: 'total_sign'
						},
					]
				}, {
					title: '人气',
					tab: 'popular',
					subTabs: [{
							title: '人气总榜',
							tab: 'all',
						}, {
							title: '今日人气',
							tab: 'today',
						},
						{
							title: '本周人气',
							tab: 'week',
						},
						{
							title: '上周人气',
							tab: 'last_week',
						},
						{
							title: '本月人气',
							tab: 'month',
						},
						{
							title: '上月人气',
							tab: 'last_month',
						}
					]
				}, {
					title: '收藏',
					tab: 'star',
					subTabs: [{
							title: '全网收藏',
							tab: 'all',
						}, {
							title: '今日收藏',
							tab: 'today',
						},
						{
							title: '本周收藏',
							tab: 'week',
						},
						{
							title: '上周收藏',
							tab: 'last_week',
						},
						{
							title: '本月收藏',
							tab: 'month',
						},
						{
							title: '上月收藏',
							tab: 'last_month',
						}
					]
				}]
			}
		},
		onLoad() {
			let sysInfo = util.getSysInfo()
			let top = 50 + sysInfo.statusBarHeight + sysInfo.titleBarHeight
			console.log('statusBarHeight', sysInfo.statusBarHeight, 'titleBarHeight', sysInfo.titleBarHeight)
			this.menuStyle = `top: ${top}px;`
		},
		methods: {
			changeTab: function(e) {
				if (config.debug) console.log('changeTab', e)
				let tab = e.currentTarget.dataset.tab
				for (let item of this.tabs) { // set subTab's default value
					if (item.tab == tab && item.subTabs && item.subTabs.length > 0) {
						console.log(item.subTabs[0].tab)
						this.subTab = item.subTabs[0].tab
					}
					console.log(item)
				}
				this.tab = tab
				this.loadData()
			},
			changeSubTab: function(e) {
				if (config.debug) console.log('changeSubTab', e)
				this.subTab = e.currentTarget.dataset.tab
			},
			loadData: function() {
				if (config.debug) console.log('loadData with tab', this.tab)
			}
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
		width: 20%;
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
		text-indent: -2px;
	}

	.content-right {
		margin-left: 20%;
		margin-top: 65px;
	}
</style>
