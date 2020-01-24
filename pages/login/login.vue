<template>
	<view>
		<iheader title="登录"></iheader>
		<view class='base-padding'>
			<form @submit="formSubmit">
				<view class='form-body'>
					<view>
						<image src='/static/images/logo.png'></image>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>账号</view>
						<view class='col-9'>
							<input name="username" auto-focus='true' placeholder="请输入用户名或邮箱" />
						</view>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>密码</view>
						<view class='col-9'>
							<input password name="password" placeholder="请输入密码" />
						</view>
					</view>
				</view>
				<view class='row mgb-30 font-lv3 color-grey'>
					<navigator class='col' :url="'/pages/read/read?identify='+about">关于我们</navigator>
					<view class='col text-right' @click='findPassword'>忘记密码？</view>
				</view>
				<view class='row'>
					<button class='btn-submit btn-block' :loading='loading' form-type='submit'> 码上登录 </button>
				</view>
				<view class='row'>
					<button @click="toReg" class='btn-login btn-block'> 注册账号 </button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'

	import iheader from '../../components/header.vue'

	export default {
		components: {
			iheader
		},
		data() {
			return {
				loading: false,
				about: config.info.about,
				redirect: encodeURIComponent('/pages/me/me'),
			}
		},
		onLoad: function(op) {
			if (config.debug) console.log("onLoad", op)
			if (op.redirect) this.redirect = op.redirect
		},
		onShow: function() {
			let token = util.getToken()
			if (token) {
				let url = decodeURIComponent(this.redirect)
				if (url.indexOf("?") > -1) {
					uni.redirectTo({
						url: url
					})
				} else {
					uni.switchTab({
						url: url
					})
				}
			}
		},
		methods: {
			toReg: function() {
				uni.navigateTo({
					url: '/pages/reg/reg?redirect=' + this.redirect
				})
			},
			findPassword: function(e) {
				uni.showModal({
					title: '温馨提示',
					content: '目前BookChat暂不支持找回密码的功能，如果忘记了密码，请打开书栈网(https://www.bookstack.cn)将密码找回',
				})
			},
			formSubmit: function(e) {
				let that = this

				if (config.debug) console.log("formSubmit", e);
				if (that.loading) return;

				if (e.detail.value.password == '' || e.detail.value.username == '') {
					util.toastError('账号和密码均不能为空')
					return
				}

				that.loading = true

				util.request(config.api.login, e.detail.value, 'POST').then((res) => {
					if (config.debug) console.log(config.api.login, res);
					let user = res.data.user
					if (user == undefined || user.uid <= 0 || user.token == '') {
						util.toastError('登录失败：未知错误')
						that.loading = false
						return
					}
					util.setUser(user)
					util.toastSuccess('登录成功')
					setTimeout(function() {
						let url = decodeURIComponent(that.redirect)
						if (url.indexOf("?") > -1) {
							uni.redirectTo({
								url: url
							})
						} else {
							uni.switchTab({
								url: url
							})
						}
					}, 1500)
				}).catch((e) => {
					if (config.debug) console.log(e);
					that.loading = false
					util.toastError(e.data.message || e.errMsg)
				})
			},
		}
	}
</script>

<style scoped>
	@import url("../../static/css/reg-login.css");

	image {
		width: 180upx;
		height: 180upx;
		border-radius: 90upx;
		border: 1px solid #ddd;
		margin: 15px auto;
		display: block;
	}
</style>
