<template>
	<view class="page">
		<iheader title="我的" :showIcon="false"></iheader>
		<view class='base-padding row' @click='userLoginEvent'>
			<view class='user'>
				<image :src='user.avatar'></image>
				<view class='username font-lv2'>{{user.nickname}}</view>
			</view>
			<view v-if="user.intro" class='color-grey font-lv3 user-intro'>{{user.intro}}</view>
		</view>
		<view v-if="moreInfo.uid>0" class="row col-title font-lv2">
			<view class="col font-lv2">
				<image class="me-icon" src="/static/images/report.png"></image>
				<text>我的成就</text>
			</view>
			<view class="col text-right">
				<view v-if="isSignedToday" class="text-muted font-lv4 signed">
					<image class="me-icon" src="/static/images/signed.png">已签到</image>
				</view>
				<view v-else class="color-link" @click="sign">
					<image class="me-icon" src="/static/images/sign.png"></image>
					<text>签到</text>
				</view>
				<text class="line">|</text>
				<navigator class="color-link" url="/pages/rank/rank">
					<image class="me-icon" src="/static/images/rank.png"></image>
					<text>榜单</text>
				</navigator>
			</view>
		</view>
		<view v-if="moreInfo.uid>0" class="row text-center font-lv4 text-muted reading-time">
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.today_reading_hour}}</text> 时 <text class="font-lv3">{{moreInfo.today_reading_min}}</text>
					分</view>
				<view class="font-lv5">今日阅读</view>
			</view>
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.month_reading_hour}}</text> 时 <text class="font-lv3">{{moreInfo.month_reading_min}}</text>
					分</view>
				<view class="font-lv5">本月阅读</view>
			</view>
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.total_reading_hour}}</text> 时 <text class="font-lv3">{{moreInfo.total_reading_min}}</text>
					分</view>
				<view class="font-lv5">累计阅读</view>
			</view>
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.join_day}}</text> 天</view>
				<view class="font-lv5">加入组织</view>
			</view>
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.total_sign}}</text> 天</view>
				<view class="font-lv5">累计签到</view>
			</view>
			<view class="col-4">
				<view><text class="font-lv3">{{moreInfo.total_continuous_sign}}</text> 天</view>
				<view class="font-lv5">连续签到</view>
			</view>

		</view>
		<view class='base-padding row base-info font-lv2'>
			<navigator url='/pages/search/search' class='col-12'>
				<image class="me-icon" src='../../static/images/search.png'></image>
				<text>书籍搜索</text>
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
			<navigator v-if="user.uid == 0" url='/pages/rank/rank' class='col-12'>
				<image class="me-icon" src='../../static/images/rank.png'></image>
				<text>热门榜单</text>
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
		</view>
		<view class='base-padding row base-info font-lv2'>
			<navigator :url="user.uid>0 ? '/pages/ucenter/ucenter?tab=release':'/pages/login/login'" class='col-12'>
				<image class="me-icon" src='../../static/images/book.png'></image>
				我的发布
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
			<navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=star":"/pages/login/login"' class='col-12'>
				<image class="me-icon" src='../../static/images/star.png'></image>
				我的收藏
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
			<navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=follow":"/pages/login/login"' class='col-12'>
				<image class="me-icon" src='../../static/images/follow.png'></image>
				我的关注
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
			<navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=fans":"/pages/login/login"' class='col-12'>
				<image class="me-icon" src='../../static/images/fans.png'></image>
				我的粉丝
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
		</view>

		<view class='base-padding row base-info font-lv2'>
			<navigator :url='"/pages/read/read?identify="+info.about' class='col-12'>
				<image class="me-icon" src='../../static/images/about-us.png'></image>
				关于我们
				<image class='pull-right me-icon' src='../../static/images/right-angle.png'></image>
			</navigator>
		</view>

		<view v-if="user.uid>0" class='base-padding row base-info font-lv2'>
			<view @click='logout' class='col-12'>
				<image class="me-icon" src='../../static/images/login.png'></image>
				退出登录
				<image class='pull-right me-icon' src='/static/images/right-angle.png'></image>
			</view>
		</view>

		<view class='base-padding row base-info footer'>
			<view class='col-12 text-center'>
				<view v-if="info.copyright">
					<text class='font-lv4 color-grey'>Copyright © 2018-{{now}} {{info.copyright}}</text>
				</view>
				<view v-if="info.license">
					<text class='font-lv4 color-grey'>License：{{info.license}}</text>
				</view>
				<view v-if="info.author">
					<text class='font-lv4 color-grey'>Author：{{info.author}}</text>
				</view>
				<view v-if="info.version">
					<text class='font-lv4 color-grey'>Version：{{info.version}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	import util from '../../utils/util.js'

	import iheader from '../../components/header.vue'

	export default {
		components: {
			iheader
		},
		data() {
			return {
				isSignedToday: false,
				info: {},
				user: {},
				moreInfo: {},
				moreInfoCacheTime: 0,
				now: new Date().getFullYear(),
				redirect: encodeURIComponent('/pages/me/me')
			}
		},
		onLoad(op) {
			if (config.debug) console.log("onLoad", op)
			if (op.redirect) this.redirect = op.redirect
			this.info = config.info
		},
		onShow() {
			this.initUser()
			this.getUserMoreInfo()
		},
		methods: {
			initUser: function() {
				let that = this
				let user = util.getUser()
				if (config.debug) console.log("user", user)
				if (user == undefined || user.token == undefined || user.uid <= 0) {
					user = {
						'uid': 0,
						'nickname': '游客，请戳我登录',
						'avatar': '../../static/images/logo.png',
						'intro': '分享知识，共享智慧；知识，因分享，传承久远'
					}
					that.moreInfo = {
						uid: 0,
						signed_at: 0,
						created_at: 0,
						total_sign: 0,
						total_continuous_sign: 0,
						history_continuous_sign: 0,
						today_reading: 0,
						month_reading: 0,
						total_reading: 0,
						today_reading_hour: 0,
						today_reading_min: 0,
						month_reading_hour: 0,
						month_reading_min: 0,
						total_reading_hour: 0,
						total_reading_min: 0,
						join_day: 0
					}
				}
				that.user = user
			},
			logout: function(e) {
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '您确定要退出登录吗？',
					success(res) {
						if (res.confirm) {
							util.request(config.api.logout) // 只需调用，不需要处理返回结果
							util.clearUser()
							util.toastSuccess('退出成功')
							that.initUser()
							util.setSignedAt(0)
							let sysInfo = util.getSysInfo()
							sysInfo.bookshelfChanged = true
							util.setSysInfo(sysInfo)
						}
					}
				})
			},
			userLoginEvent: function(e) {
				if (config.debug) console.log("userLoginEvent", e)
				if (this.user.uid == 0) {
					uni.navigateTo({
						url: '/pages/login/login?redirect=' + this.redirect
					})
				}
			},
			sign: function(){
				let that = this
				util.request(config.api.userSign, {}, 'POST').then(function(res){
					util.setSignedAt(res.data.signed_at)
					uni.showToast({
						title: res.data.message,
						duration: 5000,
						icon: 'none',
					})
					that.isSignedToday = util.isSignedToday()
				}).catch(function(e){
					console.log(e)
					util.toastError(e.message || e.errMsg)
				})
			},
			getUserMoreInfo: function() {
				let that = this
				if (that.user.uid == 0) return
				let now = util.now()
				// 缓存 10 秒
				if (config.debug) console.log('now', now, 'moreInfoCacheTime', that.moreInfoCacheTime)
				if (now - that.moreInfoCacheTime <= 10) return

				util.request(config.api.userMoreInfo, {
					'uid': that.user.uid
				}).then(function(res) {
					if (config.debug) console.log(config.api.userMoreInfo, res)
					let moreInfo = res.data.info
					let todayReading = util.formatReading(moreInfo.today_reading)
					moreInfo.today_reading_hour = todayReading.hour
					moreInfo.today_reading_min = todayReading.min
					let monthReading = util.formatReading(moreInfo.month_reading)
					moreInfo.month_reading_hour = monthReading.hour
					moreInfo.month_reading_min = monthReading.min
					let totalReading = util.formatReading(moreInfo.total_reading)
					moreInfo.total_reading_hour = totalReading.hour
					moreInfo.total_reading_min = totalReading.min
					moreInfo.join_day = parseInt((now - moreInfo.created_at) / (24 * 3600)) + 1
					util.setSignedAt(moreInfo.signed_at)
					that.moreInfo = moreInfo
				}).catch(function(e) {
					console.log(e)
				}).finally(function() {
					that.moreInfoCacheTime = util.now()
					that.isSignedToday = util.isSignedToday()
				})
			}
		}
	}
