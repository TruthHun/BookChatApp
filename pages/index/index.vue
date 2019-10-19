<template>
	<view class="root">
		<view v-if="showSearch" class="base-padding mgb-30upx">
			<search target="/pages/search/search" />
		</view>

		<view v-if="banners.length>0" class="base-padding base-margin-bottom">
			<swiper :style="'height:'+bannerHeight" :autoplay="autoplay" :indicator-dots="indicatorDots" :interval="interval"
			 :duration="duration">
				<swiper-item v-for="banner in banners" :key="banner.id">
					<image @click="bannerClick" :data-url="banner.link" :src="banner.image" class="radius-basic" :style="'height:'+bannerHeight+';width:'+bannerWidth"></image>
				</swiper-item>
			</swiper>
		</view>

		<!--  推荐  -->
		<view v-if="recommendBooks.length>0" class='panel base-padding recommend base-margin-bottom'>
			<view class='panel-heading'>
				<view class='panel-title font-lv1 strong'>最新推荐</view>
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

	</view>


</template>

<script>
	import scrollBook from '../../components/scrollBook.vue'
	import search from '../../components/search.vue'
	import listBook from '../../components/listBook.vue'

	import api from '../../utils/api.js'
	import util from '../../utils/util.js'
	import config from '../../config.js'

	export default {
		components: {
			scrollBook,
			search,
			listBook,
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
				banners: [],
				categoryBooks: [],
				recommendBooks: [],
				times: 100, // 当iOS未允许访问网络的时候，没3秒请求一次数据
			}
		},
		onLoad() {
			let info = util.getSysInfo()
			// this.bannerWidth = info.bannerWidth + "px"
			// this.bannerHeight = info.bannerHeight + "px"
			// if (config.debug) console.log(this.bannerWidth, this.bannerHeight)
			this.loadData()
		},
		onShow() {
			if (this.categoryBooks.length == 0) {
				this.loadData()
			}
		},
		methods: {
			loadData() {
				// #ifdef MP
				util.loading('玩命加载中...')
				// #endif

				let that = this
				let cids = []
				let categories = []
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
					let bookLists = []
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
							that.bannerWidth = width / info.pixelRatio + "px"
							that.bannerHeight = height / info.pixelRatio + "px"
						}
						if (resRecommendBooks.data && resRecommendBooks.data.books) recommendBooks = resRecommendBooks.data.books
						if (resBookLists.data && resBookLists.data.books) {
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
					}).finally(function() {
						that.banners = banners
						that.categoryBooks = categories
						that.recommendBooks = recommendBooks
						that.showSearch = true
						uni.hideLoading()
						if (that.times > 0 && (!categories || categories.length == 0)) {
							if (config.debug) console.log("reload")
							let iload = setTimeout(function() {
								clearTimeout(iload)
								that.times = that.times - 1
								that.loadData()
							}, 3000)
						} else {
							that.times = 0
						}
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

</style>
