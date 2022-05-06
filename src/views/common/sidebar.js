import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

@withRouter
@inject('menuStore')
@observer
class SideMenu extends React.Component {
    constructor(props) {
        super(props)

        this.store = props.menuStore
        this.state = {
            sideMenu: [],
            openKeys: [],
            selectedKeys: []
        }

        // 临时变量
        this.stack = {
            flag: false,
            openKeys: [],
            breadNames: []
        }
    }

    componentDidMount() {
        this.initMenuData()
    }

    // 根据路由siderbar重新渲染
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.stack = {
                flag: false,
                openKeys: [],
                breadNames: []
            }
            this.initMenuData()
        }
    }

    // 选中菜单
    onMenuClick = e => {
        this.props.history.push(e.key)
    }

    // defaultOpenkeys只能初始化一次，openKeys: 返回当前所有打开的keys
    onOpenChange = openKeys => {
        this.setState({ openKeys })
    }

    // 递归取出菜单路径及面包屑名称
    getPathInfo(item, curPath) {
        if (curPath.indexOf(item.path) === 0 && item.children) {
            this.stack.openKeys.push(item.path)
            this.stack.breadNames.push(item.title)

            item.children.some(child => this.getPathInfo(child, curPath))
        }

        // 去掉菜单形参(如/:id?)和实参(如/20)，再进行比较
        if (item.path.replace(/\/:\w+\??$/, '') === curPath.replace(/\/\d+$/, '')) {
            this.stack.breadNames.push(item.title)
            this.stack.flag = true
            return true
        }

        return false
    }

    // 递归渲染子菜单
    getChildMenu(item) {
        if (item.children && item.children.length) {
            return (
                <Menu.SubMenu
                    key={item.path}
                    title={
                        <span>
                            <Icon type="folder" />
                            {item.title}
                        </span>
                    }
                >
                    {item.children.map(child => this.getChildMenu(child))}
                </Menu.SubMenu>
            )
        }
        return <Menu.Item key={item.path.replace(/\/:\w+\??$/, '')}>{item.title}</Menu.Item>
    }

    // 根据当前路径初始化sidebar菜单数据
    initMenuData() {
        const curPath = this.props.location.pathname

        // 根据当前路由获取一级菜单
        const regResult = /(\/\w+)\//.exec(curPath)
        const topPath = regResult ? regResult[1] : ''

        // 根据当前一级菜单过滤出子级
        let sideMenu = []
        this.store.menu.some(item => {
            if (item.path === topPath) {
                this.stack.breadNames.push(item.title)
                sideMenu = item.children
                return true
            }
            return false
        })

        sideMenu.some(item => {
            if (this.stack.flag) {
                return true
            }
            return this.getPathInfo(item, curPath)
        })

        this.setState({
            sideMenu,
            openKeys: this.stack.openKeys,
            selectedKeys: [curPath]
        })

        // 保存面包屑名称
        this.store.saveBreadNames(this.stack.breadNames)
    }

    render() {
        return (
            <Menu
                openKeys={this.state.openKeys}
                selectedKeys={this.state.selectedKeys}
                mode="inline"
                onClick={this.onMenuClick}
                onOpenChange={this.onOpenChange}
            >
                {this.state.sideMenu.map(item => this.getChildMenu(item))}
            </Menu>
        )
    }
}

export default SideMenu
