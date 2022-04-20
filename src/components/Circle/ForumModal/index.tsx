import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Button, Input, List, Select, Space, Typography } from 'antd';
import { SisternodeOutlined } from '@ant-design/icons';
import ForumStore from '../../../store/ForumStore'
import { observer } from 'mobx-react';
import doRequest from '../../../interface/useRequests'

const { TextArea, } = Input;
const { Paragraph, } = Typography;

const enum STATUS {
    "WRITEING" = 0,
    "IMPIRTING" = 1,
}

const ForumModal = (props: any) => {
    const [status, changeStatus] = useState(STATUS['WRITEING']);
    const [importList, setImportList] = useState([] as any[]);
    const [labels, setLabels] = useState([] as any[]);

    useEffect(() => {
        let params = {
            url: '/circle/labels', type: 'GET', params: {
                circleid: props.circleid
            }
        };
        doRequest(params).then(res => setLabels(res.data));
    }, []); // eslint-disable-line

    const importForums = () => {
        if (status === STATUS['IMPIRTING']) {
            changeStatus(STATUS['WRITEING']);
            return;
        }
        changeStatus(STATUS['IMPIRTING']);
    }

    const importItem = (id: any) => {
        changeStatus(STATUS['WRITEING']);
        ForumStore.setContent(ForumStore.content + `\n###forum/${id}###\n`);
    }

    const onSelect = (value: any) => {
        let params = {
            url: '/circle/label/forum', type: 'GET', params: {
                circleid: props.circleid, labelid: value
            }
        };
        doRequest(params).then(res => setImportList(res.data));
    }

    return (
        <div className={styles.wrap}>
            <Space direction="vertical" style={{ width: '100%', }}>
                <Input onChange={e => ForumStore.setTitle(e.target.value)} value={ForumStore.title} style={{ fontSize: '20px' }} placeholder="请输入标题" bordered={false} />
                <Space style={{ width: '100%', paddingLeft: '15px' }}>
                    <Button icon={<SisternodeOutlined />} onClick={importForums} >{status === STATUS['WRITEING'] ? '点击引用' : '点击输入'}</Button>
                    {status === STATUS['IMPIRTING'] &&
                        <Select
                            showSearch
                            placeholder="请选择标签"
                            optionFilterProp="children"
                            size="small"
                            style={{ width: '200px' }}
                            onSelect={onSelect}
                        >
                            {labels.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>)}
                        </Select>}
                </Space>
                {
                    status === STATUS['WRITEING']
                        ?
                        <TextArea onChange={e => ForumStore.setContent(e.target.value)} className={styles.textarea} rows={7} value={ForumStore.content} />
                        :
                        <List
                            itemLayout="horizontal"
                            dataSource={importList}
                            bordered
                            style={{ margin: '12px' }}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a onClick={() => importItem(item.forumid)} key={item.forumid}>引用</a>]}
                                >
                                    <List.Item.Meta
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description={
                                            <Paragraph ellipsis>
                                                {item.content}
                                            </Paragraph>

                                        }
                                    />
                                </List.Item>
                            )}
                        />
                }
            </Space>
        </div>
    )
}

export default observer(ForumModal);