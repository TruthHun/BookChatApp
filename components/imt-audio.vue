<template>
	<view class="imt-audio">
		<view class="audio-box">
			<view class="audio-poster">
				<view class="audio-control-wrapper" :style="color">
					<view class="audio-control audio-control-switch" :class="{audioLoading:loading}" :style="{borderColor:color}"
					 @click="audio.paused?play():audio.pause()">{{loading?'&#xe600;':(paused?'&#xe865;':'&#xe612;')}}</view>
				</view>
			</view>
			<view class="audio-title">{{title}}</view>
			<view class="audio-wrapper">
				<view class="audio-number">{{format(current)}}</view>
				<slider class="audio-slider" :activeColor="color" block-size="16" :value="current" :max="duration" @changing="seek=true,current=$event.detail.value"
				 @change="audio.seek($event.detail.value)"></slider>
				<view class="audio-number text-right">{{format(duration)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audio: uni.createInnerAudioContext(),
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				paused: true, //是否处于暂停状态
				loading: false, //是否处于读取状态
				seek: false //是否处于拖动状态
			}
		},
		props: {
			title: {
				type: String,
				default: "未知音频"
			}, 
			src: {
				type: String,
				default: ''
			}, 
			autoplay: {
				type: Boolean,
				default: false
			}, 
			continue: {
				type: Boolean,
				default: true
			}, 
			control: {
				type: Boolean,
				default: true
			}, 
			color: {
				type: String,
				default: '#169af3'
			} 
		},
		methods: {
			//返回prev事件
			prev() {
				this.$emit('prev')
			},
			//返回next事件
			next() {
				this.$emit('next')
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//点击播放按钮
			play() {
				this.audio.play()
				this.loading = true
			}
		},
		created() {
			if (this.src) {
				this.audio.src = this.src
				this.autoplay && this.play()
			}
			this.audio.obeyMuteSwitch = false
			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = this.audio.currentTime
				}
				if (!this.duration) {
					this.duration = this.audio.duration
				}
			})
			//音频播放事件
			this.audio.onPlay(() => {
				this.paused = false
				this.loading = false
			})
			//音频暂停事件
			this.audio.onPause(() => {
				this.paused = true
			})
			//音频结束事件
			this.audio.onEnded(() => {
				if (this.continue) {
					this.next()
				} else {
					this.paused = true
					this.current = 0
				}
			})
			//音频完成更改进度事件
			this.audio.onSeeked(() => {
				this.seek = false
			})
		},
		beforeDestroy() {
			this.audio.destroy()
		},
		watch: {
			src(src, old) {
				this.audio.src = src
				this.current = 0
				this.duration = 0
				if (old || this.autoplay) {
					this.play()
				}
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: 'icon';
		src: url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
	}

	.audio-box {
		border: 1px solid rgb(230, 230, 230);
		box-sizing: border-box;
		height: 60px;
		padding-right: 8px;
		border-radius: 3px;
		overflow: hidden;
		margin: 5px 0;
	}

	.audio-poster {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		float: left;
		background-color: rgb(230, 230, 230);
		box-sizing: border-box;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
		margin-top: 5px;
	}

	.audio-number {
		width: 50px;
		font-size: 12px;
		line-height: 1;
		color: #333;
	}

	.audio-slider {
		flex: 1;
		margin: 0;
	}

	.audio-title {
		margin-top: 5px;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.audio-control-wrapper {
		margin-top: 9px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "icon" !important;
	}

	.audio-control {
		font-size: 15px;
		line-height: 1;
		border: 2px solid;
		border-radius: 50%;
		padding: 8px;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.audio-control-switch {
		font-size: 40upx;
		margin: 0 100upx;
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}
</style>
