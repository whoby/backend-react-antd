/**
 * global util.js
 * @type {Object}
 */
import moment from 'moment'
import JSEncrypt from 'jsencrypt'

export default {
    // 校验邮箱
    isEmail(v) {
        return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(v)
    },

    // 校验url（isFull:完整验证, 默认为true）
    isUrl(v, isFull) {
        return new RegExp(`^${isFull === false ? '(http[s]?://)?' : 'http[s]?://'}[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,:@?^=%&/~+#]*[\\w\\-@?^=%&/~+#])?$`).test(v)
    },

    // 校验tel
    isTel(v) {
        return /^1[3-9]\d{9}$/.test(v)
    },

    // 批量处理对象属性空格
    batchTrim(obj) {
        Object.keys(obj).forEach((key) => {
            // 去空格
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim()
            }
            // 移除没用的参数
            if (!obj[key] || typeof obj[key] === 'object') {
                Reflect.deleteProperty(obj, key)
            }
        })
        return obj
    },

    // 带参路由处理（获取纯正的路由）
    routePath(route) {
        let { path } = route

        Object.keys(route.params).forEach((key) => {
            const param = route.params[key]
            const regExp = new RegExp(`/${param}(/|$)`)
            path = path.replace(regExp, '$1')
        })

        return path
    },

    // 日期格式转换(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    dateFormat(date, fmt) {
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
        }

        Object.keys(o).forEach((k) => {
            if (new RegExp(`(${k})`).test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
            }
        })

        return fmt
    },

    // 格式化日期范围
    dateRange(range) {
        if (!range.length) {
            return []
        }

        return range.map((item, index) => {
            item = this.dateFormat(item, 'yyyy-MM-dd hh:mm:ss')
            if (index === 1) {
                item = item.replace('00:00:00', '23:59:59')
            }
            return item
        })
    },

    // 根据当前时间加减天数
    dateAdd(day) {
        return moment(+new Date() + day * 24 * 60 * 60 * 1000)
    },

    // 指定位置插入字符
    getTextInsert(index, content, insertText) {
        return content.slice(0, index) + insertText + content.slice(index, content.length)
    },

    // cookie方法
    cookie(key, value, options) {
        let days
        let time

        // A key and value were given. Set cookie.
        if (arguments.length > 1 && String(value) !== '[object Object]') {
            // Enforce object
            options = options || {}

            if (value === null || value === undefined) {
                options.expires = -1
            }

            if (typeof options.expires === 'number') {
                days = options.expires * 24 * 60 * 60 * 1000
                options.expires = new Date()
                time = options

                time.setTime(time.getTime() + days)
            }

            value = String(value)

            return (document.cookie = [
                encodeURIComponent(key),
                '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? `; expires=${options.expires.toUTCString()}` : '',
                options.path ? `; path=${options.path}` : '',
                options.domain ? `; domain=${options.domain}` : '',
                options.secure ? '; secure' : ''
            ].join(''))
        }

        // Key and possibly options given, get cookie
        options = value || {}

        const decode = options.raw
            ? function (s) {
                  return s
              }
            : decodeURIComponent

        const result = new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`).exec(document.cookie)

        return result ? decode(result[1]) : null
    },

    /**
     * @desc 前端rsa非对称加密
     * @param {*} pwd：明文
     * @returns 加密字符串
     */
    encrypt(pwd) {
        // 先用node-rsa生成公钥、私钥
        let publicKey = `
        -----BEGIN PUBLIC KEY-----
        MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALL4jwoh8HKNSBeZkMYRgTV+QdknSgyq
        fdZ23WzjEFCYop5JZYSQh1sm5ojsFNRBHUmx6A6WcRLM4KSvhbCDY8cCAwEAAQ==
        -----END PUBLIC KEY-----
        `
        let encryptor = new JSEncrypt()
        encryptor.setPublicKey(publicKey)

        return encryptor.encrypt(pwd)
    }
}
