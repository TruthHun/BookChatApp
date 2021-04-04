<template>
	<view>
		
		<!-- 搜索 -->
		<view class='search base-padding mgb-30'>
			<search :wd="wd" @clear="clear" @search="search"/>
		</view>

		<!-- 书籍信息 -->
		<view v-if="book.book_id>0" class='book base-padding row mgb-30'>
			<view class='book-cover col-3'>
				<navigator :url='"/pages/intro/intro?id="+book.book_id' class=''>
					<image mode='widthFix' class='cover box-shadow' :src='book.cover'></image>
				</navigator>
			</view>
			<navigator :url='"/pages/intro/intro?id="+book.book_id' class='book-info col-9'>
				<view class='book-title font-lv1 ellipsis-1row'>{{book.book_name}}</view>
				<view v-if="book.is_read == 1" class='mgt-15'>
					<text class='font-lv3 color-grey'>{{book.cnt_doc}} 章节</text>
				</view>
				<view class='mgt-30'>
					<view :class='"score score-"+book.score+" pull-left"'>
						<text>{{book.score_float}} 分</text>
						<text v-if="book.is_read != 1" class='pull-right'>{{book.cnt_readed}} / {{book.cnt_doc}} 章节</text>
					</view>
				</view>
				<view v-if="book.is_read != 1" class='progress mgt-30'>
					<view class='font-lv3 color-grey'>阅读进度
						<view class='pull-right'>{{book.percent}}%
							<text v-if="!token">(未登录)</text>
						</view>
					</view>
					<progress class='mgt-15' :percent="book.percent" />
				</view>
			</navigator>
		</view>

		<!-- 书籍目录 -->
		<view class='row menu-list'>
			<block v-if="result.length>0">
				<menu-tree @itemClick="itemClick" class='result' :menu="result" :pid="0" />
			</block>
			<block v-else>
				<menu-tree @itemClick="itemClick" :currentDocId="currentDocId" :menu="menu" :pid="pid" />
			</block>
		</view>
	</view>
</template>

<script>
	import search from '@/components/search.vue'
	import menuTree from '@/components/menuTree.vue'
	
	export default {
		name: 'imenu',
		data() {
			return {

			};
		},
		components:{
			search,
			menuTree,
		},
		props: {
			book: {
				type: Object,
			},
			menu: {
				type: Array,
				value: []
			},
			wd: {
				type: String
			},
			result: {
				type: Array,
				value: []
			},
			currentDocId: {
				type: Number,
				value: 0,
			},
			token: {
				type: String
			},
			pid: {
				type: Number,
				value: 0
			}
		},
		methods: {
			tabClick: function(e) {
				if (e.target.dataset.tab != this.data.activeTab) {
					this.$emit('tabClick', e.target.dataset)
				}
			},
			delBookmark: function(e) {
				this.$emit('delBookmark', e.target.dateset)
			},
			search: function(e) {
				this.$emit('search', e)
			},
			itemClick: function(e) {
				this.$emit('itemClick', e)
			},
			clear: function() {
				this.$emit('clear')
			}
		}
	}
</script>

<style scoped>
	.book {
		border-bottom: 1px solid #efefef;
		padding-bottom: 30upx;
	}

	.book navigator image {
		width: 170upx;
		height: 223.5upx;
	}

	.book navigator image.cover {
		max-width: 100%;
		max-height: auto;
	}

	.book-title {
		white-space: nowrap;
		padding-top: 7upx;
	}

	.book-info {
		box-sizing: border-box;
		padding-left: 30upx;
	}
	@media (min-width: 768px) {
		.mgt-30{
			margin-top: 15upx;
		}
		.book navigator image {
			width: 94px;
			height: 123px;
		}
	}
</style>
