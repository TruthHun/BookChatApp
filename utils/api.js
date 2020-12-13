import config from '../config.js'
import util from "./util.js"

const keyCategories = 'categories';
const keyCacheExpire = 'categories-expire';
const expire = 1800; // 1800 seconds

// 获取书籍分类
const getCategories = () => {
  if (config.debug) console.log(config.api.categories);
  // 从缓存中读取，判断缓存存不存在，并且有没有过期
  return new Promise((resolve, reject) => {
    let categories = {};
    let now = util.now();
    let value
    let cacheExpire = parseInt(uni.getStorageSync(keyCacheExpire))
    if (cacheExpire > now) {
      try {
        value = uni.getStorageSync(keyCategories)
        if (value) value = JSON.parse(value)
      } catch (e) {
        console.log(e)
      }
    }

    if (value) {
      if (config.debug) console.log("从缓存中获取分类数据");
      resolve(value);
    } else {
      if (config.debug) console.log("从接口获取数据");
      util.request(config.api.categories).then(function(res) {
        let tree = util.menuToTree(res.data.categories)
        uni.setStorageSync(keyCategories, JSON.stringify(tree))
        uni.setStorageSync(keyCacheExpire, now + expire)
        resolve(tree)
      }).catch(function(e) {
        reject(e)
      })
    }
  });
}

const getCategoryByCid = (cid) => {
  return getCategories().then((categories) => {
    let found = false
    let category = {}
    for (let i = 0; found == false && i < categories.length; i++) {
      if (cid == categories[i].id) {
        found = true
        category = categories[i]
      } else if (categories[i].children.length>0){
        let children = categories[i].children
        for (let i = 0; found == false && i < children.length; i++) {
          if (cid == children[i].id) {
            found = true
            category = children[i]
          }
        }
      }
    }
    return category
  })
}


module.exports = {
  getCategories,
  getCategoryByCid,
}