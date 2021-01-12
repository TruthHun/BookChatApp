<template>
	<view>
		<iheader :title="title" :showSearch="true"></iheader>
		<view class="mgt-30">
			<tab @tabClick="tabClick" :tabGridLen="gridLen" :activeTab="activeTab" :tabs="tabs" />
		</view>
		<view v-if="books.length>0" class="base-padding mgt-30 mgb-30">
			<list-book :books="books" />
		</view>
		<loading :loading="loading" :tips="tips" />
	</view>
</template>

<script>
	import tab from '../../components/tab.vue'
	import listBook from '../../components/listBook.vue'
	import loading from '../../components/loading.vue'
	import iheader from '../../components/header.vue'

	import config from '../../config.js'
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'

	export default {
		data() {
			return {
				page: 1,
				size: 10,
				books: [],
				gridLen: 8,
				activeTab: 'new',
				loading: false,
				activeTitle: '最新',
				tips: '',
				title: '列表',
				tabs: [{
					title: '热门',
					value: 'popular'
				}, {
					title: '最新',
					value: 'new'
				}, {
					title: '推荐',
					value: 'recommend'
				}],

			}
		},
		components: {
			tab,
			listBook,
			loading,
			iheader,
		},
		onLoad(op) {
			util.loading("loading...")
			let cid = op.cid;
			if (config.debug) {
				console.log(op)
				if (!op.cid) cid = 108
			}
			if (!cid) {
				uni.redirectTo({
					url: '/pages/notfound/notfound'
				})
				return
			}
			this.cid = cid
			this.setTitle()
			this.loadBooks()
		},
		onShareAppMessage: function() {
			uni.showShareMenu({
				withShareTicket: true
			})
		},
		onReachBottom() {
			this.loadBooks()
		},
		methods: {
			tabClick(e) {
				if (config.debug) console.log(e)

				if (this.activeTab != e.value) {
					this.activeTitle = e.title
					this.activeTab = e.value
					this.page = 1
					this.setTitle()
					this.loadBooks(true)
				}
			},
			setTitle() {
				let that = this
				let tabTitle = that.tabTitle
				let categoryTitle = ''

				switch (that.activeTab) {
					case 'new':
						tabTitle = '最新';
						break
					case 'recommend':
						tabTitle = '推荐';
						break;
					case 'popular':
						tabTitle = '热门';
						break;
					default:
						tabTitle = '热门';
						break;
				}

				api.getCategoryByCid(that.cid).then((category) => {
					if (config.debug) console.log('api.getCategoryByCid', category)
					if (category && category.title) categoryTitle = category.title
				}).catch((e) => {
					console.log(e)
				}).finally(function() {
					that.title = categoryTitle + ' · ' + tabTitle
					// uni.setNavigationBarTitle({
					// 	title: categoryTitle + ' · ' + tabTitle
					// })
				})
			},
			loadBooks(isClearAll) {
				let that = this
				if (that.page == 0 && !isClearAll) return
				util.request(config.api.bookLists, {
					page: that.page,
					cid: that.cid,
					size: that.size,
					sort: that.activeTab
				}).then((res) => {
					if (config.debug) console.log(config.api.bookLists, res)
					let page = 0
					let books = that.books
					if (isClearAll) books = []
					if (res.data != undefined && res.data.books != undefined) {
						if (res.data.books.length >= that.size) page = that.page + 1
						books = books.concat(res.data.books)
					}
					let tips = '哼，我也是一只有底线的猿'
					if (books.length == 0) tips = '(-。-) 猿来没有内容'
					that.page = page
					that.books = books
					that.tips = tips
					that.loading = page > 0
				}).catch((e) => {
					console.log(e)
				}).finally(function(){
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style>

</style>
