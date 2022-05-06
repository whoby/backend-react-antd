import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import App from '@/App'
import Container from '@/views/common/container'
import asyncComponent from '@/components/asyncComponent'

/* beautify preserve:start */

/* 公共模块 */
const Index = asyncComponent(() => import(/* webpackChunkName: "Index" */ '@/views/root/index')) //
const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@/views/error/notFound'))
const Login = lazy(() => import(/* webpackChunkName: "Login" */ '@/views/root/login'))

/* 用户管理 */
const UserInfo = lazy(() => import(/* webpackChunkName: "UserInfo" */ '@/views/user/info/index'))
const UserCard = lazy(() => import(/* webpackChunkName: "UserCard" */ '@/views/user/card/index'))

/* beautify preserve:end */

// 路由配置
const routes = [
    {
        path: '/index',
        title: '首页',
        component: Index
    },
    {
        path: '/user',
        title: '用户管理',
        component: Container,
        children: [
            {
                path: '/user/info',
                title: '用户信息',
                component: UserInfo
            },
            {
                path: '/user/card',
                title: '用户卡片',
                component: Container,
                children: [
                    {
                        path: '/user/card/list',
                        title: '用户列表',
                        component: UserCard
                    }
                ]
            }
        ]
    }
]

@inject('menuStore')
@observer
class IndexRouter extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.menuStore.menu !== routes) {
            nextProps.menuStore.saveMenu(routes)
        }
        return null
    }

    render() {
        return (
            <Suspense fallback={<div>组件加载中...</div>}>
                <Router>
                    <Switch>
                        <Route path="/" exact render={() => <Redirect to="/login" />} />
                        <Route path="/login" component={Login} />
                        <App>
                            <Switch>
                                {routes.map((item, i) => (
                                    <Route path={item.path} key={i} render={(props) => <item.component {...props} routes={item.children} path={item.path} />} />
                                ))}
                                <Route path="*" component={NotFound} />
                            </Switch>
                        </App>
                    </Switch>
                </Router>
            </Suspense>
        )
    }
}

export default IndexRouter
