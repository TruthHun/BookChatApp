<template>
	<view>
		<form class='search'>
			<input :focus='focus' :value='searchWd' :placeholder='placeholder' @input="change" @confirm="search" confirm-type="search" name='wd'/>
			<image @click='clear' v-if='showClear' class='clear' src='/static/images/clear.png'></image>
			<image @click='search' src='/static/images/search.png'></image>
		</form>
	</view>
</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				showClear: false,
				searchWd: ''
			}
		},
		props: {
			focus: {
				type: Boolean
			},
			wd: {
				type: String,
				default: '',
			},
			target: {
				type: String
			},
			placeholder: {
				type: String,
				default: 'Search...'
			}
		},
		created() {
			this.init()
		},
		methods: {
			init(){
				if (this.wd) this.showClear = true
				this.searchWd = this.wd
			},
			clear(e) {
				this.showClear = false
				this.searchWd = ''
				this.$emit('clear')
			},
			change(e) {
				let wd = e.detail.value.trim()
				this.showClear = wd ? true : false
				this.searchWd = wd
			},
			search() {
				if(this.target){
					uni.navigateTo({
						url: this.target +"?wd="+this.searchWd
					})
				}else{
					this.$emit('search', { wd: this.searchWd})
				}
			}
		},
		watch:{
			wd:function(){
				this.init()
			}
		}
	}
</script>

<style scoped>
	form {
		margin-top: 15px;
		position: relative;
		display: block;
		background-color: #f8f8f8;
		border-radius: 10upx;
		padding-right: 140upx;
		padding-top: 15upx;
		padding-left: 30upx;
		padding-bottom: 15upx;
	}

	form input {
		height: 60upx;
		line-height: 60upx;
		font-size: 15px;
	}


	form image {
		margin: 0;
		position: absolute;
		top: 0;
		right: 0;
		box-sizing: border-box;
		height: 90upx;
		width: 90upx;
		padding: 20upx 20upx;
		z-index: 99;
	}

	form image.clear {
		right: 70upx;
		z-index: 88;
	}
	
	@media (min-width: 768px) {
		form {
			border-radius: 5upx;
			padding-right: 70upx;
			padding-top: 10upx;
			padding-bottom: 10upx;
			padding-left: 15upx;
		}
		
		form input {
			height: 30upx;
			line-height: 30upx;
			font-size: 17px;
		}
		
		
		form image {
			height: 50upx;
			width: 50upx;
			padding: 10upx 10upx;
		}
		
		form image.clear {
			right: 35upx;
		}
	}
</style>
