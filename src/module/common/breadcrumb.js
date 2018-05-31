import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Breadcrumb } from 'antd';

@withRouter
@inject('menuStore') @observer

class Bread extends Component {
    render() {
        return (
            <Breadcrumb style={{ margin: '3px 0' }}>
                <Breadcrumb.Item>首页</Breadcrumb.Item>
                {
                    this.props.menuStore.breadNames.map((item, index) => <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
                }
            </Breadcrumb>
        );
    }
}

export default Bread;