</script>

<style scoped>
	page,
	.page {
		background-color: #f6f6f6;
	}

	.row {
		background-color: #fff;
		margin-bottom: 10upx;
		padding: 30upx;
	}

	.row:last-of-type {
		margin-bottom: 0upx;
	}

	.user {
		text-align: center;
		display: block;
		width: 100%;
	}

	.month-reading {
		border-left: 1px solid #f1f1f1;
		border-right: 1px solid #f1f1f1;
	}

	.user .text-muted {
		text-align: center;
	}

	.col-title {
		margin-bottom: 1px;
		color: #666;
	}

	.col-title navigator {
		display: inline-block;
	}

	.username {
		margin: 15upx auto;
	}

	.user image {
		width: 180upx;
		height: 180upx;
		border-radius: 90upx;
		border: 1px solid #ddd;
		margin: 0 auto;
		display: block;
	}

	.base-info image {
		margin-right: 30upx !important;
	}

	.base-info image.pull-right {
		margin-right: 0 !important;
		top: 0;
	}

	.base-info {
		padding-top: 0upx;
		padding-bottom: 0upx;
	}

	.base-info .col-12 {
		border-bottom: 1px solid #f6f6f6;
		padding-bottom: 30upx;
		padding-top: 30upx;
		color: #666;
	}

	.base-info .col-12:last-of-type {
		margin-bottom: 0;
		border-bottom: 0;
	}

	.user-intro {
		width: 100%;
		text-align: center;
	}

	.user-func {
		line-height: 40upx;
		border: 1px solid #000000;
	}

	.user-func .func-item {
		line-height: 300%;
		border-bottom: 1upx dashed #f1f1f1;
		padding: 0;
		margin: 0;
	}

	.user-func .color-red {
		margin-right: 8upx;
	}

	.reading-time text {
		margin: auto 8upx;
		color: red;
	}

	.reading-time .col-4 {
		box-sizing: border-box;
	}

	.reading-time .col-4:nth-child(1),
	.reading-time .col-4:nth-child(2),
	.reading-time .col-4:nth-child(3) {
		border-bottom: 1px solid #f6f6f6;
		padding-bottom: 16upx;
	}

	.reading-time .col-4:nth-child(4),
	.reading-time .col-4:nth-child(5),
	.reading-time .col-4:nth-child(6) {
		padding-top: 16upx;
	}

	.reading-time .col-4:nth-child(2),
	.reading-time .col-4:nth-child(5) {
		border-left: 1px solid #f6f6f6;
		border-right: 1px solid #f6f6f6;
	}

	image.me-icon {
		width: 40upx;
		height: 40upx;
		vertical-align: middle;
		margin-right: 6upx;
		position: relative;
		top: -4upx;
	}

	.signed image {
		width: 25upx;
		height: 25upx;
	}

	.signed.text-muted {
		color: #CCCCCC;
	}

	.col-title .text-right .line {
		color: #EFEFEF;
		margin: 0 10px;
	}

	.col-title .text-right>view {
		display: inline-block;
	}

	@media (min-width: 768px) {

		.base-info image,
		image.me-icon {
			max-width: 20px;
			max-height: 20px;
			top: -2upx;
		}

		.base-info .col-12 {
			padding-top: 25px;
			padding-bottom: 25px;
		}
	}
</style>
