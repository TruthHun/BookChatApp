<script>
	import config from 'config.js'
	import util from 'utils/util.js'

	export default {
		globalData: {
			bookshelfChanged: false
		},
		onLaunch: function() {
			let info = uni.getSystemInfoSync()
			if (config.debug) console.log(info)
			util.setSysInfo(info)
		},
		onShow: function() {
			if(config.debug) console.log('App Show')
		},
		onHide: function() {
			if(config.debug) console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("static/css/bookchat.css");
</style>
