<template>
	<view class="loading">
		<view v-if="loading">
			<view class='text-center font-lv3 color-grey pdb-30'>
			  <image src='/static/images/loading.png'></image>
			</view>
		</view>
		<view v-else class='text-center font-lv4 color-grey pdb-30'>{{tips}}</view>
	</view>
</template>

<script>
	export default {
		props:{
			loading: {
				type:Boolean,
				default: true
			},
			tips: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style>
.loading{padding-bottom: 30upx;padding-top:30upx;}
.loading image{width: 32px;height: 32px;}
</style>
