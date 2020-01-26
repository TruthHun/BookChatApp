<template>
	<view class="page">
		<iheader :title="book.book_name"></iheader>
		<view @click='pageClick' :class='"bg-theme"+setting.themeIndex' :style='"min-height:"+(sys.screenHeight - sys.statusBarHeight - 55)+"px"'>
			<view :class='"markdown-body editormd-preview-container bg-theme"+setting.themeIndex' :style='"line-height:1.8;font-size:"+fontIndexs[setting.fontIndex]'>
				<view class='title font-lv1 text-center'>{{article.title}}</view>
				<rich-text :nodes="nodes"></rich-text>
			</view>
		</view>

		<view :class='"drawer drawer-left " + [showMenu ? "show":""]'>
			<view class='drawer-content' :style="'padding-bottom: 70px;'+menuStyle">
				<imenu :book="book" :currentDocId="article.id" :wd="wd" :menu="menuTree" :result="result" :tips="tips" @search="search"
				 @clear="clear" @itemClick="itemClick" />
			</view>
		</view>

		<view :class='"drawer drawer-right "+[showMore ? "show":""]'>
			<view class='drawer-content'>
				<view class='more-setting' style='bottom: 70px'>
					<block v-if="!h5">
						<view class='row setting-tips'>
							<text class='color-grey font-lv4'>屏幕亮度</text>
						</view>
						<view class='row setting-screen setting-item '>
							<slider min='0' max='1' step='0.1' block-size='18' @change="setBrightnessScreen" :value='screenBrightness'
							 show-value></slider>
						</view>
					</block>

					<view class='row setting-tips'>
						<text class='color-grey font-lv4'>字体大小</text>
					</view>
					<view class='row setting-font setting-item'>
						<view class='col' @click='setFont' data-action="minus">
							<image src='/static/images/font-minus.png'></image>
						</view>
						<view class='col'>{{setting.fontIndex + 1}}</view>
						<view class='col' @click='setFont' data-action="plus">
							<image src='/static/images/font-plus.png'></image>
						</view>
					</view>
					<view class='row setting-tips'>
						<text class='color-grey font-lv4'>阅读背景</text>
					</view>
					<view class='row setting-bg setting-item'>
						<view class='col bg-theme0' @click='setTheme' data-theme="0">
							<image v-if="setting.themeIndex == 0" src='/static/images/checked.png'></image>
						</view>
						<view class='col bg-theme1' @click='setTheme' data-theme="1">
							<image v-if="setting.themeIndex == 1" src='/static/images/checked.png'></image>
						</view>
						<view class='col  bg-theme2' @click='setTheme' data-theme="2">
							<image v-if="setting.themeIndex == 2" src='/static/images/checked.png'></image>
						</view>
						<view class='col  bg-theme3' @click='setTheme' data-theme="3">
							<image v-if="setting.themeIndex == 3" src='/static/images/checked.png'></image>
						</view>
						<view class='col  bg-theme4' @click='setTheme' data-theme="4">
							<image v-if="setting.themeIndex == 4" src='/static/images/checked.png'></image>
						</view>
					</view>

					<view class='row setting-btn setting-item color-grey font-lv3'>
						<view class='col' @click='resetSetting'>
							<text>恢复默认值</text>
						</view>
						<navigator :url='"/pages/bookmarks/bookmarks?identify="+book.book_id' class='col'>
							<text>查看书签</text>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class='row font-lv3'>
				<view v-if="article.bookmark" class='col' @click='clickBookmark' data-action="cancel">
					<image src='../../static/images/bookmark-added.png'></image>
				</view>
				<view v-else class='col' @click='clickBookmark' data-action="add">
					<image src='../../static/images/bookmark-add.png'></image>
				</view>
				<view class='col' v-if="preDisable">
					<image src='../../static/images/pre-disable.png'></image>
				</view>
				<view class='col' v-else @click='clickPrev'>
					<image src='../../static/images/pre.png'></image>
				</view>
				<view class='col' @click='clickMenu'>
					<image src='../../static/images/menu.png'></image>
				</view>
				<view class='col' v-if="nextDisable">
					<image src='../../static/images/next-disable.png'></image>
				</view>
				<view class='col' v-else @click='clickNext'>
					<image src='../../static/images/next.png'></image>
				</view>
				<view class='col' @click='clickMore'>
					<image src='../../static/images/more.png'></image>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import '../../static/css/markdown.css'

	import util from '../../utils/util.js'
	import api from '../../utils/api.js'
	import config from '../../config.js'

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
				article: {},
				menuSortIds: [],
				nodes: [],
				menuTree: [],
				menuIndex: 0,
				bookmark: [], //书签
				showMenu: false,
				showMore: false,
				preDisable: false,
				nextDisable: false,
				identify: '',
				menuStyle: '',
				wd: '', //搜索关键字
				setting: {
					themeIndex: 0,
					fontIndex: 0,
				},
				defautScreenBrightness: 0,
				screenBrightness: 0,
				fontIndexs: util.getSysInfo().windowWidth >= 768 ? ['16px', '17px', '18px', '19px', '20px', '21px', '22px'] : [
					'14px', '15px', '16px', '17px', '18px', '19px', '20px'
				],
				tips: '',
				result: [],
				h5: false,
				sys: util.getSysInfo(),
			}
		},
		onLoad: function(options) {
			// 步骤：
			// 1. 先获取书籍目录
			// 2. 如果没传文档标识参数，则用目录的首个章节作为默认获取的文章
			let that = this;
			let identify = options.identify || 'help'
			let arr = String(identify).split("/")
			let book = {}
			let menu = []

			// #ifdef H5
			that.h5 = true
			// #endif


			if (arr.length == 0) {
				uni.redirectTo({
					url: '/pages/notfound/notfound',
				})
				return
			}

			that.initReaderSetting()

			util.loading()

			let latestReadId = 0

			Promise.all([util.request(config.api.bookMenu, {
				identify: arr[0]
			}), util.request(config.api.bookInfo, {
				identify: arr[0]
			})]).then(function([resMenu, resBook]) {
				if (config.debug) console.log(resMenu, resBook)
				if (resMenu.data && resMenu.data.menu) {
					menu = resMenu.data.menu
				}
				if (resMenu.data && resMenu.data.latest_read_id) {
					latestReadId = resMenu.data.latest_read_id
				}
				if (resBook.data && resBook.data.book) {
					book = resBook.data.book
					book.score_float = Number(book.score / 10).toFixed(1)
					book.is_read = 1
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

				let menuTree = util.menuToTree(menu)
				let sysInfo = util.getSysInfo()
				let paddingTop = sysInfo.titleBarHeight + sysInfo.statusBarHeight
				that.menuStyle= `padding-top: ${paddingTop}px;`
				that.menuSortIds = util.menuSortIds(menuTree)
				that.menuTree = menuTree
				that.book = book
				if (arr.length != 2) {
					if (latestReadId > 0) {
						identify = book.book_id + "/" + latestReadId
					} else {
						identify = book.book_id + "/" + menuTree[0].id
					}
				}

				if (config.debug) console.log("sys info", util.getSysInfo())

				that.getArticle(identify)
			})
		},
		onUnload() {
			uni.hideLoading()
		},
		onShareAppMessage: function() {
			uni.showShareMenu({
				withShareTicket: true
			})
		},
		methods: {
			getArticle: function(identify) {
				let article = {}
				let that = this
				let params = {
					identify: identify,
					'from-app': true
				}

				util.request(config.api.read, params).then(function(res) {
					if (res.data && res.data.article) {
						article = res.data.article
					}
				}).catch(function(e) {
					let message = e.data.message || e.errMsg
					util.toastError(message)
				}).finally(function() {
					let nextDisable = that.menuSortIds.indexOf(article.id) + 1 == that.menuSortIds.length
					let preDisable = that.menuSortIds.indexOf(article.id) == 0

					if (!article.content) article.content = []

					// #ifndef APP-PLUS
					if (config.debug) console.log("article", article.content)
					// #endif

					let nodes = [{
						"name": "img",
						"attrs": {
							"src": that.setting.themeIndex == 3 ? "./static/images/loading-white.png" : "./static/images/loading.png",
							"style": "display:block;margin:200px auto;"
						}
					}]

					// #ifndef APP-PLUS
					nodes = article.content
					// #endif

					that.nodes = nodes
					that.article = article
					that.identify = identify
					that.showMenu = false
					that.showMore = false
					that.nextDisable = nextDisable
					that.preDisable = preDisable
					that.menuTree = util.menuTreeReaded(that.menuTree, article.id)

					uni.hideLoading()

					// #ifndef APP-PLUS
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
					// #endif

					// #ifdef APP-PLUS
					that.renderContent(article.content)
					// #endif
				})
			},
			pageClick: function(e) {
				if (config.debug) console.log('contentClick', e)
				this.showMenu = false
				this.showMore = false
			},
			clickMenu: function(e) {
				this.showMenu = !this.showMenu
				this.showMore = false
			},
			clickMore: function(e) {
				this.showMore = !this.showMore
				this.showMenu = false
			},
			clickNext: function() {
				let that = this
				let idx = that.menuSortIds.indexOf(that.article.id)
				idx++
				that.nextDisable = true
				if (idx < that.menuSortIds.length) {
					// #ifdef MP
					util.loading('加载下一章节...')
					// #endif
					that.getArticle(that.book.book_id + "/" + that.menuSortIds[idx])
				} else {
					uni.showToast({
						title: '没有下一章节了',
						mask: true,
						image: '/static/images/error.png'
					})
				}
			},
			clickPrev: function() {
				let that = this
				let idx = that.menuSortIds.indexOf(that.article.id)
				that.preDisable = true
				idx--
				if (idx > -1) {
					// #ifdef MP
					util.loading('加载上一章节...')
					// #endif
					that.getArticle(that.book.book_id + "/" + that.menuSortIds[idx])
				} else {
					uni.showToast({
						title: '没有上一章节了',
						mask: true,
						image: '/static/images/error.png'
					})
				}
			},
			itemClick: function(e) {
				util.loading()
				this.getArticle(e.identify)
			},
			search: function(e) {
				if (config.debug) console.log("search", e)

				let that = this
				let result = []

				util.loading("玩命搜索中...")
				util.request(config.api.searchDoc, {
					identify: that.book.book_id,
					wd: e.wd
				}).then(function(res) {
					if (config.debug) console.log(config.api.searchDoc, res)
					if (res.data && res.data.result) {
						result = res.data.result
					}
				}).catch(function(e) {
					console.log(e)
				}).finally(function() {
					uni.hideLoading()
					that.result = result
					that.wd = e.wd
					if (result.length == 0) {
						util.toastError("没有搜索到结果")
					}
				})
			},
			clear: function(e) {
				this.result = []
			},
			clickBookmark: function(e) {
				let that = this

				if (util.getToken() == '') {
					uni.showModal({
						title: '温馨提示',
						content: '您当前未登录，无法添加书签，是否要跳转登录？',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/read/read?identify=' + that.book.book_id +
										'/' + that.article.id),
								})
							}
						}
					})
				} else {
					if (e.currentTarget.dataset.action == "cancel") {
						uni.showModal({
							title: '温馨提示',
							content: '您确定要取消该书签吗？',
							success: function(res) {
								if (res.confirm) {
									that._clickBookmark('cancel')
								}
							}
						})
					} else {
						that._clickBookmark('add')
					}
				}
			},
			renderContent: function(nodes) {
				let that = this
				let t = setTimeout(function() {
					that.nodes = nodes
					clearTimeout(t)
				}, 300) // 让用户视觉上认为有个渲染过程，避免内容渲染过快，避免页面从空白到出现内容的过程中有些突兀
			},
			setFont: function(e) {
				// 0 ~ 6
				if (config.debug) console.log(e)
				let that = this
				let setting = that.setting
				if (e.currentTarget.dataset.action == 'minus') {
					if (setting.fontIndex > 0) setting.fontIndex = setting.fontIndex - 1
				} else {
					if (setting.fontIndex < 6) setting.fontIndex = setting.fontIndex + 1
				}
				that.setting = setting
				util.setReaderSetting(Object(setting))
			},
			setTheme: function(e) {
				if (config.debug) console.log(e)
				// 0 ~ 4
				let that = this
				let setting = that.setting
				if (e.currentTarget.dataset.theme >= 0 && e.currentTarget.dataset.theme < 5) {
					setting.themeIndex = e.currentTarget.dataset.theme
				} else {
					setting.themeIndex = 0
				}
				that.setting = setting
				util.setReaderSetting(Object(setting))
			},
			setBrightnessScreen: function(e) {
				if (config.debug) console.log(e)
				this.screenBrightness = e.detail.value
				uni.setScreenBrightness({
					value: e.detail.value,
				})
			},
			initReaderSetting: function() {
				let setting = util.getReaderSetting()
				let screenBrightness = 0

				// #ifndef H5
				uni.getScreenBrightness({
					success: function(res) {
						screenBrightness = res.value
					}
				})
				// #endif

				this.setting = setting
				this.defautScreenBrightness = screenBrightness
				this.screenBrightness = screenBrightness
			},
			resetSetting: function() {
				let setting = {
					fontIndex: 0,
					themeIndex: 0,
				}
				this.setting = setting
				this.screenBrightness = this.defautScreenBrightness
				uni.setScreenBrightness({
					value: this.defautScreenBrightness
				})
				util.setReaderSetting(setting)
			},
			_clickBookmark: function(action) {
				let that = this
				let article = this.article
				let method = action == "cancel" ? 'DELETE' : 'PUT'

				util.request(config.api.bookmark + "?doc_id=" + article.id, {}, method).then(function(res) {
					if (config.debug) console.log(config.api.bookmark + "?doc_id=" + article.id, res)
					article.bookmark = !article.bookmark
					that.article = article
					uni.showToast({
						title: action == "cancel" ? '移除书签成功' : '添加书签成功'
					})
				}).catch(function(e) {
					util.toastError(e.data.message || e.errMsg)
				})
			}
		}
	}
