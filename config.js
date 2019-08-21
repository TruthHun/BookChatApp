// api host，最后不要带斜杠。后端程序是BookStack (https://github.com/truthhun/BookStack)
// let host = 'http://localhost:8181/bookchat'
let host = 'https://www.bookstack.cn/bookchat'

// 是否是调试模式。如果是生产环境，请设置为false
const debug = false

// 横幅图片比例，宽高比，小数或者比例(后期从后端接口获取)
const bannerRatio = 825/315

// "关于我们"的文档标识
const about = 'help/bookchat'

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
  userRelease: `${host}/api/v1/user/release`,
  userFans: `${host}/api/v1/user/fans`,
  userFollow: `${host}/api/v1/user/follow`,
  bookshelf: `${host}/api/v1/user/bookshelf`,
  bookStar: `${host}/api/v1/book/star`,
  comment: `${host}/api/v1/book/comment`,
  bookRelated: `${host}/api/v1/book/related`,
  changeAvatar: `${host}/api/v1/user/change-avatar`,
  changePassword: `${host}/api/v1/user/change-password`
}

module.exports = {
  api,
  debug,
  bannerRatio,
  about,
  bannerAdUnitId,
}
