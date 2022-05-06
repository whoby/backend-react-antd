import React from 'react'
import { Form, Row, Col, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { formItemLayout } from '@/config/global'
import util from '@/libs/util'

const Search = ({ onSearchChange }) => {
    const [form] = Form.useForm()

    const onFinish = (values) => {
        values = util.batchTrim(values)
        onSearchChange(values)
    }

    return (
        <Form form={form} onFinish={onFinish} className="searchForm">
            <Row>
                <Col span={5}>
                    <Form.Item {...formItemLayout.lg} name="telephone" label="手机号">
                        <Input placeholder="请输入手机号" />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item {...formItemLayout.lg} name="nickName" label="姓名">
                        <Input placeholder="请输入姓名" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            <SearchOutlined />
                            查询
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default Search
