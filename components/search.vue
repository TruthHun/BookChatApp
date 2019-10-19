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
	}

	form input {
		box-sizing: border-box;
		width: 100%;
		background-color: #f8f8f8;
		line-height: 45px;
		height: 45px;
		margin-top: 0;
		display: block;
		font-size: 15px;
		border-radius: 5px;
		text-align: left;
		padding: 0 65px 0 13px;
	}


	form image {
		margin: 0;
		position: absolute;
		top: 0;
		right: 0;
		box-sizing: border-box;
		height: 45px;
		width: 45px;
		padding: 10px;
		z-index: 99;
	}

	form image.clear {
		right: 30px;
		z-index: 88;
	}
</style>
