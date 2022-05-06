import React, { useState, useEffect, useRef } from 'react'
import useDeepEffect from 'use-deep-compare-effect'
import { Table } from 'antd'
import { pageProps } from '@/config/global'
import ajax from '@/libs/ajax'

const Grid = ({ cardType, searchData }) => {
    const gridProps = {
        columns: [
            {
                title: '序号',
                dataIndex: 'id'
            },
            {
                title: '手机号',
                dataIndex: 'telephone'
            },
            {
                title: '姓名',
                dataIndex: 'name',
                render(v, r) {
                    return `${r.surname} ${v}`
                }
            },
            {
                title: '卡号',
                dataIndex: 'cardNo'
            },
            {
                title: '状态',
                dataIndex: 'cardStatus'
            },
            {
                title: '开卡时间',
                dataIndex: 'activeTime'
            },
            {
                title: '办理人',
                dataIndex: 'createName'
            },
            {
                title: '开卡类型',
                dataIndex: 'openType',
                render: (v) => cardType[v]
            }
        ],
        rowKey: 'id'
    }

    let [gridData, setGridData] = useState([])
    let [pagination, setPagination] = useState({ ...pageProps })
    let [loading, setLoading] = useState(false)

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

            ajax.post('/user/card/list', params, (res) => {
                if (!isUnmounted.current) {
                    pagination.total = ~~res.total
                    setGridData(res.list || [])
                    setPagination(pagination)
                    setLoading(false)
                }
            })
        }

        initGridData()
    }, [searchData])

    // 分页事件
    const onPageChange = (v) => {
        setPagination(v)
    }

    return (
        <>
            <Table {...gridProps} dataSource={gridData} pagination={pagination} loading={loading} onChange={onPageChange} />
        </>
    )
}

export default Grid
