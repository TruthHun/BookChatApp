[TOC]

# BookChat

BookChat uniapp 版

## 页面功能

- [x] 目录页 menu
- [x] 书籍阅读页 read
- [x] 用户中心页 ucenter
- [x] 首页 index
- [x] 分类页 cate
- [x] 书架页 bookshelf(`待验证`)
- [x] 列表页 list
- [x] 个人主页 me(`待验证`)
- [x] 书签页 bookmarks(删除，`待验证`)
- [x] 搜索结果页 search(`待验证`)
- [x] 内容点评页 comment(左上角返回有问题，`待验证`)
- [x] 404页 notfound
- [x] 登录页 login(`待验证`)
- [x] 注册页 register(`待验证`)
- [x] 书籍介绍页 intro(`待验证`)

## 采坑

- rich-text，先自行生成 node 数组
- `unLoad`函数，记得加上`hideLoading`，避免上一个请求回退时
