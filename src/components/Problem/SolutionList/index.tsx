import { AntDesignOutlined, LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Divider, List, Skeleton, Space, Tag, Typography, } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { LANGUAGE_MAP } from "../../../interface/Problem";
import styles from './styles.module.css';

const { Text } = Typography;

class SolutionList extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { loading: true }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.setState({ replys: [], loading: false })
    }

    render() {
        const { loading } = this.state;
        const IconText = (props: any) => (
            <Space>
                {React.createElement(props.icon)}
                {props.text}
            </Space>
        );
        if (loading) return <Skeleton avatar paragraph={{ rows: 4 }} />
        return (
            <>
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    style={{ cursor: 'pointer' }}
                    dataSource={this.props.solutions}
                    renderItem={(item: any) => (
                        <List.Item
                            key={item.solutionid}
                            onClick={() => this.props.history.push(`/index/solution/${item.solutionid}`)}
                            actions={[
                                <IconText icon={StarOutlined} text={item.good} key="list-vertical-star-o" />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />}
                                title={
                                    <Space>
                                        <a style={{color: 'black'}}href={`${this.props.history.location}/index/solution/${item.solutionid}`}>{item.title}</a>
                                        {item.isofficial === 1 && <Tag style={{ fontSize: '14px' }} color="warning">官方</Tag>}
                                    </Space>}
                                description={<div>
                                    <Tag color="success">{LANGUAGE_MAP[item.language]}</Tag>
                                    {item.hasCode===1 && <Tag color="processing">附代码</Tag>}
                                    {item.labels.split(',').map((label: any) => <Tag key={label}>{label}</Tag>)}
                                </div>}
                            />
                            <Text
                                style={{ width: '100%' }}
                                ellipsis={{ tooltip: '点击跳转' }}
                            >
                                {item.content}
                            </Text>
                        </List.Item>
                    )}
                />
            </>
        )
    }
}

export default withRouter(SolutionList)