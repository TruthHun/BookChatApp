<template>
	<view>
		<iheader title="最近阅读" :showSearch="true"></iheader>
		<view v-if="books.length>0" class="base-padding mgt-30 mgb-30">
			<list-book :books="books" />
		</view>
		<loading :loading="loading" :tips="tips" />
	</view>
</template>

<script>
	import listBook from '../../components/listBook.vue'
	import loading from '../../components/loading.vue'
	import iheader from '../../components/header.vue'

	import config from '../../config.js'
	import util from '../../utils/util.js'
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				loading: false,
				tips: '',
				books: [],
			}
		},
		components: {
			listBook,
			loading,
			iheader,
		},
		onLoad() {
			util.loading("loading...")
		},
		onReady() {
			this.loadBooks()
		},
		onReachBottom() {
			this.loadBooks()
		},
		onPullDownRefresh() {
			this.page = 1
			this.loadBooks()
		},
		methods: {
			loadBooks: function() {
				let that = this

				if (that.loading || that.page == 0) return

				that.loading = true
				util.request(config.api.historyReadBook, {
					page: that.page,
					size: that.size
				}).then(function(res) {
					if (config.debug) console.log("config.api.historyReadBook", res)
					if (res.data && res.data.books) {
						let books = that.page == 1 ? [] : that.books
						let page = that.page
						if (res.data.books.length == that.size) {
							page ++
						} else {
							page = 0
						}
						res.data.books.map(item => {
							item.created_at = item.modify_time
							item.cnt_doc = item.doc_count
							item.view = item.vcnt
							return item
						})
						that.page = page
						that.books = books.concat(res.data.books)
						if (that.books.length == 0) that.tips = "您未登录或者最近没有阅读过相关书籍..."
					}
				}).catch(e => {
					console.log(e)
				}).finally(() => {
					uni.hideLoading()
					that.loading = false
					uni.stopPullDownRefresh()
				})
			}
		}
	}
</script>

<style>

</style>
