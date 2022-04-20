import React, { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, message, Modal, Select, Tooltip, Tree, Typography } from 'antd';
import styles from './styles.module.css';
import { FileOutlined, FolderOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import doRequest from '../../interface/useRequests';
import AuthStore from '../../store/AuthStore';

const { Option } = Select;
const { Paragraph, } = Typography;
const initTreeData: any[] = [
    { title: '我加入的圈子', key: '2' },
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
];

function updateTreeData(list: any[], key: React.Key, children: any[]): any[] {
    return list.map(node => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
}

const CircleSelection = (props: any) => {
    const [treeData, setTreeData] = useState(initTreeData);

    useEffect(() => {
        const params = {
            url: '/circle', type: 'GET'
        }
        doRequest(params)
            .then(res => {
                setTreeData(res.data.map((item: any) => {
                    return {
                        title: item.circlename,
                        key: item.circleid,
                        icon: <FolderOutlined />,
                    }
                }))
            })
    }, []);

    const onLoadData = ({ key, children }: any) =>
        new Promise<void>(resolve => {
            if (children) {
                resolve();
                return;
            }
            const params = {
                url: '/circle', type: 'GET', params: {
                    id: key, userid: AuthStore.userid
                }
            }
            doRequest(params)
                .then(res => {
                    setTreeData(origin =>
                        updateTreeData(origin, key, [
                            ...res.data.map((item: any) => {
                                return {
                                    title: item.circlename,
                                    key: item.circleid,
                                    isLeaf: item.hasChildren !== 1,
                                    icon: <FileOutlined />,
                                }
                            })
                        ]),
                    );
                    resolve();
                })
                .catch(() => {
                    message.error('加载失败');
                    resolve();
                })
        });

    return <Tree showIcon loadData={onLoadData} treeData={treeData} />;
};

const Circle = (props: any) => {
    const [search, changeSearch] = useState('');
    const [showCircleList, setShowCircleList] = useState([] as any[]);
    const [circleList, setCircleList] = useState([] as any[]);
    const [typeList, setTypeList] = useState([] as any[]);
    const [isCircleModalVisible, changeCircleModalVisible] = useState(false);

    useEffect(() => {
        _init();
    }, []);

    useEffect(() => {
        const params = {
            url: '/circle', type: 'GET'
        }
        doRequest(params)
            .then(res => {
                let typeList = res.data;
                typeList.shift();
                typeList = typeList.map((item: any) => {
                    return {
                        value: item.circleid,
                        label: item.circlename
                    }
                });
                typeList.unshift({ value: 'root', label: '无分类' });
                setTypeList(typeList);
            })
    }, [])

    const _init = () => {
        const params = {
            url: '/circle', type: 'GET', params: { id: '1' }
        }
        doRequest(params)
            .then(res => {
                let newList = [...res.data.map((item: any) => {
                    return {
                        id: item.circleid.replace('my', ''),
                        title: item.circlename,
                        msg: item.msg,
                        isjoin: item.isjoin
                    }
                })];
                setCircleList(newList);
                setShowCircleList(newList);
            })
    }

    const onKeyUp = (e: any) => {
        if (e.keyCode !== 13) return;
        setShowCircleList(circleList.filter(item => item.title.indexOf(search) !== -1));
    }

    const handleOk = () => {
        changeCircleModalVisible(false);
    }

    const handleCancel = () => {
        changeCircleModalVisible(false);
    }

    const doJoin = (id: string, isjoin: any) => {
        if (isjoin) return;
        const params = {
            url: '/circle/join', type: 'POST', needAuth: true, params: { id }
        }
        doRequest(params)
            .then(() => {
                _init();
            })
    }

    const onCircleFormFinish = (values: any) => {
        console.log('Success:', values);
        let params = {
            url: '/circle', type: 'POST', needAuth: true, params: { ...values,ispublic: 1,}
        }
        doRequest(params)
            .then(() => {
                message.success('已进入审批流程');
                handleCancel();
            })
            .catch(err => message.error(err));
    };

    return (
        <div className={styles.wrap}>
            <Modal title="创建圈子" visible={isCircleModalVisible} onOk={handleOk} okText="返回" onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onCircleFormFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="圈子名称"
                        name="circlename"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="圈子描述"
                        name="msg"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input.TextArea rows={2} autoSize />
                    </Form.Item>
                    <Form.Item
                        label="所属分类"
                        name="parentid"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                        >
                            {typeList.map((item: any) => (
                                <Option value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            提交审核
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className={styles.aside}>
                <CircleSelection />
            </div>
            <div className={styles.center}>
                <Input
                    className={styles.searchbox}
                    onKeyUp={e => onKeyUp(e)}
                    placeholder="搜索圈子"
                    onChange={e => changeSearch(e.target.value)}
                    prefix={<SearchOutlined className="site-form-item-icon" />}
                />
                <div className={styles.circleList}>
                    <Tooltip placement="leftTop" title="我也想创建圈子">
                        <Button onClick={() => changeCircleModalVisible(true)} className={styles.button} type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
                    </Tooltip>
                    {
                        showCircleList.map((item, index) => (
                            <div key={item.id} className={styles.circleCard}>
                                <div className={styles.header}>
                                    <div className={styles.title}>
                                        <Avatar shape="square">{index}</Avatar>
                                        <h3 onClick={() => props.history.push(`circle/${item.id}`)} >{item.title}</h3>
                                    </div>
                                    <div className={styles.action}>
                                        <div onClick={() => doJoin(item.id, item.isjoin)} className={styles.join}>{item.isjoin ? '已加入' : <><PlusOutlined />加入</>}</div>
                                        <div className={styles.fans}>{item.fans}</div>
                                    </div>
                                </div>
                                <div onClick={() => props.history.push(`circle/${item.id}`)} className={styles.content}>
                                    <Paragraph ellipsis={{ rows: 3 }}>
                                        {item.msg}
                                    </Paragraph>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(Circle);