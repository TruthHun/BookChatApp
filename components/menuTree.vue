<template>
	<view>
		<view v-for="(item, index) in menu" :key="index" class='ul menu-tree font-lv3 color-semi'>
			<view class="li">
				<view :class="['navigator', item.readed ? 'readed':'', currentDocId == item.id ? 'color-active':'']" @click.stop='itemClick'
				 :data-identify='item.book_id+"/"+item.id'>
					<text>{{item.title}}</text>
				</view>
				<block v-if="item.children">
					<menu-tree @itemClick="menuClick" :currentDocId="currentDocId" :menu="item.children" />
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import menuTree from '@/components/menuTree.vue'
	export default {
		name: 'menuTree',
		data() {
			return {

			};
		},
		components: {
			menuTree
		},
		props: {
			menu: {
				type: Array
			},
			pid: {
				type: Number,
				value: 0
			},
			currentDocId: {
				type: Number,
				value: 0,
			}
		},
		methods: {
			itemClick: function(e) {
				this.$emit('itemClick', {
					identify: e.currentTarget.dataset.identify
				})
			},
			menuClick: function(e) {
				this.$emit('itemClick', e)
			}
		}
	}
</script>

<style scoped>
	.ul {
		padding-left: 15px;
		width: 100%;
		box-sizing: border-box;
	}

	.li {
		width: 100%;
		box-sizing: border-box;
	}

	.li .navigator {
		padding-right: 30upx;
		width: 100%;
		box-sizing: border-box;
		padding-left: 22px;
		text-overflow: ellipsis;
		height: 70upx;
		line-height: 70upx;
		cursor: pointer;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.li .navigator.color-active {
		color: #00acff;
	}

	.readed,
	.readed:hover {
		color: #888;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0ElEQVQ4T92SMQtBURiGn49SKPu9d/EPlB/gB9hlMlmk7iDXotQdSDlW2Yx+gNXmT5iVe0w2Bpajq4i6V7dMnPE753163/N+wpdHvtTza4CjW+CSdbAn20f05BG0n4PTBqSElc8j/jWEJAMYP8PhtAapYGjiqEW0g8BbATucqftsx9TSHIrhvIrQxlLz1+beHehuC1LhgyG2GmD8FPq8RKhHiaMj6F4fGIHpAGWQRpw4/g8CTyHi3a1G2I6P8Hqje2OEPZaafdrWZC18IPwB4AbdfTERzxYCSwAAAABJRU5ErkJggg==') no-repeat 0upx center;
	}

	@media (min-width:768px) {
		.li .navigator {
			height: 45px;
			line-height: 45px;
		}
	}
</style>
