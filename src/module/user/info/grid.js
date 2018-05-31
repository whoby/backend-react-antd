import React, { Component } from 'react';
import { Table } from 'antd';
import { pageProps } from 'config/global';
import ajax from 'libs/ajax';

class Grid extends Component {
    constructor(props) {
        super(props);

        this.gridProps = {
            columns: [{
                title: '姓名',
                dataIndex: 'nickName'
            }, {
                title: '手机号',
                dataIndex: 'telephone'
            }, {
                title: '注册时间',
                dataIndex: 'registerTime'
            }],
            rowKey: 'id',
        };

        this.state = {
            gridData: [],
            pagination: {
                ...pageProps
            },
            loading: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    // 响应search组件传参
    componentWillReceiveProps(nextProps) {
        if (nextProps.searchData !== this.props.searchData) {
            this.initGridData(nextProps.searchData);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // 分页事件
    onPageChange = (pagination) => {
        this.setState({ pagination }, () => {
            this.initGridData();
        });
    }

    initGridData(searchData) {
        const pagination = this.state.pagination;
        const params = {
            ...(searchData || this.props.searchData),
            currentPage: pagination.current,
            pageSize: pagination.pageSize
        };

        // 触发搜索时，分页从1开始
        if (searchData) {
            params.currentPage = 1;
        }

        ajax.post('/user/info/list', params, (res) => {
            if (this.mounted) {
                pagination.total = ~~res.total;
                this.setState({
                    gridData: res.list,
                    pagination,
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Table {...this.gridProps} dataSource={this.state.gridData} pagination={this.state.pagination} loading={this.state.loading} onChange={this.onPageChange} />
            </div>
        );
    }
}

export default Grid;
