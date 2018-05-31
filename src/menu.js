const menu = [{
    path: '/index',
    title: '首页'
}, {
    path: '/user',
    title: '用户管理',
    children: [{
        path: '/user/info',
        title: '用户信息'
    }, {
        path: '/user/card',
        title: '用户卡片',
        children: [{
            path: '/user/card/list',
            title: '卡片列表'
        }]
    }]
}];

export default menu;
