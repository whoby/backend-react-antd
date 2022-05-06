import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useStore } from '@/hooks'
import { ajax } from '@/libs'

const Headbar = () => {
    const menuStore = useStore('menuStore')
    const userStore = useStore('userStore')

    const history = useHistory()
    const location = useLocation()

    // 退出
    const onLoginOut = (e) => {
        ajax.post('/doLogin', { cmd: 'loginOut' }, () => {
            userStore.saveUserName('')
            history.push('/login')
        })
    }

    // 判断当前地址是否属于一级菜单
    const getActiveClassName = (linkPath) => {
        const regResult = /(\/\w+)(\/|$)/.exec(linkPath)
        const topPath = regResult ? regResult[1] : ''

        return location.pathname.indexOf(topPath) === 0 ? 'is-active' : ''
    }

    return (
        <Wrap>
            <header className="header clear">
                <h1 className="logo">通用后台管理系统</h1>
                <nav className="nav">
                    {menuStore.menu.map((item, i) => {
                        let { path } = item
                        // 默认取子级第一个
                        if (item.children && item.children.length) {
                            const child = item.children[0]
                            // 若子级不是叶子节点，取孙子级
                            if (child.children && child.children.length) {
                                path = child.children[0].path
                            } else {
                                path = item.children[0].path
                            }
                        }
                        return (
                            <Link to={path} key={i} className={getActiveClassName(path) + ' link'}>
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
                <div className="info">
                    欢迎您<strong style={{ padding: '0 10px' }}>{userStore.userName}</strong>|
                    <a className="pl15" onClick={onLoginOut}>
                        退出
                    </a>
                </div>
            </header>
        </Wrap>
    )
}

export default observer(Headbar)

const Wrap = styled.header`
    .header {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: 60px;
        color: #fff;
        z-index: 999;
    }
    .logo {
        float: left;
        margin: 15px 0 10px 25px;
        font-size: 22px;
        letter-spacing: 1.5px;
        font-weight: normal;
    }
    .nav {
        float: left;
        margin: 22px 0 0 80px;
    }
    .link {
        display: inline-block;
        margin: 0 15px;
    }
    .info {
        float: right;
        margin: 20px 20px 0 0;
    }
`
