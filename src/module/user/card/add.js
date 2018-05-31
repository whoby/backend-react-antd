import React, { Component } from 'react';
import { Form, Row, Button, Modal, message, Spin } from 'antd';
import renderSelect from 'components/renderSelect';
import ajax from 'libs/ajax';

const FormItem = Form.Item;

class Add extends Component {
    state = {
        loading: false,
        cardType: {},
        uploadFile: null,
        showModal: false
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cardType !== nextProps.cardType) {
            this.setState({
                cardType: nextProps.cardType
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onFileChange = (e) => {
        const uploadFile = e.target.files[0];

        if (!/\.(xls|xlsx)$/.test(uploadFile.name)) {
            message.warning('上传文件必须为excel类型文件，请重新选择！');
            e.target.value = '';
            this.setState({
                uploadFile: null
            });
            return;
        }
        this.setState({ uploadFile });
    }

    onOpenCard = () => {
        this.setState({
            showModal: true
        });
    }

    handleOk = (e) => {
        // eslint-disable-next-line
        e && e.preventDefault();

        // 防重复提交
        if (this.state.loading) {
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!this.state.uploadFile) {
                    message.warning('你还没有上传文件，请选择！');
                    return;
                }

                // 上传二进制文件用multipart/form传
                const formData = new FormData();
                formData.append('openType', values.openType);
                formData.append('file', this.state.uploadFile);

                this.setState({ loading: true });
                ajax.post('/user/card/open', formData, (res) => {
                    if (this.mounted) {
                        this.setState({ loading: false });

                        Modal.info({
                            title: '处理结果',
                            content: (
                                <div>
                                    <p>上传成功：<span>{res.successNum}条</span></p>
                                    <p>上传失败：<span>{res.failNum}条</span></p>
                                </div>
                            )
                        });

                        this.setState({
                            showModal: false
                        });

                        // 回调父级方法，重载列表
                        this.props.onAddSave();
                    }
                }, { dataType: 'multi' });

                setTimeout(() => {
                    this.setState({ loading: false });
                }, 60000);
            }
        });
    }

    handleCancel = () => {
        this.setState({
            showModal: false
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Button type="add" icon="file-add" onClick={this.onOpenCard} className="mb10">开卡</Button>
                <Modal title="开卡" visible={this.state.showModal} onOk={this.handleOk} onCancel={this.handleCancel} confirmLoading={this.state.loading} destroyOnClose>
                    <Spin spinning={this.state.loading}>
                        <Form onSubmit={this.onSubmit} layout="vertical">
                            <Row>
                                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label="开卡类型">
                                    {getFieldDecorator('openType', { rules: [{ required: true, message: '请选择开卡类型！' }] })(
                                        renderSelect(this.state.cardType)
                                    )}
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} label="上传文件">
                                    <input id="openCardFile" accept=".xls,.xlsx" type="file" name="file" onChange={this.onFileChange} />
                                </FormItem>
                            </Row>
                        </Form>
                    </Spin>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Add);
