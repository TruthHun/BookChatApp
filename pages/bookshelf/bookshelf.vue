<template>
	<view>
		<view class='row box'>
			<view v-if="showTips && books.length ==0 " class='tips col-12 font-lv2'>
				<view v-if="token">
				  <view>黑夜给了你一双黑色的眼睛</view>
				  <view>你用它去寻找光明...</view>
				  <view>我们给了你一个华丽的书架</view>
				  <view>你却没有一本书籍...</view>
				  <view class='action'>
					<search target="/pages/search/search"/>
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
				  <navigator :url='"/pages/intro/intro?id="+book.book_id' class='book text-muted'>
					<image class='box-shadow cover' :src='book.cover'></image>
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
	
	export default {
		data() {
			return {
			    page: 1,
			    size: 24,
			    books: [],
			    showTips: false,
			    wd: '',	
			}
		},
		components:{
			search,
			loading,
		},
		onPullDownRefresh: function() {
			util.loading()
			this.loadBooks(true)
			uni.hideLoading()
		},
		onShow: function() {
		    if (config.debug) console.log("onShow", "bookshelfChanged", getApp().globalData.bookshelfChanged)
			this.loadBooks(getApp().globalData.bookshelfChanged)
			getApp().globalData.bookshelfChanged = false
		},
		onReachBottom: function() {
		    this.loadBooks()
			uni.stopPullDownRefresh()
		},
		methods: {
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
			      util.toastError(e.data.message || e.errMsg)
			    }).finally(function(){
					that.books = books
					that.showTips = books.length == 0
					that.page = page
					if (isClearAll) uni.pageScrollTo({
					  scrollTop: 0,
					})
				})
			},
			login: function(e) {
			    uni.navigateTo({
			    	url:'/pages/login/login?redirect='+encodeURIComponent('/pages/bookshelf/bookshelf')
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

.progress progress {
  margin-bottom: 15upx;
}

.book image {
  width: 206upx;
  height: 271.6upx;
  margin-bottom: 15upx;
}

.icon{width: 32upx;height: 32upx;}
</style>
