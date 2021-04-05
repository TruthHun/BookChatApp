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
  width: 85px;
  margin: 2px 8px;
}

.hor navigator:first-of-type {
  margin-left: 3upx;
}

.hor navigator image {
  width: 85px;
  height: 112px;
  max-width: 100%;
}
@media (min-width:768px) {
	.ellipsis-2row{
		line-height: 200%;
	}
	.hor navigator {
	  width: 170px;
	  margin: 3px 15px;
	}
	.hor navigator image {
	  width: 170px;
	  height: 223.4px;
	}
}
</style>
