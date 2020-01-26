<template>
	<view :style="customBarStyle">
		<view :class="['header', showBorder ? 'header-border' : '' ]" :style="customBarStyle">
			<view class="row">
				<view class="col-3">
					<view v-if="showIcon" class="header-icon icon-left">
						<block v-if="currentPagesLength>1">
							<view class="back" @click="headerBack" :style="iconPadding">
								<image src="/static/images/header-back.png"></image>
							</view>
							<view class="line" :style="lineMargin"></view>
						</block>
						<view class="home" @click="headerHome" :style="iconPadding">
							<image src="/static/images/header-home.png"></image>
						</view>
					</view>
				</view>
				<view class="col-6">
					<view class="header-title">{{title}}</view>
				</view>
				<view class="col-3">
					<view class="header-icon icon-right">
						<view v-if="showSearch" @click="headerSearch" :style="iconPadding" class="search">
							<image src="/static/images/search-black.png"></image>
						</view>
						<view v-if="showSign" class="sign" :style="iconPadding">
							<image src="/static/images/sign.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../utils/util.js'
	export default {
		data() {
			return {
				currentPagesLength: 0,
				customBarStyle: '',
				iconPadding: 'padding-top:16px;padding-bottom:16px',
				lineMargin: 'margin-top: 16px;',
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
			showBorder: {
				type: Boolean,
				default: false,
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
			let sysInfo = util.getSysInfo()
			let that = this
			let statusBarHeight = sysInfo.statusBarHeight
			let titleBarHeight = sysInfo.titleBarHeight

			that.currentPagesLength = getCurrentPages().length
			that.customBarStyle =
				`height: ${titleBarHeight}px;line-height: ${titleBarHeight}px;padding-top: ${statusBarHeight}px`
			that.titleBarHeight = titleBarHeight
			let top = (titleBarHeight - 16 - 2) / 2
			let bottom = titleBarHeight - 16 - top
			that.iconPadding = `padding-top: ${top}px;padding-bottom: ${bottom}px;`
			that.lineMargin = `margin-top: ${top}px`
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
			},
			headerSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.header {
		top: 0;
		position: fixed;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 9999;
		vertical-align: center;
	}

	.header-border {
		border-bottom: 1upx solid #EFEFEF;
	}

	.header .header-icon {
		display: flex;
	}

	.header .icon-right {
		flex-direction: row-reverse;
		padding-right: 30upx;
	}

	.header .header-icon>view {
		height: 16px;
		padding: 0upx 16upx;
	}

	.header .header-icon .line {
		border: 0;
		width: 1upx;
		background-color: #CCCCCC;
		height: 16px;
		padding: 0;
		margin: 0 5upx 0 0upx;
	}

	.header .back {
		padding-left: 30upx;
	}

	.header image {
		width: 16px;
		height: 16px;
		display: block;
		background: transparent;
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
