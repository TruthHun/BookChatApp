## BookChatApp v1.5.0
- [x] 增加显示最近阅读的书籍
- [x] 移除书架书籍引起的书架空白问题的bug
- [x] 使用`ActionSheet`组件优化书架书籍管理方式
- [x] 增加类似通讯录的分类布局。（[修改配置方式](https://gitee.com/truthhun/BookChatApp/blob/master/pages/cate/cate.vue#L76)）
- [x] 修复 Android内容阅读亮度调节跳转系统设置的问题(APP请求的手机权限不足的问题造成)（[#I1DMRB](https://gitee.com/truthhun/BookChatApp/issues/I1DMRB)）
- [x] 书架收藏的书籍分类太多时，部分机型会出现分类换行显示，导致下边显示的书籍封面被盖住（[#I1DMRC](https://gitee.com/truthhun/BookChatApp/issues/I1DMRC)）

## BookChatApp v1.4.0

- [x] 增加本月累计签到和上月累计签到等榜单
- [x] 增加分享功能

> 本次版本，使用 HBuilderX 2.6.5 进行开发，推荐版本跟进

## BookChatApp v1.3.0
- [x] 书籍介绍页面显示书籍标签，以便用户快捷搜索
- [x] 用户退出后，更新书架内容
- [x] 解决类似`mgt-30upx`等class样式不生效的问题，将此类class名更换为`mgt-30`
- [x] 封面样式调整
- [x] `iOS`由 `UIWebView`更换为`WKWebView`
- [x] Fix: 内容阅读设置，恢复默认值时，屏幕亮度没有跟着恢复的问题
- [x] 自定义header，增加`home`键和`搜索按钮`
- [x] 用户个人中心，显示个人相关阅读时长等数据
- [x] 收藏到书架的书籍，点击的时候直接跳转到书籍内容阅读页
- [x] APP签到功能
- [x] 榜单功能显示
- [x] 书籍列表、分类列表增加懒加载功能（之前懒加载使用方式没使用正确）
- [x] 使用`localstorage`的方式存储`app.globalData`，以避免`h5`下的其他问题 

> **注意事项**: 不要使用 `v3` 模式进行编译，不然阅读页面的内容会渲染不出来

## BookChatApp v1.2.0
- [x] 平板适配页面
	- [x] 目录页            /pages/menu/menu
	- [x] 书籍阅读页         /pages/read/read
	- [x] 用户中心页         /pages/ucenter/ucenter
	- [x] 首页              /pages/index/index
	- [x] 分类页            /pages/cate/cate
	- [x] 书架页            /pages/bookshelf/bookshelf
	- [x] 列表页            /pages/list/list
	- [x] 个人主页          /pages/me/me
	- [x] 书签页            /pages/bookmarks/bookmarks
	- [x] 搜索结果页         /pages/search/search
	- [x] 内容点评页         /pages/comment/comment
	- [x] 404页            /pages/notfound/notfound
	- [x] 登录页            /pages/login/login
	- [x] 注册页            /pages/register/register
	- [x] 书籍介绍页         /pages/intro/intro
- [x] 平板适配微调
	- [x] `tab` 内边距太大
	- [x] 书架中书籍名称行高太大
	- [x] 搜索输入框优化
- [x] 内容阅读页面代码块显示优化
- [x] Banner 等HTTP链接允许外部打开
- [x] APP版本升级提示（仅针对Android，iOS有App Store，不需要升级提示） 
- [x] 书架，长按可以将书籍从书架中移除