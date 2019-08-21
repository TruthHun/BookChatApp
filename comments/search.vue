<template>
	<form class='search'>
	  <input 
		  :focus='focus'
		  :value='wd' 
		  :placeholder='placeholder'
		  @input="changeValue"
		  @confirm="search"
		  name='wd' 
		  type='text'
	   />
	  <image bindtap='clear' v-if='showClear' class='clear' src='../static/images/clear.png'></image>
	  <image bindtap='formSubmit' src='../static/images/search.png'></image>
	</form>
</template>

<script>
	export default{
		name:"search",
		data: {
			showClear: false
		},
		props:{
			focus:{
				type: Boolean,
				default: false
			},
			wd: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: 'Search...'
			}
		},
		methods:{
			
		}
	}
</script>

<style>
</style>
