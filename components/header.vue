<template>
	<view :style="customBarStyle">
		<view class="header" :style="customBarStyle">
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
					<!-- <view class="search">
						<image src="/static/images/search.png"></image>
					</view>
					<view class="sign">
						<image src="/static/images/sign.png"></image>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentPagesLength: 0,
				customBarStyle: '',
				isMP: false,
				titleBarHeight: 44,
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
			},
			showSearch: {
				type: Boolean,
				default: false,
			},
			showSign: {
				type: Boolean,
				default: false,
			},
			showRank: {
				type: Boolean,
				default: false,
			},
			showScan: {
				type: Boolean,
				default: false,
			}
		},
		created() {
			let app = getApp()
			let that = this
			let statusBarHeight = 0
			let titleBarHeight = that.titleBarHeight

			// #ifdef MP
			that.isMP = true
			// #endif

			that.currentPagesLength = getCurrentPages().length

			if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
				statusBarHeight = app.globalData.statusBarHeight
				titleBarHeight = app.globalData.titleBarHeight
			} else {
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
						statusBarHeight = app.globalData.statusBarHeight
						titleBarHeight = app.globalData.titleBarHeight
					}
				})
			}
			that.customBarStyle =
				`height: ${titleBarHeight}px;line-height: ${titleBarHeight}px;padding-top: ${statusBarHeight}px`
			that.titleBarHeight = titleBarHeight
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

	.header .title-bar {
		height: 100%;
	}

	.header .title-bar view {
		display: inline-block;
	}

	.header .line {
		border: 0;
		width: 1upx;
		background-color: #999999;
		height: 16px;
		margin: 0 5upx 0 0upx;
	}

	.header .back,
	.header .home {
		height: 100%;
		padding: 0 16upx;
	}
	.header .back{
		padding-left: 24upx;
	}

	.header .border {
		border: 1upx solid #e5e5e5;
		border-radius: 16px;
		text-align: center;
	}

	.header image {
		width: 16px;
		height: 16px;
		background: transparent;
		vertical-align: center;
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
