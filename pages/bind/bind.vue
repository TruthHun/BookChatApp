<template>
	<view>
		<iheader title="绑定账号"></iheader>
		<view v-if="show">
			<view class='row avatar'>
				<image :src='avatar' />
			</view>
			<view class='row'>
				<view class='nickname font-lv2 color-semi'>{{nickname}}</view>
			</view>
			<view class="row row-tab font-lv2">
				<view @click='changeTab' :class='["col", bindNew ? "" : "active"]' data-bind="old">绑定已有账号</view>
				<view @click='changeTab' :class='["col", bindNew ? "active" : ""]' data-bind="new">绑定新账号</view>
			</view>
			<view class='row row-form'>
				<form @submit='formSubmit'>
					<view class='form-body'>
						<block v-if="bindNew">
							<view class='row'>
								<view class='col-3'>邮箱</view>
								<view class='col-9'>
									<input name="email" placeholder="请输入邮箱地址" />
								</view>
							</view>
							<view class='row'>
								<view class='col-3'>用户名</view>
								<view class='col-9'>
									<input name="username" placeholder="由字母和数字组成" />
								</view>
							</view>
							<view class='row'>
								<view class='col-3'>用户昵称</view>
								<view class='col-9'>
									<input name="nickname" placeholder="请输入昵称" />
								</view>
							</view>
							<view class='row'>
								<view class='col-3'>登录密码</view>
								<view class='col-9'>
									<input password name="password" placeholder="请输入密码，至少6位" />
								</view>
							</view>
							<view class='row'>
								<view class='col-3'>确认密码</view>
								<view class='col-9'>
									<input password name="re_password" placeholder="请再次输入密码，至少6位" />
								</view>
							</view>
						</block>
						<block v-else>
							<view class='row'>
								<view class='col-3'>账号</view>
								<view class='col-9'>
									<input name="username" placeholder="请输入用户名或邮箱" />
								</view>
							</view>
							<view class='row'>
								<view class='col-3'>密码</view>
								<view class='col-9'>
									<input password name="password" placeholder="请输入密码" />
								</view>
							</view>
						</block>
					</view>
					<view class='row'>
						<button class='btn-submit btn-block' :loading='loading' form-type='submit'> 提交绑定 </button>
					</view>
				</form>
			</view>
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
				bindNew: false,
				loading: false,
				redirect: '',
				sess: '',
				nickname: '',
				show: false,
				title: '绑定账号',
				avatar: '/static/images/logo.png',
			}
		},
		onLoad: function(options) {
			let user = util.getWeChatUser()
			if (config.debug) console.log("wechatUser", user, options)
			if (user == undefined) {
				uni.redirectTo({
					url: '/pages/login/login',
				})
				return
			}
			this.redirect = options.redirect || encodeURIComponent('/pages/me/me')
			this.sess = decodeURIComponent(options.sess) || ''
			this.nickname = user.userInfo.nickName || ''
			this.avatar = user.userInfo.avatarUrl || '/static/images/logo.png'
			this.show = true
		},
		methods: {
			changeTab: function(e) {
				if (config.debug) console.log("changeTab", e)
				this.bindNew = e.currentTarget.dataset.bind == "old" ? false : true
			},
			formSubmit: function(e) {
				if (config.debug) console.log("formSubmit", e);
				if (this.loading) return;
				let that = this
				let user = util.getWeChatUser()
				let form = e.detail.value
				form.sess = that.sess
				that.loading = true
				if (config.debug) console.log("form data", form);
				util.request(config.api.loginBindWechat, form, 'POST').then(function(res) {
					if (config.debug) console.log(config.api.loginBindWechat, res)
					if (res.data && res.data.user) {
						util.setUser(res.data.user)
						util.toastSuccess('登录成功')
						setTimeout(function() {
							util.redirect(decodeURIComponent(that.redirect))
						}, 1500)
					} else {
						util.toastError('数据解析不正确')
					}
				}).catch(function(e) {
					util.toastError(e.message || e.errMsg)
				}).finally(function() {
					that.loading = false
				})
			}
		}
	}
</script>

<style scoped>
	@import url("../../static/css/reg-login.css");

	.row-tab {
		text-align: center;
	}

	.row-tab .col {
		border-bottom: 1px solid #efefef;
		padding: 30upx 0;
	}

	.row-tab .active {
		border-bottom: 1px solid #00acff;
		color: #00acff;
	}

	form {
		padding: 30upx;
		width: 100%;
		box-sizing: border-box;
	}

	.avatar image {
		width: 160upx;
		height: 160upx;
		margin: 30upx auto;
		display: block;
		border: 1px solid #efefef;
		border-radius: 50%;
		padding: 5upx;
		box-sizing: border-box;
	}

	.nickname {
		text-align: center;
		width: 100%;
		margin-bottom: 60upx;
	}
</style>
