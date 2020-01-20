<template>
	<view class="comment">
		<iheader title="点评"></iheader>
		<form @submit="submit">
			<textarea name="content" class='font-lv3 color-semi' placeholder="您的点评能帮助其他小伙伴了解内容哟" auto-focus />
			<view v-show="false">
				<input type="number" name="score" :value="score" />
				<input type="text" name="identify" :value="identify" />
			</view>
			<view class='comment-score mgt-30'>
		  <text class='font-lv3'>书籍评分</text>
		  <image data-score="1" @click='touchStar' :src='score > 0 ? "../../static/images/star-highlight.png":"../../static/images/star.png"'></image>
		  <image data-score="2" @click='touchStar' :src='score > 1 ? "../../static/images/star-highlight.png":"../../static/images/star.png"'></image>
		  <image data-score="3" @click='touchStar' :src='score > 2 ? "../../static/images/star-highlight.png":"../../static/images/star.png"'></image>
		  <image data-score="4" @click='touchStar' :src='score > 3 ? "../../static/images/star-highlight.png":"../../static/images/star.png"'></image>
		  <image data-score="5" @click='touchStar' :src='score > 4 ? "../../static/images/star-highlight.png":"../../static/images/star.png"'></image>
		  <text class='font-lv3 color-grey'>{{messages[score]}}</text>
		</view>
		<view class='submit'>
		  <text class='font-lv3 color-grey'>文明评论，理性发言.</text>
		  <button form-type="submit" :loading='loading' type="warn" size='mini' class='pull-right btn-submit'> 发表点评 </button>
		</view>
	  </form>
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
				beforeScore: 0,
				score: 0,
				identify: '',
				messages: ['期待您的打分', '惨不忍睹', '太差了', '一般般', '还不错', '非常棒'],
				loading: false
			}
		},
		onLoad(options) {
			if (config.debug) console.log(options)
			
			let score = options.score || 0
			let identify = options.identify || ''
		
			if (!identify) {
			  uni.redirectTo({
				url: '/page/notfound/notfound',
			  })
			  return
			}
			this.identify = identify
			this.beforeScore = score
			this.score = score
		},
		methods: {
			submit(e) {
				
				if (config.debug) console.log("submit", e)
				
			    let that = this
				
				let obj = e.detail.value
				
			    if (that.loading) return
				
			    if (obj.score == 0) {
					util.toastError('忘了打个分？')
					return
			    }
				
			    if (obj.content.length < 5 || obj.content.length > 256) {
			      util.toastError('点评内容需要 5 ~ 256 个字符')
			      return
			    }
			
			    that.loading = true
			
			    util.request(config.api.comment, obj, 'POST').then(function(res) {
			      if (config.debug) console.log(config.api.comment, res)
			      uni.showToast({
			        title: '发表点评成功',
			      })
			      let to = setTimeout(function(){
					clearTimeout(to)
			        uni.navigateBack({
			          delta: 1,
			        })
			      },1000)
			    }).catch(function(e) {
			      util.toastError(e.data.message || e.errMsg)
			    }).finally(function() {
			      that.loading = false
			    })
			},
			touchStar(e) {
			  if (this.beforeScore == 0)  this.score = e.currentTarget.dataset.score
			}
		}
	}
</script>

<style scoped>
textarea {
  padding: 30upx;
  border: 1upx solid #efefef;
  border-left: 0upx;
  border-right: 0upx;
  width: 100%;
  box-sizing: border-box;
  line-height: 150%;
}

.comment-score {
  border-bottom: 1upx solid #efefef;
  padding-bottom: 20upx;
}

.comment-score image {
  display: inline-block;
  width: 36upx;
  height: 36upx;
  margin-left: 30upx;
}

.comment-score text {
  display: inline-block;
  margin-left: 36upx;
  position: relative;
  top: -6upx;
}

.submit {
  padding: 30upx;
  line-height: 1.8;
}

.btn-submit {
  border-radius: 6upx;
  border-color: #e64340;
}
@media (min-width: 768px) {
	.submit text{display: none;}
	.submit button{font-size: 16px;}
}

</style>
