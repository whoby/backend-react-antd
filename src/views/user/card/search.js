import React, { useEffect, useCallback } from 'react'
import { Form, Row, Col, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { formItemLayout } from '@/config/global'
import renderSelect from '@/components/renderSelect'
import util from '@/libs/util'

const Search = ({ cardType, onSearchChange }) => {
    const onFinish = useCallback(
        (values) => {
            // 去除空值&空格
            values = values || {}
            values = util.batchTrim(values)
            onSearchChange(values)
        },
        [onSearchChange]
    )

    useEffect(() => {
        onFinish()
    }, [cardType, onFinish])

    const [form] = Form.useForm()

    return (
        <Form form={form} onFinish={onFinish} className="searchForm">
            <Row>
                <Col span={5}>
                    <Form.Item {...formItemLayout.lg} name="telephone" label="手机号">
                        <Input placeholder="请输入手机号" />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item {...formItemLayout.md} name="openType" label="开卡类型">
                        {renderSelect(cardType)}
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
