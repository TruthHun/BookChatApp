<template>
	<view>
		<iheader title="没找到对象"></iheader>
	  <view>
	    <image src='../../static/images/404.png'></image>
	  </view>
	  <text class='font-lv1'>404</text>
	  <text class="font-lv3">确认过眼神，没找到对的人</text>
	  <view class='pdt-60upx text-center go-home' @click='goHome'>
	    <image src='../../static/images/home-selected.png'></image>
	    <text class='color-green font-lv2'>朕要肥家</text>
	  </view>
	</view>
</template>

<script>
	import iheader from '../../components/header.vue'
	export default {
		components: {
			iheader
		},
		data() {
			return {}
		},
		onLoad() {
			uni.hideLoading()
		},
		methods: {
			goHome: function(e) {
				uni.switchTab({
				  url: '/pages/index/index',
				})
			}
		}
	}
</script>

<style scoped>
image{width: 60%;margin:80upx auto;display: block;}
text.font-lv1{font-size: 60upx !important;color: #353535;}
text{display: block;text-align: center;color: #888888;margin: 30upx 0;}
.go-home{color: #353535}
.go-home image{width: 160upx;height: 160upx;margin-bottom: 0;}
</style>
