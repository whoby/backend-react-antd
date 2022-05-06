import React, { useState, useEffect, useRef, useCallback } from 'react'
import { observer } from 'mobx-react'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import { useStore } from '@/hooks'

const SideMenu = () => {
    const store = useStore('menuStore')
    const history = useHistory()
    const location = useLocation()

    let [sideMenu, setSideMenu] = useState([])
    let [openKeys, setOpenKeys] = useState([])
    let [selectedKeys, setSelectedKeys] = useState([])

    // 临时变量
    const stack = useRef({
        flag: false,
        openKeys: [],
        breadNames: []
    })

    // 递归取出菜单路径及面包屑名称
    const getPathInfo = useCallback((item, curPath) => {
        if (curPath.indexOf(item.path) === 0 && item.children) {
            stack.current.openKeys.push(item.path)
            stack.current.breadNames.push(item.title)

            item.children.some((child) => getPathInfo(child, curPath))
        }

        // 去掉菜单形参(如/:id?)和实参(如/20)，再进行比较
        if (item.path.replace(/\/:\w+\??$/, '') === curPath.replace(/\/\d+$/, '')) {
            stack.current.breadNames.push(item.title)
            stack.current.flag = true
            return true
        }

        return false
    }, [])

    // 递归渲染子菜单
    const getChildMenu = (item) => {
        if (item.children && item.children.length) {
            return {
                label: item.title,
                key: item.path,
                children: item.children.map((child) => getChildMenu(child))
            }
        }
        return { label: item.title, key: item.path.replace(/\/:\w+\??$/, '') }
    }

    //  初始化菜单
    // useEffect(() => {
    //     initMenuData()
    // }, [])

    useEffect(() => {
        stack.current.current = {
            flag: false,
            openKeys: [],
            breadNames: []
        }

        // 根据当前路径初始化sidebar菜单数据
        const initMenuData = () => {
            const curPath = location.pathname

            // 根据当前路由获取一级菜单
            const regResult = /(\/\w+)\//.exec(curPath)
            const topPath = regResult ? regResult[1] : ''

            // 根据当前一级菜单过滤出子级
            let sideMenu = []
            store.menu.some((item) => {
                if (item.path === topPath) {
                    stack.current.breadNames.push(item.title)
                    sideMenu = item.children
                    return true
                }
                return false
            })

            sideMenu.some((item) => {
                if (stack.current.flag) {
                    return true
                }
                return getPathInfo(item, curPath)
            })

            setSideMenu(sideMenu)
            setOpenKeys(stack.current.openKeys)
            setSelectedKeys([curPath])

            // 保存面包屑名称
            store.saveBreadNames(stack.current.breadNames)
        }

        initMenuData()
    }, [location.pathname, store, getPathInfo])

    // 选中菜单
    const onMenuClick = (e) => {
        history.push(e.key)
    }

    // defaultOpenkeys只能初始化一次，openKeys: 返回当前所有打开的keys
    const onOpenChange = (openKeys) => {
        setOpenKeys(openKeys)
    }

    const menuItems = sideMenu.map((item) => getChildMenu(item))

    return <Menu openKeys={openKeys} selectedKeys={selectedKeys} mode="inline" onClick={onMenuClick} onOpenChange={onOpenChange} items={menuItems} />
}

export default observer(SideMenu)
