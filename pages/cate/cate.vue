<template>
	<view>
		<iheader title="分类" :showIcon="false" :showBorder="true" :showSearch="true"></iheader>
		<view class='base-padding layout-grid' v-if="grid">
			<block v-for="category in categories" :key='category.id'>
				<view class='panel' v-if="category.cnt >0 && category.status">
					<view class='panel-heading'>
						<view class='font-lv1 strong'>{{category.title}}</view>
					</view>
					<view class='row'>
						<block v-for="child in category.children" :key='child.id'>
							<navigator :url="'/pages/list/list?cid='+child.id" class='col-6 item' v-if="child.cnt>0 && child.pid==category.id && child.status">
								<view class='row'>
									<view class='col-4'>
										<image :lazy-load='true' v-if="child.icon" class='img-responsive' :src='child.icon'></image>
										<image v-else class='img-responsive' src='/static/images/cate-default.png'></image>
									</view>
									<view class='col-8'>
										<view class='ellipsis-1row font-lv2'>{{child.title}}</view>
										<view class='text-muted font-lv3'>{{child.cnt}} 本</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
				</view>
			</block>
		</view>
		<view class='layout-list' v-else>
			<block v-for="(category, idx) in categories" :key='category.id'>
				<view class='panel' v-if="category.cnt >0 && category.status">
					<view class='panel-heading' :id="'index'+idx">
						<view class='font-lv2 strong'>{{category.title}}</view>
					</view>
					<view class='row'>
						<block v-for="child in category.children" :key='child.id'>
							<navigator :url="'/pages/list/list?cid='+child.id" class='col-12 item' v-if="child.cnt>0 && child.pid==category.id && child.status">
								<view class='row'>
									<view class='col-4'>
										<image :lazy-load='true' v-if="child.icon" class='img-responsive' :src='child.icon'></image>
										<image v-else class='img-responsive' src='/static/images/cate-default.png'></image>
									</view>
									<view class='col-8'>
										<view class='ellipsis-1row font-lv3'>{{child.title}}</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
				</view>
			</block>
			<view class="fix-right" :style="'top:'+fixTop">
				<block v-for="(category, idx) in categories" :key='category.id'>
					<view v-if="category.cnt >0 && category.status && category.pid == 0" @touchend="scrollCate" :data-index="idx"
					 :data-title="category.firstWord">{{category.firstWord}}</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'
	import config from '../../config.js'

	import iheader from '../../components/header.vue'

	export default {
		components: {
			iheader
		},
		data() {
			return {
				// 是否是格子布局。true表示分类使用格子布局，false则表示使用类似通讯录的页面布局
				grid: false,
				categories: [],
				fixTop: '0px',
				currentScrollTop: 0,
			}
		},
		onLoad() {
			util.loading()
			let sysInfo = util.getSysInfo()
			this.fixTop = (sysInfo.statusBarHeight + sysInfo.titleBarHeight) + "px"
			api.getCategories().then((categories) => {
				if (config.debug) console.log('api.getCategories: ', categories);
				categories.map(item => {
					item.firstWord = String(item.title).substr(0, 1)
					return item
				})
				console.log(categories)
				this.categories = categories
			}).catch((e) => {
				console.log(e)
			}).finally(function() {
				uni.hideLoading()
			})
		},
		onPageScroll(e) {
			this.currentScrollTop = e.scrollTop
		},
		methods: {
			scrollCate(e) {
				let that = this
				let sysInfo = util.getSysInfo()
				if (config.debug) console.log('scrollCate', e)
				const query = uni.createSelectorQuery().in(this);
				let to = '';
				query.select('#index' + e.currentTarget.dataset.index).boundingClientRect(info => {
					if (config.debug) console.log("位置信息", that.currentScrollTop, info)
					clearTimeout(to)
					to = setTimeout(function() {
						uni.hideLoading()
					}, 500)
					uni.showLoading({
						title: '  ' + e.currentTarget.dataset.title + '  ',
						icon: 'none',
					})
					uni.pageScrollTo({
						scrollTop: this.currentScrollTop + info.top - (sysInfo.statusBarHeight + sysInfo.titleBarHeight) - 14
					})
				}).exec();
			}
		}
	}
</script>

<style>
	.layout-grid {
		background-color: #FFFFFF;
		padding-top: 30upx;
	}

	.item {
		margin-bottom: 30upx;
	}

	.item>.row {
		border: 1px solid #efefef;
		border-radius: 6upx;
		box-sizing: border-box;
		padding: 15upx;
		padding-bottom: 6upx;
	}

	.item:nth-of-type(2n)>.row {
		margin-left: 15upx;
	}


	.img-responsive {
		border-radius: 6upx;
		border: 1px solid #efefef;
		max-width: 100upx;
		height: 100upx;
	}

	.img-responsive image {
		width: 100upx;
		height: 100upx;
	}

	.item>.row .col-8 {
		padding-left: 15upx;
		box-sizing: border-box;
	}

	.text-muted {
		margin-top: 10upx;
	}

	@media (min-width: 768px) {
		.img-responsive {
			border-radius: 5px;
			max-width: 80px;
			max-height: 80px;
		}

		.img-responsive image {
			max-width: 80px;
			max-height: 80px;
		}
	}

	/* =================== */
	page {
		background-color: #F1F1F1;
	}

	.layout-list .img-responsive {
		border-radius: 50%;
		border: 0;
		max-width: 75upx;
		height: 75upx;
	}

	.layout-list .img-responsive image {
		width: 75upx;
		height: 75upx;
	}

	.layout-list .panel-heading {
		margin: 20upx 0;
		box-sizing: border-box;
		padding-left: 30upx;
	}

	.layout-list .item {
		background-color: #FFFFFF;
		margin: 0;
		box-sizing: border-box;
	}

	.layout-list .item .row {
		border: 0;
		border-bottom: 1upx solid #F1F1F1;
		padding: 20upx 30upx;
	}

	.layout-list .item:nth-of-type(2n)>.row {
		margin-left: 0;
	}

	.layout-list .item .row .col-4 {
		width: 105upx;
		max-width: 105upx;
	}

	.layout-list .item .row .col-8 {
		line-height: 75upx;
	}

	.layout-list .item:nth-of-type(2n+1)>.row {
		margin-right: 0;
	}

	.fix-right {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 50upx;
		background-color: #FFFFFF;
		text-align: center;
		font-size: 12px;
	}

	.fix-right {
		padding-top: 4px;
	}

	.fix-right>view {
		padding: 4px 0;
		color: #4c9af6;
		white-space: nowrap;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.layout-list .img-responsive {
			border-radius: 0;
			border: 0;
			max-width: 65upx;
			height: 65upx;
		}

		.layout-list .img-responsive image {
			width: 65upx;
			height: 65upx;
		}
	}
</style>
