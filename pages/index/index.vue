<template>
	<view class="root">
		<iheader :showIcon="false" :showSearch="showHeaderSearch"></iheader>
		<view v-if="showSearch" class="base-padding mgb-30">
			<search target="/pages/search/search" />
		</view>

		<view v-if="banners.length>0" class="base-padding base-margin-bottom">
			<swiper :style="'height:'+bannerHeight" :autoplay="autoplay" :indicator-dots="indicatorDots" :interval="interval"
			 :duration="duration">
				<swiper-item v-for="banner in banners" :key="banner.id" class="radius-basic">
					<image @click="bannerClick" :data-url="banner.link" :src="banner.image" :style="'height:'+bannerHeight+';width:'+bannerWidth"></image>
				</swiper-item>
			</swiper>
		</view>

		<!--  推荐  -->
		<view v-if="recommendBooks.length>0" class='panel base-padding recommend base-margin-bottom'>
			<view class='panel-heading'>
				<view class='panel-title font-lv1 strong'>
					<text>最新推荐</text>
					<navigator class="history-link color-grey" url="/pages/history/history">最近阅读</navigator>
				</view>
			</view>
			<view class='panel-body'>
				<scroll-book :books="recommendBooks" :width="bannerWidth"></scroll-book>
			</view>
		</view>

		<!--  各种分类的书籍的展示  -->
		<block v-for="category in categoryBooks" :key="category.id">
			<view v-if="category.books" class='panel base-padding base-margin-bottom'>
				<view class='panel-heading'>
					<view class='panel-title font-lv1 strong'>{{category.title}}
						<navigator :url="'/pages/list/list?tab=new&cid='+category.id" class='pull-right color-link font-lv3'>更多</navigator>
					</view>
				</view>
				<view class='panel-body'>
					<list-book :books="category.books" />
				</view>
			</view>
		</block>
		<view v-if="platform == 'ios'" class="ios-platform">.</view>
	</view>
</template>

<script>
	import scrollBook from '../../components/scrollBook.vue'
	import search from '../../components/search.vue'
	import listBook from '../../components/listBook.vue'
	import iheader from '../../components/header.vue'

	import api from '../../utils/api.js'
	import util from '../../utils/util.js'
	import config from '../../config.js'

	export default {
		components: {
			scrollBook,
			search,
			listBook,
			iheader,
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				bannerWidth: '100%',
				bannerHeight: 'auto',
				showSearch: false, // 内容完全加载完成之后再显示搜索框
				showHeaderSearch: false,
				banners: [],
				categoryBooks: [],
				recommendBooks: [],
				times: 100, // 当iOS未允许访问网络的时候，每3秒请求一次数据
				platform: '',
				cacheKey: 'cache-index',
			}
		},
		onLoad() {
			this.loadCache()
			this.loadData()
		},
		onShow() {
			if (this.categoryBooks.length == 0) {
				this.loadData()
			}
		},
		onPageScroll(options) {
			if (config.debug) console.log("onPageScroll", options)
			if (options.scrollTop > 110) {
				if (this.showHeaderSearch == false) this.showHeaderSearch = true
			} else {
				if (this.showHeaderSearch == true) this.showHeaderSearch = false
			}
		},
		methods: {
			loadCache(){
				let that = this
				let data = uni.getStorageSync(that.cacheKey)
				if (data){
					let obj = JSON.parse(data)
					console.log('loadCache', obj)
					that.banners = obj.banners
					that.categories = obj.categories
					that.showSearch = true
					that.recommendBooks = obj.recommendBooks
				}
			},
			loadData() {
				// #ifdef MP
				util.loading('玩命加载中...')
				// #endif

				let that = this
				let cids = []
				let categories = []
				let bookLists = []
				api.getCategories().then(function(res) {
					if (res.length > 0) {
						categories = res.filter(function(category) {
							let b = category.pid == 0 && category.cnt > 0
							if (b) cids.push(category.id)
							return b
						})
					}
					if (config.debug) console.log(res, categories, cids)
				}).catch(function(e) {
					console.log("api.getCategories()", e)
				}).finally(function() {
					let banners = []
					let recommendBooks = []
					Promise.all([util.request(config.api.banners), util.request(config.api.bookLists, {
						page: 1,
						size: 12,
						sort: 'latest-recommend'
					}), util.request(config.api.bookListsByCids, {
						page: 1,
						size: 5,
						sort: 'new',
						cids: cids.join(',')
					})]).then(function([resBanners, resRecommendBooks, resBookLists]) {
						if (config.debug) console.log(cids, resBanners, resRecommendBooks, resBookLists)
						if (resBanners.data && resBanners.data.banners) {
							banners = resBanners.data.banners

							// 计算横幅合适的宽高
							// 转成 upx，因为两边边距设置为 30upx
							let size = resBanners.data.size || 2.619
							let info = util.getSysInfo()
							let width = info.windowWidth * info.pixelRatio - 60
							let height = width / size
							that.platform = info.platform || ''
							that.platform = that.platform.toLowerCase()
							that.bannerWidth = width / info.pixelRatio + "px"
							that.bannerHeight = height / info.pixelRatio + "px"
						}
						if (resRecommendBooks.data && resRecommendBooks.data.books) recommendBooks = resRecommendBooks.data.books
						if (resBookLists.data && resBookLists.data.books) {
							bookLists = resBookLists.data.books
							categories = categories.map(function(category) {
								let book = resBookLists.data.books[category.id]
								if (book != undefined && book.length > 0) {
									category.books = book
								} else {
									category.books = []
								}
								return category
							})
						}
					}).catch(function(e) {
						console.log(e)
						util.toastError(e.data.message || e.errMsg)
					}).finally(function() {
						uni.hideLoading()
						if (that.times > 0 && bookLists.length == 0) {
							if (config.debug) console.log("reload")
							let iload = setTimeout(function() {
								clearTimeout(iload)
								that.times = that.times - 1
								that.loadData()
							}, 3000)
						} else {
							that.times = 0
						}
						that.banners = banners
						that.categoryBooks = categories
						that.recommendBooks = recommendBooks
						that.showSearch = true
						uni.setStorage({
							key: that.cacheKey,
							data: JSON.stringify({
								banners: banners,
								categories: categories,
								recommendBooks: recommendBooks,
								showSearch: true
							})
						})
					})
				})
			},
			bannerClick(e) {
				if (config.debug) console.log("banner click", e)
				let url = e.target.dataset.url
				if (!url) return

				// #ifdef MP
				uni.navigateTo({
					url
				})
				// #endif

				// APP or H5
				// #ifndef MP
				if (String(url).indexOf("http://") > -1 || String(url).indexOf("https://") > -1) {
					plus.runtime.openURL(url) // 调用外部浏览器打开
					// plus.runtime.openWeb(url) // app 内打开
				} else {
					uni.navigateTo({
						url
					})
				}
				// #endif
			}
		}

	}
</script>

<style>
	.ios-platform {
		color: transparent;
		height: 1upx;
		overflow: hidden;
	}
	.history-link{
		display: inline-block;
		margin-left: 30px;
	}
</style>
