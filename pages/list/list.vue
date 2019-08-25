<template>
	<view>
		<view class="mgt-30upx">
			<tab :tabGridLen="gridLen" :activeTab="activeTab" :tabs="tabs" :showSearch="true" />
		</view>
	</view>
</template>

<script>
	import tab from '../../components/tab.vue'
	
	import config from '../../config.js'
	import util from '../../utils/util.js'
	export default {
		data() {
			return {
				gridLen: 8,
				activeTab: 'new',
				activeTitle: '最新',
				tabs: [{
				  title: '热门',
				  value: 'popular'
				}, {
				  title: '最新',
				  value: 'new'
				}, {
				  title: '推荐',
				  value: 'recommend'
				}],
				
			}
		},
		components:{
			tab
		},
		onLoad(op) {
			let cid = op.cid;
			if(config.debug) {
				console.log(op)
				if (!op.cid) cid = 108
			}
			if (!cid) {
				util.redirect('/pages/notfound/notfound')
			}
			uni.setNavigationBarTitle({
				title: this.activeTitle
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
