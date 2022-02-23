import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { AutoComplete, Button, Pagination, Space, Tree, Typography } from 'antd';
import { FolderOpenTwoTone, FolderOutlined, FolderTwoTone, SmileOutlined } from "@ant-design/icons";
import styles from './styles.module.css';

const { Title, Paragraph } = Typography;

const mockVal = (str: string, repeat: number = 1) => ({
    value: str.repeat(repeat),
});
const Complete: React.FC = () => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<{ value: string }[]>([{ value: 'foo' }, { value: 'bar' }]);
    const onSearch = (searchText: string) => {
        setOptions([{ value: searchText }])
    };
    const onSelect = (data: string) => {
        console.log('onSelect', data);
    };
    const onChange = (data: string) => {
        setValue(data);
    };
    return (
        <>
            <AutoComplete
                options={options}
                style={{ width: 200 }}
                onSelect={onSelect}
                onSearch={onSearch}
                placeholder="搜索圈子"
            />
        </>
    );
};

const treeData = [
    {
        title: '前端',
        key: '0-0',
        icon: (props: any) => (props.expand ? <FolderOutlined style={{ fontSize: '18px' }} /> : <FolderTwoTone style={{ fontSize: '18px' }} />),
        children: [
            {
                title: 'JavaScript',
                key: '0-0-0',
                icon: <SmileOutlined />,
                children: [
                    {
                        title: 'ECMAScript标准',
                        key: '0-0-0-0',
                        icon: (props: any) => (props.selected ? <FolderOutlined style={{ fontSize: '18px' }} /> : <FolderTwoTone style={{ fontSize: '18px' }} />),
                    },
                    {
                        title: 'React',
                        key: '0-0-0-1',
                        icon: <SmileOutlined />,
                    },
                    {
                        title: 'TypeScript',
                        key: '0-0-0-2',
                        icon: <SmileOutlined />,
                    },
                ],
            },
        ],
    },
];

const Circle = (props: any) => {
    const onSelect = (selectedKeys: React.Key[], info: any) => {
        console.log('selected', selectedKeys, info);
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.aside}>
                <Tree
                    showIcon
                    onSelect={onSelect}
                    treeData={treeData}
                    defaultExpandedKeys={['0-0-0']}
                    autoExpandParent
                    defaultSelectedKeys={['0-0-0-0']}
                    style={{ fontSize: '14px' }}
                />
            </div>
            <div className={styles.center}>
                <div className={styles.header}>
                    <Space>
                        <Complete />
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                    <Button type="link">找不到?点此创建</Button>
                </div>
                <div className={styles.content}>
                    {new Array(8).fill(0).map((item, index) => (
                        <div className={styles.card} onClick={()=>props.history.push(`/index/circle/${index}`)}>
                            <div className={styles.cardHeader}>
                                {/* <img className={styles.logo} src={require(`../../logo.svg`).default} /> */}
                                <Title level={4}>React</Title>
                            </div>
                            <div className={styles.cardContent}>
                                <Paragraph ellipsis={{ rows: 4,}}>
                                    Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team.
                                </Paragraph>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.footer}>
                    <Pagination defaultCurrent={1} total={1} />
                </div>
            </div>
        </div>
    );
};

export default withRouter(Circle)