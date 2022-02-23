import { AntDesignOutlined, BulbTwoTone, CheckOutlined, CloseOutlined, CommentOutlined, DashboardOutlined, DoubleRightOutlined, EditOutlined, ExclamationCircleOutlined, ExclamationCircleTwoTone, FormOutlined, HeartOutlined, LikeOutlined, LinkOutlined, SelectOutlined, StarFilled, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Space, Tag, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import styles from './styles.module.css';

const { Paragraph, Title, Text } = Typography;

const Comment = (props: any) => {
    const [isReply, handleChangeIsReply] = useState(false);
    const [isExpand, handleChangeIsExpand] = useState(false);
    const handleChangeExpand = () => handleChangeIsExpand(!isExpand);
    return (
        <div className={styles.card} style={props.isInner?{boxShadow:'none',backgroundColor:'rgba(247,248,250,1)',color:'#57606a'}:{}}>
            <div className={styles.header} style={{ justifyContent: 'space-between' }}>
                <div className={styles.user}>
                    <Avatar style={{ backgroundColor: '#87d068', marginRight: '15px' }} icon={<UserOutlined />} />
                    <div style={{ marginRight: '15px' }} className={styles.commentUser}>测试1</div></div>
                <div className={styles.commentUser}>一周前</div>
            </div>
            <div className={styles.content}>
                <Paragraph>
                    In the process of internal desktop applications development, many different design specs and
                    implementations would be involved, which might.
                </Paragraph>
                {isReply && <TextArea rows={3} />}
            </div>
            <div className={styles.footer}>
                <div className={styles.action}>
                    <div className={styles.iconText}>
                        <LikeOutlined style={{ fontSize: '20px' }} />
                        <span style={{ marginLeft: '5px' }}>点赞</span>
                    </div>
                    <div className={styles.iconText}>
                        <HeartOutlined style={{ fontSize: '20px' }} />
                        <span style={{ marginLeft: '5px' }}>收藏</span>
                    </div>
                    {!props.isInner&&<div onClick={handleChangeExpand} className={styles.iconText}>
                        {isExpand ?
                            <>
                                <DoubleRightOutlined style={{ fontSize: '20px', transform: 'rotate(-90deg)' }} />
                                <span style={{ marginLeft: '5px' }}>收起评论</span>
                            </> :
                            <>
                                <CommentOutlined style={{ fontSize: '20px' }} />
                                <span style={{ marginLeft: '5px' }}>评论(1)</span>
                            </>}
                    </div>}
                </div>
                <div className={styles.action}>
                    {!isReply ?
                        <div onClick={() => handleChangeIsReply(true)} className={styles.iconText}>
                            <EditOutlined style={{ fontSize: '20px' }} />
                            <span style={{ marginLeft: '5px' }}>回复</span>
                        </div> :
                        <>
                            <div onClick={() => handleChangeIsReply(false)} className={styles.iconText}>
                                <CloseOutlined style={{ fontSize: '15px' }} />
                                <span style={{ marginLeft: '5px' }}>取消</span>
                            </div>
                            <div className={styles.iconText}>
                                <CheckOutlined style={{ fontSize: '15px' }} />
                                <span style={{ marginLeft: '5px' }}>确认回复</span>
                            </div>
                        </>}
                </div>
            </div>
            {isExpand && props.children}
        </div>
    )
}

const Code = () => {
    const str = `function sum(a,b){\n\t\treturn a + b;\n}`;
    let html: any[] = [];
    let lines = str.split("\n");
    lines.forEach((line, index) => html[index] = line.replace('\t', '&nbsp;&nbsp;'))
    return (
        <div className={styles.code}>
            {html.map((line, index) => <p dangerouslySetInnerHTML={{ __html: line }} key={index}></p>)}
        </div>
    )
}

class Solution extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { isReply: false }
    }

    render() {
        return (
            <div className={styles.wrap}>
                <div className={styles.center}>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <Avatar style={{ backgroundColor: '#24292f' }} icon={<AntDesignOutlined />} />
                            <span className={styles.title}>简单模拟题</span>
                            <span className={styles.officalTag}>官方</span>
                        </div>
                        <div className={styles.description}>
                            <span>MyCode</span>
                            <span><DashboardOutlined />发布于一小时前</span>
                            <span className={styles.languageTag}>javascript</span>
                        </div>
                        <Paragraph >
                            Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team. Ant
                            Design, a design language for background applications, is refined by Ant UED Team.
                        </Paragraph>
                        {true && <Code />}
                        <Divider style={{ margin: '15px 0px' }} />
                        <div className={styles.footer}>
                            <div className={styles.action}>
                                <div className={styles.iconText}>
                                    <LikeOutlined style={{ fontSize: '20px' }} />
                                    <span style={{ marginLeft: '5px' }}>33</span>
                                </div>
                                <div className={styles.iconText}>
                                    <StarOutlined style={{ fontSize: '20px' }} />
                                    <span style={{ marginLeft: '5px' }}>33</span>
                                </div>
                                <span className={styles.replyCount}>共37条回复</span>
                            </div>
                            <div className={styles.reply}>
                                <div onClick={() => this.setState({ isReply: true })} className={styles.replyButton}><FormOutlined style={{ fontSize: '14px', marginRight: '5px' }} />回复本题解</div>
                            </div>
                        </div>
                    </div>
                    {this.state.isReply && <div className={styles.card}>
                        <div className={styles.header} style={{ justifyContent: 'space-between' }}>
                            <Space>s</Space>
                            <Space style={{ margin: '5px 0px 10px 0px' }}>
                                <Button size="small" type="primary" icon={<CheckOutlined />}>回复</Button>
                                <Button onClick={() => this.setState({ isReply: false })} size="small" icon={<CloseOutlined />} >取消</Button>
                            </Space>
                        </div>
                        <TextArea style={{ marginBottom: '10px' }} rows={4} />
                    </div>}
                    {[1, ].map((item, index) => <Comment key={index}>
                        {[1, ].map((item, index) => <Comment isInner key={index}>
                        </Comment>)}
                    </Comment>)}
                </div>
                <div className={styles.aside}>
                    <div className={styles.card}>
                        <Title level={4}>题目:简单模拟题</Title>
                        <Text
                            ellipsis={{ tooltip: '点击做题' }}
                            style={{ cursor: 'pointer' }}
                        >
                            Ant Design, a design language for background applications, is refined by Ant UED Team.
                        </Text>
                        <Divider style={{ margin: '8px 0px' }} />
                        {[1, 1, 1, 1, 1, 1].map((item, index) => (
                            <Tag style={{ marginBottom: '8px' }}>
                                <a href="https://github.com/ant-design/ant-design/issues/1862">双指针</a>
                            </Tag>))}
                    </div>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <div className={styles.modalTitle}>
                                <BulbTwoTone twoToneColor="#52c41a" style={{ fontSize: '18px', marginRight: '5px' }} />
                                <span>其他题解</span>
                            </div>
                        </div>
                        {[1, 1, 1, 1, 1, 1].map((item, index) => (
                            <div key={index} className={styles.item}>
                                <Avatar size={28} style={{ backgroundColor: '#87d068', marginRight: '8px' }} icon={<UserOutlined />} />
                                <Text ellipsis={{ tooltip: '查看题解' }}>
                                    Ant Design, a design language for background applications, is refined by Ant UED Team.
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Solution)