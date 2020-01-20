<template>
	<view>
		<iheader title="书架" :showIcon="false"></iheader>
		<block v-if="books.length>0 && token!='' && showLongpressTips">
			<view class="row mgt-15 base-padding">
				<view class="col-12 font-lv4 color-grey longpress-tips">
					<text>温馨提示：长按可将书籍从书架中移除</text>
					<text @click="closeLongpressTips" class="close-longpress-tips color-info">X</text>
				</view>
			</view>
		</block>

		<view class='row box'>
			<view v-if="showTips && books.length ==0 " class='tips col-12 font-lv2'>
				<view v-if="token">
					<view>黑夜给了你一双黑色的眼睛</view>
					<view>你用它去寻找光明...</view>
					<view>我们给了你一个华丽的书架</view>
					<view>你却没有一本书籍...</view>
					<view class='action'>
						<search target="/pages/search/search" />
					</view>
				</view>
				<view v-if="!token">
					<view>黑夜给了你一双黑色的眼睛</view>
					<view>你用它去寻找光明...</view>
					<view>我们给了你一个华丽的书架</view>
					<view>你却没登录...</view>
					<view class='action'>
						<button @click='login'>码上登录</button>
					</view>
				</view>
			</view>


			<block v-if="books.length>0 && token!=''">
				<view v-for="(book, index) in books" :key="index" class='col-4'>
					<navigator @longpress="longpress" :data-book="book.book_name" :data-id="book.book_id" :url='"/pages/read/read?identify="+book.book_id'
					 class='book text-muted'>
						<image class='box-shadow cover' :lazy-load="true" :src='book.cover'></image>
						<view class='font-lv3  ellipsis-2row'>{{book.book_name}}</view>
					</navigator>
				</view>
			</block>
		</view>
		<loading :loading="page>0 && books.length>0" />
	</view>
</template>

<script>
	import config from '../../config.js'
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'

	import loading from '../../components/loading.vue'
	import search from '../../components/search.vue'
	import iheader from '../../components/header.vue'

	export default {
		data() {
			return {
				page: 1,
				size: 24,
				books: [],
				showTips: false,
				wd: '',
				token: '',
				showLongpressTips: false,
			}
		},
		components: {
			search,
			loading,
			iheader,
		},
		onShow: function() {
			this.showLongpressTips = uni.getStorageSync("showLongpressTips") != "false"
			if (config.debug) console.log("onShow", "bookshelfChanged", getApp().globalData.bookshelfChanged)
			this.loadBooks(getApp().globalData.bookshelfChanged)
			getApp().globalData.bookshelfChanged = false
		},
		onReachBottom: function() {
			this.loadBooks()
		},
		methods: {
			longpress: function(e) {
				if (config.debug) console.log("longpress", e)
				let that = this
				let bookName = e.currentTarget.dataset.book
				let bookId = e.currentTarget.dataset.id
				let books = that.books
				uni.showModal({
					title: "温馨提示",
					content: `您是否要将书籍《${bookName}》从书架中移除？`,
					success: (action) => {
						if (action.confirm) {
							if (config.debug) console.log("确定移除")
							util.request(config.api.bookStar, {
								identify: bookId
							}).then(function(res) {
								if (config.debug) console.log(config.api.bookStar, res)
								uni.showToast({
									title: res.data.data && res.data.data.is_cancel ? '移除收藏成功' : '收藏书籍成功',
								})
								// 去除被移除了的书籍
								that.books = books.filter(function(book) {
									return book.book_id != bookId
								})
							}).catch(function(e) {
								util.toastError(e.message || e.errMsg)
							})
						}
					}
				})
			},
			closeLongpressTips: function() {
				this.showLongpressTips = false
				uni.setStorageSync("showLongpressTips", "false")
			},
			loadBooks: function(isClearAll) {

				let that = this
				let token = util.getToken() || ''

				if (config.debug) console.log("token", token)

				if (token == '') {
					that.showTips = true
					that.books = []
					that.token = token
					that.page = 1
					return
				}

				if (that.page == 0 && !isClearAll) return;

				let page = isClearAll ? 1 : that.page
				let size = that.size
				let books = that.books
				let showTips = false

				util.request(config.api.bookshelf, {
					page: page,
					size: size,
				}).then((res) => {
					if (config.debug) console.log(config.api.bookshelf, res)
					if (res.data && res.data.books) {
						res.data.books.length >= size ? page++ : page = 0
						books = isClearAll ? res.data.books : that.books.concat(res.data.books)
					} else {
						if (page == 1) {
							books = []
							showTips = true
						}
						page = 0
					}

				}).catch(function(e) {
					if (config.debug) console.log("error", e)
					util.toastError(e.message || e.errMsg)
				}).finally(function() {
					that.books = books
					that.showTips = books.length == 0
					that.page = page
					that.token = token
					if (isClearAll) uni.pageScrollTo({
						scrollTop: 0,
					})
				})
			},
			login: function(e) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/bookshelf/bookshelf')
				})
			},
		}
	}
</script>

<style>
	.box {
		padding: 15upx;
	}

	.tips {
		width: 100%;
		box-sizing: border-box;
		padding: 120upx 15upx 0;
		text-align: center;
		color: #888;
		line-height: 200%;
	}

	.tips .action {
		margin-top: 60upx;
	}

	.book {
		width: 206upx;
		max-width: 100%;
		display: block;
		margin: 30upx auto;
	}

	.book image {
		width: 206upx;
		height: 271.6upx;
		margin-bottom: 15upx;
	}

	.longpress-tips {
		border: 1upx dashed #FF6600;
		border-radius: 3upx;
		box-sizing: border-box;
		padding: 20upx 20upx 20upx 15upx;
		border-radius: 5upx;
	}

	.longpress-tips .close-longpress-tips {
		float: right;
	}

	@media (min-width: 768px) {
		.ellipsis-2row {
			line-height: 1.8;
		}
		.col-4{
			flex: 0 0 25%;
			max-width: 25%;
		}
		.book {
			width: 154.5upx;
			max-width: 100%;
			display: block;
			margin: 30upx auto;
		}
		
		.book image {
			width: 154.5upx;
			height: 203.7upx;
			margin-bottom: 8upx;
		}
	}
</style>
