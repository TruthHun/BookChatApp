<template>
	<view>
		<iheader :title="'目录 · '+ book.book_name"></iheader>
		<imenu :book="book" :wd="wd" :menu="menuTree" :token="token" :result="result" 
		@search="search" 
		@itemClick="itemClick"
		@tabClick="tabClick"
		@clear="clear"/>
	</view>
</template>

<script>
	import util from '../../utils/util.js'
	import config from '../../config.js'
	import api from '../../utils/api.js'

	import imenu from '../../components/menu.vue'
	import iheader from '../../components/header.vue'


	export default {
		components: {
			imenu,
			iheader,
		},
		data() {
			return {
				book: {},
				menuTree: [],
				result: [],
				identify: '',
				wd: '',
				token: '',
				title: '目录'
			}
		},
		onLoad: function(options) {
			let identify = options.id || options.identify;
			if (!identify || identify == undefined) {
				if (config.debug){
					identify = 'dochub'
				}else{
					uni.redirectTo({
						url: '/pages/notfound/notfound',
					})
					return
				}
			}
			this.identify = identify
		},
		onShow: function() {
			this.token = util.getToken() || ''
			this.loadData()
		},
		onShareAppMessage: function() {
			uni.showShareMenu({
				withShareTicket: true
			})
		},
		methods: {
			loadData: function() {
				let that = this
				let menu = []
				let book = {}
				let identify = that.identify
				if (that.book.book_id > 0) {
					return
				}
				util.loading()

				Promise.all([util.request(config.api.bookMenu, {
					identify: identify
				}), util.request(config.api.bookInfo, {
					identify: identify
				})]).then(function([resMenu, resBook]) {
					if (config.debug) console.log(resMenu, resBook)
					if (resMenu.data && resMenu.data.menu) {
						menu = resMenu.data.menu
					}
					if (resBook.data && resBook.data.book) {
						book = resBook.data.book
						book.score_float = Number(book.score / 10).toFixed(1)
						book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
					}
				}).catch(function(e) {
					console.log(e)
				}).finally(function() {
					if (menu.length == 0) {
						uni.redirectTo({
							url: '/pages/notfound/notfound',
						})
						return
					}
					that.menuTree = util.menuToTree(menu)
					that.book =  book
					that.title = '目录 · ' + book.book_name
					uni.hideLoading()
				})
			},
			itemClick: function(e) {
				if(config.debug) console.log("itemClick", e)
				uni.navigateTo({
					url: '/pages/read/read?identify=' + e.identify,
				})
			},
			search: function(e) {
				if(config.debug) console.log("search",e)
				util.loading("玩命搜索中...")
				let that = this
				let result = []
				util.request(config.api.searchDoc, {
					identify: that.identify,
					wd: e.wd
				}).then(function(res) {
					if (config.debug) console.log(config.api.searchDoc, res)
					if (res.data && res.data.result) {
						result = res.data.result
					}
				}).catch(function(e) {
					console.log(e)
				}).finally(function() {
					that.result = result
					that.wd = e.wd
					uni.hideLoading()
					if (result.length == 0) {
						util.toastError("没有搜索到结果")
					}
				})
			},
			clear: function() {
				if(config.debug) console.log("click clear search word")
				this.result = []
			}
		}
	}
</script>

<style>

</style>
