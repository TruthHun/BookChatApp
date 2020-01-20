<template>
	<view :style="'height:' + titleBarHeight + 'px;padding-top:' + statusBarHeight + 'px'">
		<view class="header" :style="'height:' + titleBarHeight + 'px;padding-top:' + statusBarHeight + 'px'">
			<view class="row">
				<view class="col-3">
					<view v-if="showIcon" class="title-bar">
						<block v-if="currentPagesLength>1">
							<view class="back" @click="headerBack">
								<image src="/static/images/header-back.png"></image>
							</view>
							<view class="line"></view>
						</block>
						<view class="home" @click="headerHome">
							<image src="/static/images/header-home.png"></image>
						</view>
					</view>
				</view>
				<view class="col-6">
					<view class="header-title">{{title}}</view>
				</view>
				<view class="col-3">
					<view class="search">
						<image src="/static/images/search.png"></image>
					</view>
					<view class="sign">
						<image src="/static/images/sign.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
				currentPagesLength: 0,
			};
		},
		props: {
			title: {
				type: String,
				default: 'BookChat'
			},
			showIcon: {
				type: Boolean,
				default: true,
			}
		},
		created() {
			let that = this
			let app = getApp()

			that.currentPagesLength = getCurrentPages().length

			if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
				that.statusBarHeight = app.globalData.statusBarHeight
				that.titleBarHeight = app.globalData.titleBarHeight
			} else {
				let that = this
				uni.getSystemInfo({
					success: function(res) {
						if (!app.globalData) {
							app.globalData = {}
						}
						if (res.model.indexOf('iPhone') !== -1) {
							app.globalData.titleBarHeight = 44
						} else {
							app.globalData.titleBarHeight = 48
						}
						app.globalData.statusBarHeight = res.statusBarHeight
						that.statusBarHeight = app.globalData.statusBarHeight
						that.titleBarHeight = app.globalData.titleBarHeight
					},
					failure() {
						that.statusBarHeight = 0
						that.titleBarHeight = 0
					}
				})
			}
		},
		methods: {
			headerBack() {
				uni.navigateBack({
					delta: 1,
					fail(e) {
						wx.switchTab({
							url: '/pages/index/index'
						})
					}
				})
			},
			headerHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
	.header {
		top: 0;
		position: fixed;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 9999;
	}

	.header .line {
		border: 0;
		width: 1px;
		background-color: #EEEEEE;
		height: 16px;
	}

	.header .back,
	.header .home {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header .title-bar {
		height: 30px;
		border: 1upx solid #EEEEEE;
		border-radius: 16px;
		margin-left: 30upx;
	}
	.header image {
		width: 16px;
		height: 16px;
		background: transparent;
		vertical-align: top;
		margin: 0 12px;
	}

	.header .header-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 16px;
		color: #000000;
		text-align: center;
	}
</style>
