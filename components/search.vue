<template>
	<form class='search'>
		<input :focus='focus' :value='searchWd' :placeholder='placeholder' @input="change" @confirm="search" name='wd' type='text' />
		<image @click='clear' v-if='showClear' class='clear' src='/static/images/clear.png'></image>
		<image @click='search' src='/static/images/search.png'></image>
	</form>
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
				console.log(e)
				this.showClear = false
				this.searchWd = ''
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

<style>
	form {
		margin-top: 30upx;
		position: relative;
		display: block;
	}

	form input {
		box-sizing: border-box;
		width: 100%;
		background-color: #f8f8f8;
		line-height: 90upx;
		height: 90upx;
		display: block;
		font-size: 16px;
		border-radius: 10upx;
		text-align: left;
		padding: 0 130upx 0 26upx;
	}


	form image {
		position: absolute;
		top: 0upx;
		right: 0upx;
		box-sizing: border-box;
		height: 90upx;
		width: 90upx;
		padding: 20upx;
		z-index: 99;
	}

	form image.clear {
		right: 60upx;
		z-index: 88;
	}
</style>
