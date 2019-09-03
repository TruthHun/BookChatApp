<script>
	import config from 'config.js'
	import util from 'utils/util.js'

	export default {
		globalData: {
			bookshelfChanged: false
		},
		onLaunch: function() {
			let info = uni.getSystemInfoSync()
			// 转成 upx，因为两边边距设置为 30upx
			let width = info.windowWidth * info.pixelRatio - 60
			let height = width / config.bannerRatio
			info.bannerWidth = width / info.pixelRatio
			info.bannerHeight = height / info.pixelRatio
			if (config.debug) console.log(info)
			util.setSysInfo(info)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("static/css/bookchat.css");
</style>
