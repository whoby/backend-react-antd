import React, { useState, useEffect, useRef } from 'react'
import { Form, Row, Button, Modal, message, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import renderSelect from '@/components/renderSelect'
import ajax from '@/libs/ajax'

const Add = ({ cardType, onAddSave }) => {
    let isUnmounted = useRef(false)

    let [loading, setLoading] = useState(false)
    let [uploadFile, setUploadFile] = useState(null)
    let [showModal, setShowModal] = useState(false)

    useEffect(() => {
        isUnmounted.current = false
        return () => (isUnmounted.current = true)
    }, [])

    const onFileChange = (e) => {
        const uploadFile = e.target.files[0]

        if (!/\.(xls|xlsx)$/.test(uploadFile.name)) {
            message.warning('上传文件必须为excel类型文件，请重新选择！')
            e.target.value = ''
            setUploadFile(null)
            return
        }
        setUploadFile(uploadFile)
    }

    const onOpenCard = () => {
        setShowModal(true)
    }

    const handleOk = (e) => {
        // eslint-disable-next-line
        e && e.preventDefault()

        // 防重复提交
        if (loading) {
            return
        }

        props.form.validateFields((err, values) => {
            if (!err) {
                if (!uploadFile) {
                    message.warning('你还没有上传文件，请选择！')
                    return
                }

                // 上传二进制文件用multipart/form传
                const formData = new FormData()
                formData.append('openType', values.openType)
                formData.append('file', uploadFile)

                setLoading(true)

                ajax.post(
                    '/user/card/open',
                    formData,
                    (res) => {
                        if (isUnmounted.current) {
                            setLoading(false)

                            Modal.info({
                                title: '处理结果',
                                content: (
                                    <div>
                                        <p>
                                            上传成功：<span>{res.successNum}条</span>
                                        </p>
                                        <p>
                                            上传失败：<span>{res.failNum}条</span>
                                        </p>
                                    </div>
                                )
                            })

                            setShowModal(false)

                            // 回调父级方法，重载列表
                            onAddSave()
                        }
                    },
                    { enctype: 'multi' }
                )

                setTimeout(() => {
                    setLoading(false)
                }, 60000)
            }
        })
    }

    const handleCancel = () => {
        setShowModal(false)
    }

    return (
        <div>
            <Button type="add" onClick={onOpenCard} className="mb10">
                <PlusOutlined />
                开卡
            </Button>
            <Modal title="开卡" visible={showModal} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading} destroyOnClose>
                <Spin spinning={loading}>
                    <Form layout="vertical">
                        <Row>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} name="openType" label="开卡类型" rules={[{ required: true, message: '请选择开卡类型！' }]}>
                                {renderSelect(cardType)}
                            </Form.Item>
                        </Row>
                        <Row>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label="上传文件">
                                <input id="openCardFile" accept=".xls,.xlsx" type="file" name="file" onChange={onFileChange} />
                            </Form.Item>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </div>
    )
}

export default Add
