// import path  from 'path-browserify'

import { join, getAttr, attr2Str } from './utils'
class RetryScript {
	constructor(options) {
		if (Array.isArray(options)) {
			options = {
				hosts: options
			}
		}
		this.handleEvent = this.handleEvent.bind(this)
		this._verifi(options).then(res => {
			this.hosts = options.hosts || []
			this.handler = options.handler
			this.retryTimes = {} // 重试次数

			this._init()
		})
		.catch(err => {
			console.error(err)
		})
		
	}
	_init() {
		this.bindEvent()
	}
	// 校验
	async _verifi (options) {
		if (!Array.isArray(options.hosts)) {
			return Promise.reject('hosts must be Array!')
		}
		return Promise.resolve()
	}
	// 绑定事件
	bindEvent () {
		window.addEventListener('error', this.handleEvent, true)
	}
	unbindEvent () {
		window.removeEventListener('error', this.handleEvent, true)
	}
	handleEvent (event) {
		const target = event.target || event.srcElement
		if (target.tagName.toLowerCase() !== 'script') return false
		const attrs = getAttr(target)
		const src = attrs.src || ''

		const sources = src.split(/\//g)
		const source = sources[sources.length - 1]
		this.retryTimes[source] = this.retryTimes[source] || 0
		if (this.retryTimes[source] >= this.hosts.length) return false
		// 创建新的src
		const newSrc = this._handler({
			currentIndex: this.retryTimes[source], // 当前索引
			source, // 资源
			oldSrc: src, // 旧的src
			join, // 拼接函数
			hosts: this.hosts // 配置的数据源 
		})
		// 获取dom上的属性值
		const attrStr = attr2Str(attrs, ['src']) 
		document.write(`<script ${attrStr} src="${newSrc}"><\/script>`)
	}
	destory () {
		this.unbindEvent()
	}
	/* 返回新的src */
	_handler (config) {
		let newSrc
		if (typeof this.handler === 'function') {
			newSrc = this.handler(config)
		}
		if (typeof newSrc !== 'string') {
			newSrc = join(this.hosts[this.retryTimes[config.source]], config.source)
		}
		this.retryTimes[config.source]++
		return newSrc
	}
}

export default RetryScript