import React, { Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { formItemLayout } from 'config/global';
import util from 'libs/util';

const FormItem = Form.Item;

class Search extends Component {
    componentDidMount() {
        this.onSearch();
    }

    onSearch = (e) => {
        // eslint-disable-next-line
        e && e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 去除空值&空格
                values = util.batchTrim(values);
                this.props.onSearchChange(values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSearch} className="searchForm">
                <Row>
                    <Col span={5}>
                        <FormItem {...formItemLayout.lg} label="手机号">
                            {getFieldDecorator('telephone')(<Input placeholder="请输入手机号" />)}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...formItemLayout.lg} label="姓名">
                            {getFieldDecorator('nickName')(<Input placeholder="请输入姓名" />)}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem>
                            <Button type="primary" icon="search" htmlType="submit">查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(Search);
