const keyUser = 'user'
const keyMenu = 'menu'
const keyReaderSetting = 'reader-setting'
const keySysInfo = 'sys-info'
const keySign = 'sign'

const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const timestampToDate = (timestamp) => {
	let date = new Date(timestamp * 1000)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const now = () => {
	return parseInt(new Date().getTime() / 1000)
}

const toTimestamp = t => {
	return parseInt(new Date(t).getTime() / 1000)
}

const relativeTime = t => {

	let timestamp = toTimestamp(t)
	let n = now()
	let diff = n - timestamp
	let minute = 60;
	let hour = minute * 60;
	let day = hour * 24;
	let month = day * 30;

	let monthC = diff / month;
	let dayC = diff / day;
	let hourC = diff / hour;
	let minC = diff / minute;

	if (monthC > 12) {
		return parseInt(monthC / 12) + " 年前";
	} else if (monthC >= 1) {
		return parseInt(monthC) + " 月前";
	} else if (dayC >= 1) {
		return parseInt(dayC) + " 天前";
	} else if (hourC >= 1) {
		return parseInt(hourC) + " 小时前";
	} else if (minC >= 1) {
		return parseInt(minC) + " 分钟前";
	}
	return '刚刚';
}

const clearUser = () => {
	uni.setStorageSync(keyUser, '{}')
}

const setUser = (user) => {
	uni.setStorageSync(keyUser, JSON.stringify(user))
}

const getUser = () => {
	try {
		var value = uni.getStorageSync(keyUser)
		if (value) {
			return JSON.parse(value)
		}
	} catch (e) {
		// Do something when catch error
		console.log(e)
		return {}
	}
}

const getToken = () => {
	let user = getUser()
	if (user && user.token != undefined) {
		return user.token
	}
	return ""
}


//添加事件结束
Promise.prototype.finally = function(callback) {
	var Promise = this.constructor;
	return this.then(
		function(value) {
			Promise.resolve(callback()).then(
				function() {
					return value;
				}
			);
		},
		function(reason) {
			Promise.resolve(callback()).then(
				function() {
					throw reason;
				}
			);
		}
	);
}

// 只有请求结果返回 200 的时候，才会resolve，否则reject
const request = (api, params = {}, method = "GET", header = {}) => {
	return new Promise(function(resolve, reject) {
		if (!header["content-type"]) {
			header["content-type"] = "application/json"
		}

		if (method.toUpperCase() == 'POST') header["content-type"] = "application/x-www-form-urlencoded"

		let token = getToken()
		if (token) header['authorization'] = token

		uni.request({
			url: api,
			data: params,
			method: method,
			header: header,
			success: function(res) {
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(err)
			}
		})
	});
}

const loading = (title) => {
	title = title ? title : '玩命加载中...'
	uni.showLoading({
		title: title,
		mask: true,
	})
}

const toastError = (content) => {
	uni.showToast({
		title: content,
		icon: 'none',
		duration: 3000
	})
}

const toastSuccess = (content) => {
	uni.showToast({
		title: content,
	})
}

const fixView = (view) => {
	if (view > 10000) {
		view = (view / 10000).toFixed(1) + "w"
	} else if (view > 1000) {
		view = (view / 1000).toFixed(1) + "k"
	}
	return view
}


function isEmail(email) {
	let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
	return pattern.test(email);
}

const _findChildren = (menu, pid) => {
	let children = []
	let left = []
	for (let i = 0; i < menu.length; i++) {
		if (menu[i].pid == pid) {
			children.push(menu[i])
		} else {
			left.push(menu[i])
		}
	}
	return left, children
}

const menuToTree = (menu) => {
	// 来自这篇博客，谢谢: https://blog.csdn.net/u013373006/article/details/82108873
	menu.forEach(function(item) {
		delete item.children;
	});
	var map = {};
	menu.forEach(function(item) {
		map[item.id] = item;
	});
	var val = [];
	menu.forEach(function(item) {
		var parent = map[item.pid];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			val.push(item);
		}
	});
	return val;
}

const menuSortIds = (menuTree) => {
	let docs = []
	for (let i in menuTree) {
		docs.push(menuTree[i].id)
		if (menuTree[i].children) {
			docs = docs.concat(menuSortIds(menuTree[i].children))
		}
	}
	return docs
}

const menuTreeReaded = (menuTree, docId) => {
	for (let i in menuTree) {
		if (menuTree[i].id == docId) {
			menuTree[i].readed = true
			break
		}
		if (menuTree[i].children) {
			menuTree[i].children = menuTreeReaded(menuTree[i].children, docId)
		}
	}
	return menuTree
}

const setReaderSetting = (obj) => {
	uni.setStorageSync(keyReaderSetting, JSON.stringify(obj))
}

const getReaderSetting = () => {
	let val = uni.getStorageSync(keyReaderSetting)
	if (!val) {
		return {
			themeIndex: 0,
			fontIndex: 0
		}
	}
	val = JSON.parse(val)
	if (val.themeIndex == undefined) val.themeIndex = 0
	if (val.fontIndex == undefined) val.fontIndex = 0
	return val
}

const setSysInfo = (obj) => {
	uni.setStorageSync(keySysInfo, JSON.stringify(obj))
}

const formatReading = (seconds) => {
	let reading = {
		hour: 0,
		min: 0,
	}
	let hour = 3600
	if (seconds <= 0) {
		return reading
	}
	reading.hour = parseInt(seconds / hour)
	reading.min = parseInt((seconds - (hour * reading.hour)) / 60)
	return reading
}

const getSysInfo = () => {
	let val = uni.getStorageSync(keySysInfo)
	if (!val) {
		return {
			windowWidth: 0,
			windowHeight: 0,
			baseWidth: 0,
			baseHeight: 0,
		}
	}
	return JSON.parse(val)
}

const setSignedAt = (timestamp) => {
	// timestamp = 0 表示重置签到时间
	if (timestamp == 0 || timestamp > getSignedAt()) uni.setStorageSync(keySign, timestamp)
}

const getSignedAt = () => {
	let signedAt = uni.getStorageSync(keySign) || 0
	return parseInt(signedAt)
}

const isSignedToday = () => {
	return timestampToDate(now()) == timestampToDate(getSignedAt())
}


module.exports = {
	formatTime,
	now,
	toTimestamp,
	relativeTime,
	request,
	loading,
	toastError,
	toastSuccess,
	setUser,
	clearUser,
	getUser,
	getToken,
	menuToTree,
	menuSortIds,
	menuTreeReaded,
	setReaderSetting,
	getReaderSetting,
	isEmail,
	getSysInfo,
	setSysInfo,
	fixView,
	formatReading,
	setSignedAt,
	getSignedAt,
	isSignedToday,
}
