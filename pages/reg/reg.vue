<template>
	<view>
		<iheader title="注册"></iheader>
		<view class="base-padding mgt-30">
			<form @submit="submit">
				<view class='form-body'>
					<view class='row font-lv2'>
						<view class='col-3'>邮箱</view>
						<view class='col-9'>
							<input name="email" placeholder="请输入邮箱地址" />
						</view>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>用户名</view>
						<view class='col-9'>
							<input name="username" placeholder="请输入用户名" />
						</view>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>用户昵称</view>
						<view class='col-9'>
							<input name="nickname" placeholder="请输入昵称" />
						</view>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>登录密码</view>
						<view class='col-9'>
							<input password name="password" placeholder="请输入密码" />
						</view>
					</view>
					<view class='row font-lv2'>
						<view class='col-3'>确认密码</view>
						<view class='col-9'>
							<input password name="re_password" placeholder="请再次输入密码" />
						</view>
					</view>
				</view>
				<view class='row text-center'>
					<view class='color-grey mgb-30 font-lv3'>以上资料项全为必填项，请认真填写</view>
				</view>
				<view class='row'>
					<button :loading='loading' form-type="submit" class='btn-submit btn-block'> 立即注册 </button>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="row">
					<button @getuserinfo='wechatLogin' :loading='loadingWechat' open-type="getUserInfo" class='btn-auth btn-block'>
						微信登录
					</button>
				</view>
				<!-- #endif -->
				<view class='row'>
					<button class='btn-block btn-login' @click='toLogin'> 马上登录 </button>
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
				redirect: encodeURIComponent('/pages/me/me'),
				loadingWechat: false,
			}
		},
		onLoad(op) {
			if (config.debug) console.log('onLoad', op)
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
			submit: function(e) {
				if (config.debug) console.log("submit", e)

				let that = this

				if (that.loading) return

				let data = e.detail.value

				if (!util.isEmail(data.email)) {
					util.toastError('邮箱格式不正确')
					return
				}
				if (data.password != data.re_password) {
					util.toastError('两次输入的密码不一致，请重新输入')
					return
				}

				if (data.username == '' || data.nickname == '' || data.password == '' || data.re_password == '') {
					util.toastError('以上资料项均为必填项，请认真填写')
					return
				}

				that.loading = true

				util.request(config.api.register, data, 'POST').then(function(res) {
					if (config.debug) console.log(config.api.register, res)
					util.setUser(res.data.user)
					uni.showToast({
						title: '注册成功',
					})
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
				}).catch(function(e) {
					if (config.debug) console.log(config.api.register, e)
					util.toastError(e.data.message || e.errMsg)
				}).finally(function() {
					that.loading = false
				})
			},
			toLogin: function() {
				uni.navigateTo({
					url: '/pages/login/login?redirect=' + this.redirect
				})
			},
			wechatLogin: function(e) {
				let that = this
				let weUser = e.detail
			
				if (that.loadingWechat) return
				that.loadingWechat = true
			
				uni.login({
					success(res) {
						if (config.debug) console.log("微信登录", res, weUser)
						if (res.code) {
							util.request(config.api.loginByWechat, {
								code: res.code,
								userInfo: weUser.rawData,
							}, 'POST').then(function(res) { // 登录成功
								let user = res.data.user
								if (user == undefined || user.uid <= 0 || user.token == '') {
									util.toastError('登录失败：未知错误')
									that.loadingWechat = false
									return
								}
								util.setUser(user)
								util.toastSuccess('登录成功')
								setTimeout(function() {
									util.redirect(decodeURIComponent(that.redirect))
								}, 1500)
							}).catch(function(e) { // 如果是 401，则跳转到信息绑定页面，否则直接提示相关错误信息
								if (config.debug) console.log(e)
								if (e.statusCode == 401) {
									util.setWeChatUser(weUser)
									uni.navigateTo({
										url: '/pages/bind/bind?redirect=' + that.redirect + "&sess=" + encodeURIComponent(e.data.data.sess),
									})
								} else {
									util.toastError(e.data.message || e.errMsg)
								}
								that.loadingWechat = false
							})
						} else {
							util.toastError('登录失败！' + res.errMsg)
						}
					},
					fail: function(e) {
						util.toastError(e.errMsg)
					}
				})
			}
		}
	}
</script>

<style scoped>
	@import url("../../static/css/reg-login.css");
</style>
