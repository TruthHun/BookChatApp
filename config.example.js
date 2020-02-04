// api host，最后不要带斜杠。后端程序是BookStack (https://github.com/truthhun/BookStack)
let host = 'http://localhost:8181/bookchat'

// 是否是调试模式。如果是生产环境，请设置为false
const debug = true

// 程序信息，置空则不显示
const info = {
	about: 'help/about', // "关于我们"的文档标识
	version: 'v1.3.2',
	copyright: 'BookStack.CN',
	license: 'Apache 2.0',
	author: 'TruthHun',
}

const api = {
	banners: `${host}/api/v1/banners`,
	register: `${host}/api/v1/register`,
	login: `${host}/api/v1/login`,
	loginByWechat: `${host}/api/v1/login-by-wechat`,
	loginBindWechat: `${host}/api/v1/login-bind-wechat`,
	loginedBindWechat: `${host}/api/v1/login-bind-wechat`,
	logout: `${host}/api/v1/logout`,
	categories: `${host}/api/v1/book/categories`,
	bookLists: `${host}/api/v1/book/lists`,
	bookListsByCids: `${host}/api/v1/book/lists-by-cids`,
	bookInfo: `${host}/api/v1/book/info`,
	bookMenu: `${host}/api/v1/book/menu`,
	bookDownload: `${host}/api/v1/book/download`,
	searchBook: `${host}/api/v1/search/book`,
	searchDoc: `${host}/api/v1/search/doc`,
	bookmark: `${host}/api/v1/book/bookmark`,
	read: `${host}/api/v1/book/read`,
	userInfo: `${host}/api/v1/user/info`,
	userMoreInfo: `${host}/api/v1/user/more-info`,
	userRelease: `${host}/api/v1/user/release`,
	userFans: `${host}/api/v1/user/fans`,
	userFollow: `${host}/api/v1/user/follow`,
	userSign: `${host}/api/v1/user/sign`,
	bookshelf: `${host}/api/v1/user/bookshelf`,
	bookStar: `${host}/api/v1/book/star`,
	comment: `${host}/api/v1/book/comment`,
	bookRelated: `${host}/api/v1/book/related`,
	changeAvatar: `${host}/api/v1/user/change-avatar`,
	changePassword: `${host}/api/v1/user/change-password`,
	lastestVersion: `${host}/api/v1/version`,
	rank: `${host}/api/v1/rank`,
}

module.exports = {
	api,
	debug,
	info,
}
