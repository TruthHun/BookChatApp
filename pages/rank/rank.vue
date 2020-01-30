<template>
	<view>
		<iheader title="排行榜" :showBorder='true'></iheader>
		<view class="row top base-padding text-center font-lv3 color-semi">
			<block v-for="item in tabs" :key='item.tab'>
				<view @click="changeTab" :class="['col', tab == item.tab ? 'color-red': '']" :data-tab="item.tab"><text>{{item.title}}</text></view>
			</block>
		</view>
		<view class="row content">
			<view class="col-3 content-left font-lv3 text-center color-semi" :style="menuStyle">
				<block v-for="(item,idx) in tabs" :key='idx'>
					<block v-if="tab == item.tab">
						<view @click="changeSubTab" :class="subTab == subItem.tab ? 'color-red': ''" v-for="subItem in item.subTabs"
						 :data-tab="subItem.tab" :key='subItem.tab'>{{subItem.title}}</view>
					</block>
				</block>
			</view>
			<view class="col-9 content-right base-padding font-lv3">
				<view v-if="loading" class="row loading">
					<view class="col-12">
						<image src="/static/images/loading.png"></image>
					</view>
				</view>
				<view v-else v-for="(list,index) in lists" :key="index" class="row">
					<view :class="['col-2', 'rank-number', 'rank-no'+(index+1)]"><text>{{index + 1}}</text></view>
					<view class="col-7 rank-main">
						<navigator v-if="list.uid" :url="'/pages/ucenter/ucenter?uid='+list.uid">{{list.nickname}}</navigator>
						<navigator v-else :url="'/pages/intro/intro?id='+list.book_id">{{list.book_name}}</navigator>
					</view>
					<view class="col-3 text-right text-muted font-lv4"><text>{{list.info}}</text></view>
				</view>
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
				data: {},
				lists: [],
				loading: true,
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
					title: '时长',
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
			if (config.debug) console.log('statusBarHeight', sysInfo.statusBarHeight, 'titleBarHeight', sysInfo.titleBarHeight)
			this.menuStyle = `top: ${top}px;`
			this.loadData()
		},
		methods: {
			changeTab: function(e) {
				if (config.debug) console.log('changeTab', e)
				let tab = e.currentTarget.dataset.tab
				for (let item of this.tabs) { // set subTab's default value
					if (item.tab == tab && item.subTabs && item.subTabs.length > 0) {
						if (config.debug) console.log(item.subTabs[0].tab)
						this.subTab = item.subTabs[0].tab
					}
					if (config.debug) console.log(item)
				}
				this.tab = tab
				this.loadData()
			},
			changeSubTab: function(e) {
				if (config.debug) console.log('changeSubTab', e)
				if (e.currentTarget.dataset.tab == this.subTab) return
				this.subTab = e.currentTarget.dataset.tab
				this.loadData()
			},
			loadData: function() {
				if (config.debug) console.log('loadData with tab', this.tab)

				let that = this
				if (that.data[that.tab]) {
					that._showData()
					return
				}

				util.request(config.api.rank, {
					tab: that.tab,
					limit: 100,
				}).then(function(res) {
					if (config.debug) console.log(config.api.rank, res)
					let data = that.data
					data[that.tab] = res.data
					that.data = data
					that._showData()
				}).catch((e) => {
					console.log(e)
				})
			},
			_showData() {
				let that = this
				let lists = that.data[that.tab][that.subTab]
				lists.map(item => {
					if (item.member_id) {
						item.uid = item.member_id
					}
					switch (that.tab) {
						case 'all':
							if (that.subTab == 'total_reading') {
								let r = util.formatReading(item.total_reading_time)
								if (r.min < 10) r.min = '0' + r.min
								item.info = `${r.hour} 时 ${r.min} 分`
							} else if (that.subTab == 'continuous_sign') {
								item.info = item.total_continuous_sign + ' 天'
							} else if (that.subTab == 'total_sign') {
								item.info = item.total_sign + ' 天'
							} else if (that.subTab == 'comment_books') {
								item.info = item.CntComment || item.cnt_comment
							} else if (that.subTab == 'star_books') {
								item.info = item.star
							} else if (that.subTab == 'vcnt_books') {
								item.info = item.vcnt
							}
							break;
						case 'reading':
							let r = util.formatReading(item.sum_time)
							if (r.min < 10) r.min = '0' + r.min
							item.info = `${r.hour} 时 ${r.min} 分`
							break;
						case 'sign':
							if (that.subTab == 'continuous_sign') {
								item.info = item.total_continuous_sign + ' 天'
							} else if (that.subTab == 'history_continuous_sign') {
								item.info = item.history_total_continuous_sign + ' 天'
							} else {
								item.info = item.total_sign + ' 天'
							}
							break;
						case 'star':
						case 'popular':
							item.info = item.cnt
							break;
					}
				})
				that.loading = false
				that.lists = lists
				uni.pageScrollTo({
					duration: 100,
					scrollTop: 0
				})
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
		border-bottom: 1px solid #F1F1F1;
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
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.content-left .color-red {
		background-color: #FFFFFF;
		border-left: 2px solid red;
		text-indent: -2px;
	}

	.content-right {
		margin-left: 20%;
		margin-top: 55px;
		padding-right: 0 !important;
	}

	.content-right .row {
		line-height: 30px;
		padding: 20upx 0;
		border-bottom: 1px dashed #F1F1F1;
	}

	.rank-number text {
		display: block;
		height: 30px;
		width: 30px;
		background-color: #EFEFEF;
		text-align: center;
		font-size: 0.9em;
	}

	.rank-no1 text {
		background-color: #bf2c24;
		color: #FFFFFF;
	}

	.rank-no2 text {
		background-color: #e67225;
		color: #FFFFFF;
	}

	.rank-no3 text {
		background-color: #e6bf25;
		color: #FFFFFF;
	}

	.rank-main navigator {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.loading {
		border-bottom: 0 !important;
	}

	.loading image {
		width: 32px;
		height: 32px;
		margin: 30px auto;
		display: block;
	}
</style>
