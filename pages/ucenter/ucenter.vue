<template>
	<view>
		<iheader title="我的"></iheader>
		<view class='base-padding row user mgt-15'>
			<image :src='user.avatar'></image>
			<view class='username font-lv2'>{{user.nickname}}</view>
			<view class='color-grey font-lv3'>{{user.intro}}</view>
		</view>

		<view class='pdb-30 pdt-30'>
			<tab @tabClick="tabClick" :tabs="tabs" :tabGridLen="10" :activeTab="tabValue" />
		</view>


		<view v-if="(tabValue == 'release' || tabValue == 'star') && lists.length>0"
			class='list base-padding base-margin-bottom'>
			<block v-for="(book, index) in lists" :key='index'>
				<view class='row'>
					<navigator :url='"/pages/intro/intro?id="+book.book_id' class='col-3'>
						<image lazy-load='true' class='box-shadow cover' :src='book.cover' />
					</navigator>
					<navigator :url='"/pages/intro/intro?id="+book.book_id' class='col-9'>
						<view class='font-lv1 mgb-15 ellipsis-1row'>{{book.book_name}}</view>
						<view class='font-lv4 color-light info'>
							<view class='col'>
								<image src='../../static/images/eye.png'></image>
								<text> {{book.view}} 阅读</text>
							</view>
							<view class='col'>
								<image src='../../static/images/document.png'></image>
								<text> {{book.cnt_doc}} 章节</text>
							</view>
							<view v-if="tabValue =='release'" class='col'>
								<image src='../../static/images/clock.png'></image>
								<text> {{book.created_at}}</text>
							</view>
							<view v-if="tabValue=='star'" class='col'>
								<image src='../../static/images/star.png'></image>
								<text> {{book.star}} 收藏</text>
							</view>
						</view>
						<view class='font-lv3 color-grey ellipsis-2row'>
							{{book.description ? book.description : book.book_name}}</view>
					</navigator>
				</view>
			</block>
		</view>

		<view v-if="(tabValue == 'fans' || tabValue =='follow') && lists.length>0" class='list list-users'>
			<view class='row'>
				<block v-for="(user, idx) in lists" :key="idx">
					<navigator class='col-4' :url='"/pages/ucenter/ucenter?uid="+user.uid'>
						<view>
							<image lazy-load :src='user.avatar'></image>
						</view>
						<view>
							<text class='font-lv2 color-grey'>{{user.nickname}}</text>
						</view>
					</navigator>
				</block>
			</view>
		</view>

		<loading :loading="page > 0" :tips="tips" />

	</view>
</template>

