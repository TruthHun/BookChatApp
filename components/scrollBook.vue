<template>
	<scroll-view scroll-x>
	  <view class='hor' :style="'width:'+width">
		<block v-for="book in books" :key='book.book_id'>
		  <navigator :url="'/pages/intro/intro?id='+ book.book_id">
			<image class='box-shadow cover' :src='book.cover' />
			<view class='font-lv3 ellipsis-2row mgt-15'>{{book.book_name}}</view>
		  </navigator>
		</block>
	  </view>
	</scroll-view>
</template>

<script>
	export default {
		name: 'scrollBook',
		data() {
			return {
				
			};
		},
		props:{
			books: {
				type: Array,
				default: function(e){
					return []
				}
			},
			width: {
				type: String,
				default: '690upx'
			}
		}
	}
</script>

<style scoped>
.hor {
  display: flex;
  flex-direction: row;
}

.hor navigator {
  width: 170upx;
  margin: 3upx 15upx;
}

.hor navigator:first-of-type {
  margin-left: 3upx;
}

.hor navigator image {
  width: 170upx;
  height: 223.4upx;
}
@media (min-width:768px) {
	.ellipsis-2row{
		line-height: 200%;
	}
}
</style>
