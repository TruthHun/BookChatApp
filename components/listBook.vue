<template>
	<view v-if="showBooks.length>0" class='book-list'>
	  <block v-for="book in showBooks" :key='book.book_id'>
	    <view class='row'>
	      <navigator :url="'/pages/intro/intro?id='+book.book_id" class='col-3'>
	        <image lazy-load='true' class='box-shadow cover' :src='book.cover' />
	      </navigator>
	      <navigator :url="'/pages/intro/intro?id='+book.book_id" class='col-9'>
	        <view class='font-lv1 mgb-15upx ellipsis-1row'>{{book.book_name}}</view>
	        <view class='font-lv4 color-light info'>
	          <view class='col'>
	            <image src='../static/images/eye.png'></image>
	            <text>{{book.view}} 阅读</text>
	          </view>
	          <view class="col">
	            <image src='../static/images/document.png'></image>
	            <text>{{book.cnt_doc}} 章节</text>
	          </view>
	          <view class='col'>
	            <image src='../static/images/clock.png'></image>
	            <text>{{book.created_at}}</text>
	          </view>
	        </view>
	        <view class='font-lv3 color-grey ellipsis-2row'>{{book.description ? book.description : book.book_name}}</view>
	      </navigator>
	    </view>
	  </block>
	</view>
</template>

<script>
	import util from '../utils/util.js'
	export default {
		name: 'listBook',
		data() {
			return {
				showBooks: [],
			};
		},
		props:{
			books:{
				type: Array
			}
		},
		created() {
			let books = []
			for (let book of this.books) {
				book['view'] = util.fixView(book.view)
				book['created_at'] = util.relativeTime(book.created_at)
				books.push(book)
			}
			this.showBooks = books
		}
	}
</script>

<style>
.book-list .col-9 {
  box-sizing: border-box;
  padding-left: 30upx;
}

.book-list .row {
  margin-bottom: 30upx;
  padding-bottom: 30upx;
  border-bottom: 1px solid #efefef;
  display: flex;
}

.book-list .color-grey {
  line-height: 150%;
  text-indent: 2em;
}

.book-list .cover {
  width: 170upx;
  height: 223.5upx;
}

.book-list .info {
  box-sizing: border-box;
  border-bottom: 0 !important;
  display: flex;
  margin: 20upx 0;
}

.book-list .info .col {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-list .info image {
  width: 24upx;
  height: 24upx;
  position: relative;
  top: 4upx;
  margin-right: 6upx;
}

.book-list .icon {
  width: 64upx;
  height: 64upx;
  margin: 0 auto;
  display: block;
}

.book-list .row:last-of-type {
  border-bottom: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
