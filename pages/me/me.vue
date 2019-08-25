<template>
	<view class="page">
		<view class='base-padding row' @click='userLoginEvent'>
		  <view class='user'>
		    <image :src='user.avatar'></image>
		    <view class='username font-lv2'>{{user.nickname}}</view>
		    <view class='color-grey font-lv3'>{{user.intro}}</view>
		  </view>
		</view>
		<view class='base-padding row base-info'>
		  <navigator url='/pages/search/search' class='col-12'>
		    <image src='../../static/images/search.png'></image>
		    <text>书籍搜索</text>
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		</view>
		<view class='base-padding row base-info'>
		  <navigator :url="user.uid>0 ? '/pages/ucenter/ucenter?tab=release':'/pages/login/login'" class='col-12'>
		    <image src='../../static/images/book.png'></image>
		    我的发布
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		  <navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=star":"/pages/login/login"' class='col-12'>
		    <image src='../../static/images/star.png'></image>
		    我的收藏
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		  <navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=follow":"/pages/login/login"' class='col-12'>
		    <image src='../../static/images/follow.png'></image>
		    我的关注
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		  <navigator :url='user.uid>0?"/pages/ucenter/ucenter?tab=fans":"/pages/login/login"' class='col-12'>
		    <image src='../../static/images/fans.png'></image>
		    我的粉丝
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		</view>
		
		<view class='base-padding row base-info'>
		  <navigator :url='"/pages/read/read?identify="+about' class='col-12'>
		    <image src='../../static/images/about-us.png'></image>
		    关于我们
		    <image class='pull-right' src='../../static/images/right-angle.png'></image>
		  </navigator>
		</view>
		
		<view class='base-padding row base-info'>
		  <view v-if="user.uid>0" @click='logout' class='col-12'>
		    <image src='../../static/images/login.png'></image>
		    退出登录
		    <image class='pull-right' src='/static/images/right-angle.png'></image>
		  </view>
		</view>
		
		<view class='base-padding row base-info'>
		  <view class='col-12 text-center'>
		    <view>
		      <text class='font-lv4 color-grey'>Copyright © 2018-{{now}} BookStack.CN</text>
		    </view>
		    <view>
		      <text class='font-lv4 color-grey'>License：Apache 2.0</text>
		    </view>
		    <view>
		      <text class='font-lv4 color-grey'>Author：TruthHun</text>
		    </view>
		    <view>
		      <text class='font-lv4 color-grey'>Version：3.0</text>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	import util from '../../utils/util.js'
	
	export default {
		data() {
			return {
				user: {},
				now: new Date().getFullYear(),
				about: config.about,
				redirect: encodeURIComponent('/pages/me/me')
			}
		},
		onLoad(op) {
			if(config.debug) console.log("onLoad", op)
			if(op.redirect) this.redirect = op.redirect
			this.initUser()
		},
		methods: {
			initUser: function() {
			    let that = this
			    let user = util.getUser()
			    if (user == undefined || user.token == undefined || user.uid <= 0) {
			      user = {
			        'uid': 0,
			        'nickname': '游客，请戳我登录',
			        'avatar': '../../static/images/logo.png',
			        'intro': '分享知识，共享智慧；知识，因分享，传承久远'
			      }
			    }
			    that.user = user
			},
			logout: function(e) {
			    let that = this
			    uni.showModal({
			      title: '温馨提示',
			      content: '您确定要退出登录吗？',
			      success(res) {
			        if (res.confirm) {
			          util.request(config.api.logout) // 只需调用，不需要处理返回结果
			          util.clearUser()
			          util.toastSuccess('退出成功')
			          that.initUser()
			        }
			      }
			    })
			},
			userLoginEvent: function(e) {
			    if (config.debug) console.log("userLoginEvent", e)
			    if (this.user.uid == 0) {
					util.redirect('/pages/login/login?redirect='+this.redirect)
			    }
			},
		}
	}
</script>

<style>
page,.page {
  background-color: #f6f6f6;
}

.row {
  background-color: #fff;
  margin-bottom: 10upx;
  padding: 30upx;
}

.row:last-of-type {
  margin-bottom: 0upx;
}

.user {
  text-align: center;
  display: block;
  width: 100%;
}

.user .text-muted {
  text-align: center;
}

.username {
  margin: 15upx auto;
}

.user image {
  width: 180upx;
  height: 180upx;
  border-radius: 90upx;
  border: 1px solid #ddd;
  margin: 0 auto;
  display: block;
}

.base-info image {
  height: 40upx;
  width: 40upx;
  position: relative;
  top: 8upx;
  margin-right: 30upx;
}

.base-info image.pull-right {
  margin-right: 0upx;
}

.base-info {
  padding-top: 0upx;
  padding-bottom: 0upx;
}

.base-info .col-12 {
  border-bottom: 1px solid #f6f6f6;
  padding-bottom: 30upx;
  padding-top: 30upx;
  color: #666;
  font-size: 34upx;
}

.base-info .col-12:last-of-type {
  margin-bottom: 0upx;
}
</style>
