import React from 'react'
import { observer } from 'mobx-react'
import { Breadcrumb } from 'antd'
import { useStore } from '@/hooks'

const Bread = () => {
    const store = useStore('menuStore')

    return (
        <Breadcrumb style={{ margin: '3px 0' }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            {store.breadNames.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}

export default observer(Bread)
