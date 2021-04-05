<template>
	<view>
		<iheader :title="title"></iheader>
		<view class='search base-padding mgb-30'>
			<search @search="search" :focus="focus" @clear="clear" :wd="wd" />
		</view>

		<view v-if="showTab" class="mgb-30">
			<tab @tabClick="tabClick" :tabs="tabs" :tabGridLen="6" :activeTab="tabValue" />
		</view>

		<view class='base-padding'>
			<list-book v-if="tabValue == 'book'" :books="lists" />
			<block v-if="tabValue == 'doc'">
				<view class='doc-list'>
					<view v-for="(doc,index) in lists" :key="index" class='row'>
						<view class='col-12 doc-title font-lv1 ellipsis-1row'>
							<navigator :url='"/pages/read/read?identify="+doc.book_id+"/"+doc.identify'>{{doc.title}}</navigator>
						</view>
						<view class='col-12 doc-info color-light font-lv4'>
							<view class='item'>
								<image src='../../static/images/eye.png'></image>
								<text>{{doc.vcnt}}</text>
							</view>
							<view class='item'>
								<image src='../../static/images/clock.png'></image>
								<text>{{doc.created_at}}</text>
							</view>
							<navigator class='item' :url='"/pages/intro/intro?id="+doc.book_id'>《{{doc.book_name}}》</navigator>
						</view>
						<navigator class='col-12 doc-intro color-grey font-lv3 ellipsis-3row' :url='"/pages/read/read?identify="+doc.book_id+"/"+doc.identify'>{{doc.content}}</navigator>
					</view>
				</view>
			</block>
		</view>
		<loading :loading="loading" :tips="tips" />
	</view>
</template>

<script>
	import loading from '../../components/loading.vue'
	import search from '../../components/search.vue'
	import listBook from '../../components/listBook.vue'
	import tab from '../../components/tab.vue'
	import iheader from '../../components/header.vue'

	import api from '../../utils/api.js'
	import util from '../../utils/util.js'
	import config from '../../config.js'

	export default {
		components: {
			loading,
			listBook,
			search,
			tab,
			iheader,
		},
		data() {
			return {
				tips: '',
				lists: [],
				wd: '',
				title: '搜索',
				page: 1,
				size: 10,
				tabValue: "book",
				showTab: false,
				focus: false,
				loading: false,
				tabs: [{
						title: "书籍",
						value: "book"
					},
					{
						title: "文档",
						value: "doc"
					}
				]
			}
		},
		onLoad(options) {
			if(config.debug) console.log("search",options)
			let wd = options.wd || ''
			if (wd == '') {
				this.focus = true
				return
			}
			util.loading("loading...")
			this.wd = wd
			this.showTab = true
			this.execSearch()
		},
		onShareAppMessage: function() {
			uni.showShareMenu({
				withShareTicket: true
			})
		},
		onReachBottom() {
			this.execSearch()
		},
		methods: {
			tabClick: function(e) {
				if (config.debug) console.log("tabClick:", e)
				if (e.value == this.tabValue) {
					return
				}
				this.tabValue = e.value
				this.page = 1
				this.lists = []
				this.showTab = true
				this.execSearch()
			},
			search: function(e) {
				if(config.debug) console.log(e)
				this.wd = e.wd
				this.page = 1
				this.lists = []
				this.showTab = true
				this.execSearch()
			},
			clear:function(){
				this.wd = ''
				uni.setNavigationBarTitle({
					title:'搜索'
				})
				this.showTab = false
				this.lists = []
				this.loading = false
				this.tips=''
				this.focus = true
				this.tabValue = 'book'
			},
			execSearch: function() {
				let that = this
				let api = config.api.searchDoc
				
				that.showTab = true
				
				that.title = that.wd+" · 搜索"
				// uni.setNavigationBarTitle({
				// 	title: this.wd+" · 搜索"
				// })
				
				if (that.pedding) return

				if (that.page == 0) {
					that.loading = false
					that.tips = '没有找到更多资源...'
					that.pedding = false
					return
				}

				that.loading = true
				that.pending = true

				if (that.tabValue != "doc") {
					api = config.api.searchBook
				}

				util.request(api, {
					wd: that.wd,
					page: that.page,
					size: that.size,
				}).then((res) => {
					if (config.debug) console.log(config.api.searchBook, res)
					let page = that.page + 1
					let result = []
					if (res.data && res.data.result) {
						result = res.data.result
						if (res.data.result.length < that.size) {
							page = 0
						}
					} else {
						page = 0
					}
					if (that.tabValue == 'doc') {
						result = result.map(function(item) {
							item.created_at = util.relativeTime(item.created_at)
							item.vcnt = util.fixView(item.vcnt)
							return item
						})
					}
					that.page = page
					that.lists = that.lists.concat(result)
					that.loading = page > 0
					that.tips = "没有找到更多资源..."
				}).catch((e) => {
					if (config.debug) console.log(e)
					that.loading = false
					that.tips = e.data.message || e.errMsg
					that.page = 0
				}).finally(function() {
					uni.hideLoading()
					that.pending = false
				})
			},
		}
	}
</script>

<style scoped>
	.doc-info {
		font-size: 12px;
		margin: 10px 0;
	}

	.doc-info image {
		height: 10px;
		width: 10px;
		margin-right: 3px;
	}

	.doc-info .item {
		display: inline-block;
		margin-right: 8px;
	}

	.doc-intro {
		font-size: 14px;
		line-height: 170%;
	}

	.doc-list .row {
		border-bottom: 1px solid #efefef;
		margin-bottom: 15px;
		padding-bottom: 15px;
	}
	@media (min-width: 768px) {
		.doc-info image {
			max-height: 18px;
			max-width: 18px;
			margin-right: 6px;
		}
	}
</style>