</script>

<style>
	.page,
	page {
		min-height: 100%;
	}

	.title {
		line-height: 1.6;
		border-bottom: 1px solid #efefef;
		padding: 0 0 30upx;
		margin-bottom: 30upx;
	}

	.markdown-body {
		transition: all 0.5s;
		padding: 30upx 30upx 120upx;
		box-sizing: border-box;
	}

	/* footer */

	.footer {
		box-shadow: 0 0 5px #efefef;
		border-top: 1px solid #efefef;
		position: fixed;
		height: 48px;
		line-height: 48px;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 100;
		box-sizing: border-box;
		background-color: #fff;
		transition: all 0.5s;
	}

	.footer.hide {
		bottom: -60px;
	}

	.footer image {
		margin-top: 11px;
		width: 25px;
		height: 25px;
	}

	/* 抽屉 */

	.drawer {
		width: 80%;
		position: fixed;
		z-index: 99;
		height: 100%;
		overflow-y: scroll;
		top: 0;
		transition: all 0.5s;
		-webkit-overflow-scrolling: touch;
		background-color: #fff;
	}

	.drawer .drawer-content {
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 120upx;
	}

	.drawer-left {
		right: 100%;
		border-right: 1upx solid #efefef;
	}

	.drawer-right {
		left: 100%;
		border-left: 1upx solid #efefef;
	}

	.drawer-left.show {
		right: 20%;
		border-right: 1px solid #efefef;
	}

	.drawer-right.show {
		left: 20%;
		border-left: 1px solid #efefef;
	}

	.more-setting {
		position: absolute;
		width: 100%;
	}

	.setting-tips {
		padding: 8px 8px;
	}

	.setting-item {
		text-align: center;
		font-size: 16px;
		line-height: 16px;
		border: 1upx solid #efefef;
		border-left: 0;
		border-right: 0;
		margin-bottom: 22px;
	}

	.more-setting .col {
		padding: 15px 0;
	}

	.setting-btn {
		margin-bottom: 0;
		background-color: transparent;
	}

	.setting-btn navigator {
		border-left: 1upx solid #efefef;
	}

	.more-setting .col:nth-of-type(2) {
		border-right: 1upx solid #efefef;
		border-left: 1upx solid #efefef;
	}

	.more-setting .setting-bg .col:nth-of-type(2) {
		border: 0;
	}

	.more-setting image {
		width: 16px;
		height: 16px;
	}

	slider {
		width: 100%;
	}

	.bg-theme0 {
		background-color: #fff !important;
	}

	.bg-theme1 {
		background-color: rgb(232, 232, 232) !important;
	}

	.bg-theme2 {
		background-color: rgb(223, 214, 198) !important;
	}

	.bg-theme3 {
		background-color: rgb(208, 189, 138) !important;
	}

	.bg-theme4 {
		background-color: rgb(207, 231, 207) !important;
	}

	.cont-box {
		overflow-y: scroll;
	}

	@media (min-width:768px) {
		.drawer {
			width: 65%;
		}

		.drawer-left.show {
			right: 35%;
		}

		.drawer-right.show {
			left: 35%;
		}
	}
</style>
