import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import App from '@/App'
import Container from '@/module/common/container'
import asyncComponent from '@/components/asyncComponent'

/* beautify preserve:start */

/* 公共模块 */
const Login = asyncComponent(() => import(/* webpackChunkName: "Login" */ '@/module/root/login'))
const Index = asyncComponent(() => import(/* webpackChunkName: "Index" */ '@/module/root/index'))
const NotFound = asyncComponent(() => import(/* webpackChunkName: "NotFound" */ '@/module/error/notFound'))

/* 用户管理 */
const UserInfo = asyncComponent(() => import(/* webpackChunkName: "UserInfo" */ '@/module/user/info/index'))
const UserCard = asyncComponent(() => import(/* webpackChunkName: "UserCard" */ '@/module/user/card/index'))

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
            <Router>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/login" />} />
                    <Route path="/login" component={Login} />
                    <App>
                        <Switch>
                            {routes.map((item, i) => (
                                <Route
                                    path={item.path}
                                    key={i}
                                    render={props => <item.component {...props} routes={item.children} path={item.path} />}
                                />
                            ))}
                            <Route path="*" component={NotFound} />
                        </Switch>
                    </App>
                </Switch>
            </Router>
        )
    }
}

export default IndexRouter
