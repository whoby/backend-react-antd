const RAP_SERVICE = 'http://rap2api.taobao.org/app/mock/14718' // rap服务器

module.exports = {
    proxyTable: {
        '/api/**': RAP_SERVICE
    },

    // 接口代理开关: 注释掉默认使用Rap数据，开启可代理到任意服务器/后端电脑
    // proxyTarget: 'http://mybk-dev.github.com'
}
