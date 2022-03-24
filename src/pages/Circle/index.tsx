import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {  Button, Pagination, Select, Space, Tree, Typography } from 'antd';
import doRequest from '../../interface/useRequests'
import styles from './styles.module.css';
import { BarsOutlined, FileOutlined,  } from "@ant-design/icons";

const { Option } = Select;
const { Title, Paragraph } = Typography;

const getColor = () => {
    const colors = new Array(7).fill(0).map((item, index) => index);
    return require(`../../shared/images/circle/${colors[Math.floor((Math.random() * colors.length))]}.svg`);
}

const Complete = (props: any) => {

    const options = props.circles.map((item: any) => {
        return {
            value: item.circleid,
            label: item.circlename,
        }
    });

    const onSelect = (data: string) => {
        props.doSearch(data);
    };
    return (
        <>
            <Select onChange={onSelect} style={{ width: 200 }}>
                {options.map((item: any) => (
                    <Option key={item.key} value={item.value}>{item.label}</Option>
                ))}
            </Select>
        </>
    );
};

const Circle = (props: any) => {
    const [tree, setTree] = useState([]);
    const [circles, setCircles] = useState([] as any[]);
    const [leaf, setLeaf] = useState([] as any[]);
    useEffect(() => {
        let args = {
            url: '/circle', type: 'GET'
        }
        doRequest(args)
            .then(results => {
                let { data } = results;
                setLeaf(data.filter((item: any) => item.level === 2))
                function toTreeNode(node: any, data: any) {
                    return {
                        key: node.circleid,
                        level: node.level,
                        msg: node.msg,
                        title: node.circlename,
                        parentid: node.parentid,
                        icon: node.hasChildren === 1 ? <BarsOutlined /> : <FileOutlined />,
                        children: node.hasChildren === 1 ? data.filter((item: any) => item.parentid === node.circleid).map((item: any) => toTreeNode(item, data)) : [],
                    }
                }
                setCircles(data.filter((item: any) => item.level === 2));
                data = data.filter((item: any) => item.level === 0).map((item: any) => toTreeNode(item, data));
                setTree(data);
            })
    }, [])

    const onSelect = (selectedKeys: React.Key[], info: any) => {
        if (info.node.level === 2) return props.history.push(`/index/circle/${selectedKeys}`);
        setCircles(findCircles(info.node))
    };

    const findCircles = (node: any) => {
        if (node.level === 0) {
            const root: any = tree.find((item: any) => node.key === item.key);
            if (!root) return [];
            let results: any = [];
            root.children.forEach((child: any) => {
                child.children.forEach((item: any) => results.push(item))
            });
            return results;
        }
        const root: any = tree.find((item: any) => node.parentid === item.key);
        return root.children.find((item: any) => item.key === node.key).children;
    }

    const doSearch = (value: any) => {
        console.log("doSearch")
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.aside}>
                <Tree
                    showIcon
                    onSelect={onSelect}
                    treeData={tree}
                    autoExpandParent
                    style={{ fontSize: '14px' }}
                />
            </div>
            <div className={styles.center}>
                <div className={styles.header}>
                    <Space>
                        <Complete doSearch={doSearch} circles={leaf} />
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                    <Button type="link">找不到?点此创建</Button>
                </div>
                {circles.length > 0 && <>
                    <div className={styles.content}>
                        {circles.map((item: any, index) => (
                            <div key={item.circleid} className={styles.card} onClick={() => props.history.push(`/index/circle/${item.circleid}`)}>
                                <div className={styles.cardHeader}>
                                    <Title level={4}>{item.circlename || item.title}</Title>
                                    <Paragraph ellipsis={{ rows: 1, }}>
                                        {item.msg}
                                    </Paragraph>
                                </div>
                                <div className={styles.cardContent}>
                                    <img alt="" style={{ height: '100%' }} className={styles.logo} src={getColor().default} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <Pagination defaultCurrent={1} total={1} />
                    </div>
                </>}
            </div>
        </div>
    );
};

export default withRouter(Circle)