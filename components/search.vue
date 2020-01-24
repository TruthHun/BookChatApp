<template>
	<view>
		<form class='search' @click="focusSearch">
			<input :focus='focus || clickFocus' :value='searchWd' :placeholder='placeholder' @input="change" @confirm="search" confirm-type="search"
			 name='wd' />
			<image @click.stop='clear' v-if='showClear' class='clear' src='/static/images/clear.png'></image>
			<image @click.stop='search' src='/static/images/search.png'></image>
		</form>
	</view>
</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				showClear: false,
				searchWd: '',
				clickFocus: false,
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
			init() {
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
				if (this.target) {
					uni.navigateTo({
						url: this.target + "?wd=" + this.searchWd
					})
				} else {
					this.$emit('search', {
						wd: this.searchWd
					})
				}
			},
			focusSearch(){
				this.clickFocus=true
			}
		},
		watch: {
			wd: function() {
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
		border-radius: 5px;
		padding-right: 70px;
		padding-top: 8px;
		padding-left: 15px;
		padding-bottom: 8px;
		height: 40px;
		box-sizing: border-box;
	}

	form input {
		height: 24px;
		line-height: 24px;
		font-size: 15px;
		min-height: 24px;
	}


	form image {
		margin: 0;
		position: absolute;
		top: 0;
		right: 0;
		box-sizing: border-box;
		height: 40px;
		width: 40px;
		padding: 8px 8px;
		z-index: 99;
	}

	form image.clear {
		right: 35px;
		z-index: 88;
	}

	@media (min-width: 768px) {
		form {
			height: 50px;
			border-radius: 5px;
			padding-right: 70px;
			padding-top: 10px;
			padding-bottom: 10px;
			padding-left: 15px;
			box-sizing: border-box;
		}

		form input {
			font-size: 17px;
			height: 30px;
			line-height: 30px;
			min-height: 30px;
		}


		form image {
			height: 50px;
			width: 50px;
			padding: 10px 10px;
		}

		form image.clear {
			right: 35px;
		}
	}
</style>
