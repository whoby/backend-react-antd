import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Link } from 'react-router-dom'
import { ajax } from '@/libs'

@withRouter
@inject('userStore', 'menuStore')
@observer
class Headbar extends Component {
    constructor(props) {
        super(props)
        this.menuStore = this.props.menuStore
        this.userStore = this.props.userStore
    }

    // 退出
    onLoginOut = e => {
        e.preventDefault()

        ajax.post('/doLogin', { cmd: 'loginOut' }, () => {
            this.userStore.saveUserName('')
            this.props.history.push('/login')
        })
    }

    // 判断当前地址是否属于一级菜单
    getActiveClassName(linkPath) {
        const regResult = /(\/\w+)(\/|$)/.exec(linkPath)
        const topPath = regResult ? regResult[1] : ''

        return this.props.location.pathname.indexOf(topPath) === 0 ? 'is-active' : ''
    }

    render() {
        return (
            <header className="clear" style={styles.header}>
                <h1 style={styles.logo}>通用后台管理系统</h1>
                <nav style={styles.nav}>
                    {this.menuStore.menu.map((item, i) => {
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
                            <Link to={path} key={i} className={this.getActiveClassName(path)} style={styles.link}>
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
                <div style={styles.info}>
                    欢迎您<strong style={{ padding: '0 10px' }}>{this.userStore.userName}</strong>|
                    <a className="pl15" onClick={this.onLoginOut}>
                        退出
                    </a>
                </div>
            </header>
        )
    }
}

export default Headbar

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        height: 60,
        color: '#fff',
        zIndex: 999
    },
    logo: {
        float: 'left',
        margin: '15px 0 10px 25px',
        fontSize: 22,
        letterSpacing: 1.5,
        fontWeight: 'normal'
    },
    nav: {
        float: 'left',
        margin: '22px 0 0 80px'
    },
    link: {
        display: 'inline-block',
        margin: '0 15px'
    },
    info: {
        float: 'right',
        margin: '20px 20px 0 0'
    }
}
