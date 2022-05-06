import React, { useState, useEffect, useRef } from 'react'
import useDeepEffect from 'use-deep-compare-effect'
import { Table } from 'antd'
import { pageProps } from '@/config/global'
import ajax from '@/libs/ajax'

const gridProps = {
    columns: [
        {
            title: '姓名',
            dataIndex: 'nickName'
        },
        {
            title: '手机号',
            dataIndex: 'telephone'
        },
        {
            title: '注册时间',
            dataIndex: 'registerTime'
        }
    ],
    rowKey: 'id'
}

const Grid = ({ searchData }) => {
    const [gridData, setGridData] = useState([])
    const [pagination, setPagination] = useState({ ...pageProps })
    const [loading, setLoading] = useState(false)

    // 标识
    let isUnmounted = useRef(false)
    let isSearchChange = false

    // 页面销毁标识
    useEffect(() => {
        isUnmounted.current = false
        return () => (isUnmounted.current = true)
    }, [])

    // 搜索条件变化标识
    useDeepEffect(() => {
        isSearchChange = true
        return () => (isSearchChange = false)
    }, [searchData])

    // 搜索、分页变更
    useDeepEffect(() => {
        // 条件为空不查询
        if (!Object.keys(searchData).length) {
            return
        }

        // 请求列表数据
        const initGridData = () => {
            const params = {
                ...searchData,
                currentPage: pagination.current,
                pageSize: pagination.pageSize
            }

            // 重新搜索时，重置分页
            if (isSearchChange) {
                params.currentPage = 1
            }

            setLoading(true)

            ajax.post('/user/info/list', params, (res) => {
                if (!isUnmounted.current) {
                    pagination.total = ~~res.total
                    pagination.pageSize = 1
                    setGridData(res.list || [])
                    setPagination(pagination)
                    setLoading(false)
                }
            })
        }

        initGridData()
    }, [searchData, pagination])

    // 分页事件
    const onPageChange = (v) => {
        setPagination(v)
    }

    return (
        <div>
            <Table {...gridProps} dataSource={gridData} pagination={pagination} loading={loading} onChange={onPageChange} />
        </div>
    )
}

export default Grid
