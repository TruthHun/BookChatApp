<template>
	<view>
		<iheader title="书签"></iheader>
		<view class='bookmarks base-padding font-lv3 color-grey'>
			<view v-if="bookmarks.length>0" v-for="(bookmark, index) in bookmarks" :key="index" class='row'>
				<view class='col-11'>
					<navigator :url='"/pages/read/read?identify="+ bookmark.book_id +"/"+ bookmark.doc_id'>
						<text class='color-grey'>[ {{bookmark.created_at}} ]</text>
						<text>{{bookmark.title}}</text>
					</navigator>
				</view>
				<view @click='delBookmark' :data-id="bookmark.doc_id" class='col-1 recycle'>
					<image src='../../static/images/recycle.png'></image>
				</view>
			</view>
			<view class='font-lv3 mgt-30 color-grey text-center pdt-30'>{{tips}}</view>
		</view>
	</view>
	
</template>

<script>
	import iheader from '../../components/header.vue'
	
	import config from '../../config.js'
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'

	export default {
		components:{
			iheader
		},
		data() {
			return {
				bookmarks: [],
				identify: '',
				tips: ''
			}
		},
		onLoad: function(op) {
			if (config.debug) console.log("op", op)
			if (op.identify) this.identify = op.identify
		},
		onShow: function() {
			util.getToken() == '' ? this.tips = ' -- 您暂时还没有书签 -- ' : this.loadBookmarks()
		},
		methods: {
			loadBookmarks: function() {
				let that = this
				let bookmarks = []
				util.loading()
				util.request(config.api.bookmark, {
					identify: that.identify
				}).then(function(res) {
					if (config.debug) console.log("config.api.bookmark", res)
					if (res.data && res.data.bookmarks) {
						bookmarks = res.data.bookmarks
					}
				}).catch(function(e) {
					console.log("request bookmarks error", e)
				}).finally(function() {
					bookmarks.map(function(item) {
						item.created_at = util.relativeTime(item.created_at)
						return item
					})
					that.bookmarks = bookmarks
					that.tips = bookmarks.length > 0 ? '' : ' -- 您暂时还没有书签 -- '
					uni.hideLoading()
				})
			},
			delBookmark: function(e) {
				if (config.debug) console.log("delBookmark", e)
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除该书签吗？',
					success: function(res) {
						if (res.confirm) {
							util.loading("正在删除...")
							util.request(config.api.bookmark + "?doc_id=" + e.currentTarget.dataset.id, {}, 'DELETE').then(function(res) {
								if (config.debug) console.log(res)
							}).catch(function(e) {
								console.log(e)
							}).finally(function() {
								let bookmarks = that.bookmarks
								bookmarks = bookmarks.filter(bookmark => {
									return bookmark.doc_id != e.currentTarget.dataset.id
								})
								that.bookmarks = bookmarks
								that.tips = bookmarks.length > 0 ? '' : ' -- 您暂时还没有书签 -- '
								uni.hideLoading()
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.recycle image {
		width: 20upx;
		height: 20upx;
		float: right;
		margin-top: 30upx;
	}

	.col-11 navigator {
		color: #353535;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.col-11 text {
		display: inline-block;
		margin-right: 15upx;
	}

	.row {
		border-bottom: 1upx solid #efefef;
		line-height: 300%;
	}
	@media (min-width: 768px) {
		.recycle image{
			max-width: 18px;
			max-height: 18px;
			margin-top: 15px;
		}
	}
</style>
