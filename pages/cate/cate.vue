<template>
	<view>
		<iheader title="分类" :showIcon="false" :showSearch="true"></iheader>
		<view class='base-padding mgt-30'>
			<block v-for="category in categories" :key='category.id'>
				<view class='panel' v-if="category.cnt >0 && category.status">
					<view class='panel-heading'>
						<view class='font-lv1 strong'>{{category.title}}</view>
					</view>
					<view class='row'>
						<block v-for="child in category.children" :key='child.id'>
							<navigator :url="'/pages/list/list?cid='+child.id" class='col-6 item' v-if="child.cnt>0 && child.pid==category.id && child.status">
								<view class='row'>
									<view class='col-4'>
										<image :lazy-load='true' v-if="child.icon" class='img-responsive' :src='child.icon'></image>
										<image v-else class='img-responsive' src='/static/images/cate-default.png'></image>
									</view>
									<view class='col-8'>
										<view class='ellipsis-1row font-lv2'>{{child.title}}</view>
										<view class='text-muted font-lv3'>{{child.cnt}} 本</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util.js'
	import api from '../../utils/api.js'
	import config from '../../config.js'
	
	import iheader from '../../components/header.vue'
	
	export default {
		components: {
			iheader
		},
		data() {
			return {
				categories: []
			}
		},
		onLoad() {
			util.loading()
			api.getCategories().then((categories) => {
				if (config.debug) console.log('api.getCategories: ', categories);
				this.categories = categories
			}).catch((e) => {
				console.log(e)
			}).finally(function() {
				uni.hideLoading()
			})
		},
	}
</script>

<style>
	.item {
		margin-bottom: 30upx;
	}

	.item>.row {
		border: 1px solid #efefef;
		border-radius: 6upx;
		box-sizing: border-box;
		padding: 15upx;
		padding-bottom: 6upx;
	}

	.item:nth-of-type(2n)>.row {
		margin-left: 15upx;
	}

	.item:nth-of-type(2n+1)>.row {
		margin-right: 15upx;
	}

	.img-responsive {
		border-radius: 6upx;
		border: 1px solid #efefef;
		max-width: 100upx;
		height: 100upx;
	}

	.img-responsive image {
		width: 100upx;
		height: 100upx;
	}

	.item>.row .col-8 {
		padding-left: 15upx;
		box-sizing: border-box;
	}

	.text-muted {
		margin-top: 10upx;
	}
	@media (min-width: 768px) {
		.img-responsive {
			border-radius: 5px;
			max-width: 80px;
			max-height: 80px;
		}
		
		.img-responsive image {
			max-width: 80px;
			max-height: 80px;
		}
	}
</style>