<script>
	import tab from '../../components/tab.vue'
	import loading from '../../components/loading.vue'
	import iheader from '../../components/header.vue'

	import config from '../../config.js'
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'

	export default {
		components: {
			tab,
			loading,
			iheader,
		},
		data() {
			return {
				tabValue: 'release',
				page: 1,
				size: 10,
				lists: [],
				user: {},
				tips: '没有发现更多资猿...',
				tabs: [{
					title: '发布',
					value: "release"
				}, {
					title: "收藏",
					value: "star",
				}, {
					title: "关注",
					value: "follow"
				}, {
					title: "粉丝",
					value: "fans"
				}]
			}
		},
		onLoad: function(options) {
			util.loading("loading...")

			if (config.debug) console.log("params", options)
			if (options.tab) this.tabValue = options.tab

			let user = util.getUser() || {
				uid: 0
			}

			let uid = options.uid || 0
			let that = this

			if (!uid && user != undefined && user.uid != undefined) {
				uid = user.uid
			}

			if (!uid) {
				uni.redirectTo({
					url: '/pages/notfound/notfound',
				})
				return
			}

			if (uid != user.uid) {
				util.request(config.api.userInfo, {
					uid: uid
				}).then((res) => {
					if (config.debug) console.log(config.api.userInfo, res)
					if (res.data && res.data.user) {
						user = res.data.user
					} else {
						user.uid = uid
					}
					that.user = user
					that.getLists()
				}).catch((e) => {
					console.log(e)
					uni.redirectTo({
						url: '/pages/notfound/notfound',
					})
				}).finally(function() {
					that.setTitile()
				})
			} else {
				that.user = user
				that.getLists()
				that.setTitile()
			}
		},
		onReachBottom: function() {
			switch (this.tabValue) {
				case 'release':
					this.getRelease();
					break;
				case 'star':
					this.getStar();
					break;
				case 'fans':
					this.getFans();
					break;
				case 'follow':
					this.getFollow()
					break;
			}
		},
		methods: {

			tabClick: function(e) {
				if (config.debug) console.log("tabClick", e)

				if (e.value == this.tabValue) return;

				this.lists = []
				this.page = 1
				this.tabValue = e.value
				this.getLists()
				this.setTitile(e.title)
			},
			getLists: function() {
				switch (this.tabValue) {
					case 'release':
						this.getRelease()
						break;
					case 'star':
						this.getStar()
						break;
					case 'follow':
						this.getFollow()
						break;
					case 'fans':
						this.getFans()
						break;
				}
				uni.hideLoading()
			},
			getRelease: function() {
				this._getBooks(config.api.userRelease)
			},
			getStar: function() {
				this._getBooks(config.api.bookshelf)
			},
			getFollow: function() {
				this._getFansOrFollow(config.api.userFollow)
			},
			getFans: function() {
				this._getFansOrFollow(config.api.userFans)
			},
			setTitile(title) {
				if (title == undefined || title == '') {
					switch (this.tabValue) {
						case 'release':
							title = '发布';
							break;
						case 'star':
							title = '收藏';
							break;
						case 'fans':
							title = '粉丝';
							break;
						case 'follow':
							title = '关注';
							break;
						default:
							title = '收藏';
							break;
					}
				}
				uni.setNavigationBarTitle({
					title: this.user.nickname + " · " + title
				})
			},
			_getBooks: function(api) {
				let that = this
				let page = that.page

				if (page == 0) return

				let lists = []

				if (page > 1) lists = that.lists

				util.request(api, {
					uid: that.user.uid,
					page: page,
				}).then((res) => {
					if (config.debug) console.log(api, res)

					if (res.data && res.data.books && res.data.books.length > 0) {
						if (res.data.books.length < that.size) {
							page = 0
						} else {
							page++
						}
						if (config.debug) console.log("res.data.books", res.data.books)
						lists = lists.concat(res.data.books.map(function(book) {
							book.created_at = util.relativeTime(book.created_at)
							book.view = util.fixView(book.view)
							return book
						}))
					} else {
						page = 0
					}

					that.lists = lists
					that.page = page
				}).catch((e) => {
					console.log(e)
				})
			},
			_getFansOrFollow: function(api) {
				let that = this
				let page = that.page

				if (page == 0) return

				let lists = []

				if (page > 1) lists = that.lists

				util.request(api, {
					uid: that.user.uid,
					page: page,
				}).then((res) => {
					if (config.debug) console.log(api, res)
					if (res.data && res.data.users && res.data.users.length > 0) {
						if (res.data.users.length < that.size) {
							page = 0
						} else {
							page++
						}
						lists = lists.concat(res.data.users)
					} else {
						page = 0
					}
					that.lists = lists
					that.page = page
				}).catch((e) => {
					console.log(e)
				})
			}
		}
	}
</script>

<style scoped>
	.user {
		text-align: center;
		border-bottom: 5px solid #f6f6f6;
		padding-bottom: 15px;
	}

	.user .text-muted {
		text-align: center;
	}

	.username {
		margin: 8px auto;
	}

	.user image {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: 1px solid #ddd;
		display: block;
		margin: 0 auto;
	}

	.list-users .row {
		border-bottom: 0 !important;
	}

	.user view {
		display: block;
		width: 100%;
	}

	.base-info image {
		height: 20px;
		width: 20px;
		margin-right: 15px;
	}

	.base-info image.pull-right {
		margin-right: 0;
	}

	.base-info {
		padding-top: 0;
		padding-bottom: 0;
	}

	.base-info .col-12 {
		border-bottom: 1px solid #f6f6f6;
		padding-bottom: 15px;
		padding-top: 15px;
		color: #666;
	}

	.base-info .col-12:last-of-type {
		border-bottom: 0;
		margin-bottom: 0;
	}



	.list .col-9 {
		box-sizing: border-box;
		padding-left: 15px;
	}

	.list .row {
		margin-bottom: 15px;
		padding-bottom: 15px;
		border-bottom: 1upx solid #efefef;
		display: flex;
	}

	.list .color-grey {
		line-height: 150%;
	}

	.breadcrumb {
		border-bottom: 1upx solid #ddd;
		line-height: 250%;
		margin-top: 8px;
	}

	.cover {
		width: 170upx;
		height: 223.5upx;
	}

	.info {
		box-sizing: border-box;
		border-bottom: 0 !important;
		display: flex;
		margin: 10px 0;
	}

	.info .col {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.info image {
		width: 12px;
		height: 12px;
	}

	.info text {
		margin-left: 4px;
	}

	.icon {
		width: 32px;
		height: 32px;
		margin: 0 auto;
		display: block;
	}

	.list-users {
		text-align: center;
	}

	.list-users .col-4 {
		margin-bottom: 30px;
	}

	.list-users image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}

	@media (min-width: 768px) {
		.info image {
			max-width: 18px;
			max-height: 18px;
			margin-right: 6px;
		}

		.ellipsis-2row {
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.list .color-grey {
			line-height: 200%;
		}

		.cover {
			width: 170px;
			height: 223.5px;
		}
		.col-4 {
			flex: 0 0 25%;
			max-width: 25%;
		}
	}
	@media (min-width: 1000px){
		.col-4 {
			flex: 0 0 20%;
			max-width: 20%;
		}
	}
</style>
