import React, { Component } from 'react'
import { Table } from 'antd'
import { pageProps } from '@/config/global'
import ajax from '@/libs/ajax'

class Grid extends Component {
    constructor(props) {
        super(props)

        this.gridProps = {
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
                    render: v => {
                        return this.props.cardType[v]
                    }
                }
            ],
            rowKey: 'id'
        }

        this.state = {
            gridData: [],
            pagination: {
                ...pageProps
            },
            loading: false
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    // 响应search组件传参
    componentDidUpdate(prevProps) {
        if (prevProps.searchData !== this.props.searchData) {
            this.initGridData(this.props.searchData)
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    // 分页事件
    onPageChange = pagination => {
        this.setState({ pagination }, () => {
            this.initGridData()
        })
    }

    initGridData(searchData) {
        const pagination = this.state.pagination
        const params = {
            ...(searchData || this.props.searchData),
            currentPage: pagination.current,
            pageSize: pagination.pageSize
        }

        // 触发搜索时，分页从1开始
        if (searchData) {
            params.currentPage = 1
        }

        ajax.post('/user/card/list', params, res => {
            if (this.mounted) {
                pagination.total = ~~res.total
                this.setState({
                    gridData: res.list,
                    pagination
                })
            }
        })
    }

    render() {
        return (
            <div>
                <Table
                    {...this.gridProps}
                    dataSource={this.state.gridData}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.onPageChange}
                />
            </div>
        )
    }
}

export default Grid
