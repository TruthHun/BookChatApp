[TOC]

# BookChat

BookChat uniapp 版

## 页面功能

- [x] 目录页 menu
- [x] 书籍阅读页 read
- [x] 用户中心页 ucenter
- [x] 首页 index
- [x] 分类页 cate
- [x] 书架页 bookshelf
- [x] 列表页 list
- [x] 个人主页 me
- [x] 书签页 bookmarks
- [x] 搜索结果页 search
- [x] 内容点评页 comment
- [x] 404页 notfound
- [x] 登录页 login
- [x] 注册页 register
- [x] 书籍介绍页 intro




## 采坑

- rich-text 渲染的内容，先后端生成数组
- `unLoad`函数，记得加上`hideLoading`，避免上一个请求未完成用户执行回退操作还在loading
