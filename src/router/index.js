import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import App from '@/App';
import Container from 'module/common/container';
import asyncComponent from 'components/asyncComponent';

/* 公共模块 */
const Login = asyncComponent(() => import('module/root/login'));
const Index = asyncComponent(() => import('module/root/index'));
const NotFound = asyncComponent(() => import('module/error/notFound'));

/* 用户管理 */
const UserInfo = asyncComponent(() => import('module/user/info/index'));
const UserCard = asyncComponent(() => import('module/user/card/index'));

// 路由配置
const routes = [{
    path: '/user',
    component: Container,
    children: [{
        path: '/user/info',
        component: UserInfo,
    }, {
        path: '/user/card',
        component: Container,
        children: [{
            path: '/user/card/list',
            component: UserCard
        }]
    }]
}];

export default () => (
    <Router>
        <Switch>
            <Route path="/" exact render={() => (<Redirect to="/login" />)} />
            <Route path="/login" component={Login} />
            <Route path="/index" component={Index} />
            <App>
                <Switch>
                    {routes.map((item, i) => (
                        <Route path={item.path} key={i} render={props => <item.component {...props} routes={item.children} path={item.path} />} />
                    ))}
                    <Route path="*" component={NotFound} />
                </Switch>
            </App>
        </Switch>
    </Router>
);
