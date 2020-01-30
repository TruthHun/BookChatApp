<script>
	import config from 'config.js'
	import util from 'utils/util.js'

	export default {
		onLaunch: function() {
			let info = uni.getSystemInfoSync()
			info.versionCode = 0
			info.version = "v1.0.0"
			info.bookshelfChanged = false
			
			if (info.model && info.model.indexOf('iPhone') !== -1) {
				info.titleBarHeight = 44
			} else {
				info.titleBarHeight = 48
			}

			// #ifdef APP-PLUS
			// 查询版本信息
			plus.runtime.getProperty(plus.runtime.appid, function(wgtInfo) {
				info.versionCode = wgtInfo.versionCode
				info.version = wgtInfo.version

				// 如果是Android平台，则检测是否有新版本
				if (String(info.platform).toLowerCase() == "android") {
					if (config.debug) console.log("request version api", config.api.lastestVersion)
					util.request(config.api.lastestVersion).then(function(res) {
						if (config.debug) console.log("latest version:", res)
						if (res && res.data && res.data.version) {
							if (config.debug) console.log("当前版本", info.versionCode, "最新版本", res.data.version)
							if (info.versionCode < res.data.version) {
								uni.showModal({
									title: "温馨提示",
									content: "发现新版本APP，您是否要升级体验？",
									cancelText: "暂时忽略",
									confirmText: "码上升级",
									success: (action) => {
										if (action.confirm) {
											if (config.debug) console.log('用户点击确定');
											plus.runtime.openURL(res.data.url)
										} else if (res.cancel) {
											if (config.debug) console.log('用户点击取消');
										}
									}
								})
							}
						}
					}).catch(function(e) {
						console.log(e)
					})
				}
			});
			// #endif

			if (config.debug) {
				console.log(info)
				console.log('platform', info.platform)
			}
			util.setSysInfo(info)
		},
		onShow: function() {
			if (config.debug) console.log('App Show')
		},
		onHide: function() {
			if (config.debug) console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("static/css/bookchat.css");
</style>
