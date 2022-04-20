import { AntDesignOutlined, CheckOutlined, CloseOutlined, CommentOutlined, DoubleRightOutlined, EditOutlined, FormOutlined, HeartOutlined, LikeOutlined,  LoadingOutlined,  SisternodeOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Empty, List, Modal, Popover, Select, Skeleton, Space, Spin,Tooltip, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styles from './styles.module.css';
import doRequest from '../../interface/useRequests'

const { Paragraph, Title, } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Comment = (props: any) => {
    const [isReply, handleChangeIsReply] = useState(false);
    const [comments, setComments] = useState([]);
    const [isExpand, handleChangeIsExpand] = useState(false);
    const handleChangeExpand = () => handleChangeIsExpand(!isExpand);
    useEffect(() => {
        if (isExpand) {
            const params = {
                url: '/forum/comments', type: 'GET', params: {
                    commentid: props.id
                }
            }
            doRequest(params).then(result => setComments(result.data))
        }
    }, [isExpand]);  // eslint-disable-line
    return (
        <div className={styles.card} style={props.isInner ? { boxShadow: 'none', backgroundColor: 'rgba(247,248,250,1)', color: '#57606a' } : {}}>
            <div className={styles.header} style={{ justifyContent: 'space-between' }}>
                <div className={styles.user}>
                    <Avatar style={{ backgroundColor: '#87d068', marginRight: '15px' }} icon={<UserOutlined />} />
                    <div style={{ marginRight: '15px' }} className={styles.commentUser}>{props.comment.username}</div></div>
                <div className={styles.commentUser}>一周前</div>
            </div>
            <div className={styles.content}>
                <Paragraph>
                    {props.comment.content}
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
                    {!props.isInner && <div onClick={handleChangeExpand} className={styles.iconText}>
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
            {isExpand && comments.map((item, index) => <Comment comment={item} isInner key={index}></Comment>)}
        </div>
    )
}

const ImportCard = (props: any) => {
    const [loading, changeLoading] = useState(true);
    const [info, setInfo] = useState({} as any);
    const [type, setType] = useState('');

    useEffect(() => {
        const result = props.value.split('/');
        console.log({
            type: result[0],
            id: result[1],
        })
        let params = {
            url: '/forumorcomment', type: 'GET', params: {
                type: result[0],
                id: result[1],
            }
        }
        doRequest(params).then(res => {
            setType(result[0]);
            changeLoading(false);
            setInfo(res.data[0]);
        });
    }, []); // eslint-disable-line 

    useEffect(() => {
        console.log(info)
    },[info])

    return (
        <div className={styles.import}>
            <div className={styles.importCard}>
                <Skeleton active title={false} paragraph={{ width: [200, 300], rows: 2 }} loading={loading}>
                    {
                        type === 'forum'
                            ? <Tooltip placement="top" title="点击跳转至文章页">
                                <div onClick={() => props.history.push(`/index/forum/${info.forumid}`)}>
                                    <Title level={5}>{info.title}</Title>
                                    <Paragraph style={{ color: '#57606a' }} ellipsis>
                                        {info.content}
                                    </Paragraph>
                                </div>
                            </Tooltip>
                            :
                            <Popover content={info.content} title={info.username + '的回复:'} trigger="hover">
                                <div>
                                    <Title level={5}>{info.username + '的回复:'}</Title>
                                    <Paragraph style={{ color: '#57606a' }} ellipsis>
                                        {info.content}
                                    </Paragraph>
                                </div>
                            </Popover>
                    }
                </Skeleton>
            </div>
        </div>
    )
}

class Forum extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { id: this.props.match.params.id, isReply: false, loading: true, comments: [], forum: {}, isModalVisible: false, isShowForumModal: false };
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps: any) {
        if (this.state.id !== this.props.match.params.id) {
            this.setState({id:this.props.match.params.id})
            this.init();
        }
    }

    handleChangeModalVisible() {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    init(id = this.props.match.params.id) {
        const params = {
            url: '/forum', type: 'GET', params: { forumid: id }
        };
        const getForum = doRequest(params);
        const args = {
            url: '/forum/comment', type: 'GET', params: { forumid: id }
        };
        const getComment = doRequest(args);
        Promise.all([getForum, getComment])
            .then(result => this.setState({ forum: result[0].data[0], comment: result[1].data, loading: false }));
    }

    getContent(content: string) {
        let result = content.match(/###(\S*)###/g);
        let newContent = content.replace(/###(\S*)###/g, '<mya>').split('<mya>');
        return (
            <>
                {newContent.map((item: any, index: number) => {
                    return (
                        <>
                            <Paragraph key={index}>
                                <Space direction="vertical" style={{ width: '100%', }}>
                                    {item}
                                    {(result && result[index] !== undefined) &&
                                        <ImportCard history={this.props.history} value={result[index].replaceAll('#', '')} />
                                    }
                                </Space>
                            </Paragraph>
                        </>
                    )
                })}
            </>
        );
    }

    render() {
        const data = [
            {
                title: 'Ant Design Title 1',
            },
            {
                title: 'Ant Design Title 2',
            },
            {
                title: 'Ant Design Title 3',
            },
            {
                title: 'Ant Design Title 4',
            },
        ];
        if (this.state.loading) return <Spin style={{ position: 'absolute', left: '50%', top: '50%' }} indicator={antIcon} />;
        const { forum, comment, isModalVisible } = this.state;
        return (
            <div className={styles.wrap}>
                <Modal width={1200} title="引用文章" visible={isModalVisible} onCancel={() => this.handleChangeModalVisible()}>
                    <Space direction="vertical" style={{ width: '100%', }} size="large">
                        <Select size="small" defaultValue="a1" style={{ width: '100%' }}>
                        </Select>
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            style={{ height: '200px', overflow: 'auto' }}
                            renderItem={item => (
                                <List.Item
                                    actions={[<a key="list-loadmore-edit">引用</a>, <a key="list-loadmore-more">查看</a>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                </List.Item>
                            )}
                        />
                    </Space>
                </Modal>
                <div className={styles.center}>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <Avatar style={{ backgroundColor: '#24292f' }} icon={<AntDesignOutlined />} />
                            <span className={styles.title}>{forum.title}</span>
                            {forum.isofficial === 1 && <span className={styles.officalTag}>官方</span>}
                        </div>
                        <Paragraph >
                            {this.getContent(forum.content)}
                        </Paragraph>
                        {/* {true && <Code />} */}
                        {/* <Editor style={{ border: 'none', boxShadow: 'none', height: '320px', marginTop: '-50px' }} preview value={forum.content} /> */}
                        <Divider style={{ margin: '15px 0px' }} />
                        <div className={styles.footer}>
                            <div className={styles.action}>
                                <div className={styles.iconText}>
                                    <LikeOutlined style={{ fontSize: '20px' }} />
                                    <span style={{ marginLeft: '5px' }}>0</span>
                                </div>
                                <div className={styles.iconText}>
                                    <StarOutlined style={{ fontSize: '20px' }} />
                                    <span style={{ marginLeft: '5px' }}>0</span>
                                </div>
                                <span className={styles.replyCount}>共{comment.length}条回复</span>
                            </div>
                            <div className={styles.reply}>
                                <div onClick={() => this.setState({ isReply: true })} className={styles.replyButton}><FormOutlined style={{ fontSize: '14px', marginRight: '5px' }} />回复本题解</div>
                            </div>
                        </div>
                    </div>
                    {this.state.isReply && <div className={styles.card}>
                        <div className={styles.header} style={{ justifyContent: 'space-between' }}>
                            <Button onClick={() => this.handleChangeModalVisible()} size="small" icon={<SisternodeOutlined />}>引用</Button>
                            <Space style={{ margin: '5px 0px 10px 0px' }}>
                                <Button size="small" type="primary" icon={<CheckOutlined />}>回复</Button>
                                <Button onClick={() => this.setState({ isReply: false })} size="small" icon={<CloseOutlined />} >取消</Button>
                            </Space>
                        </div>
                        <TextArea style={{ marginBottom: '10px' }} rows={4} />
                    </div>}
                    {comment.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无回复" />}
                    {comment.map((item: any) =>
                        <Comment id={item.commentid} comment={item} key={item.commentid}>
                        </Comment>)}
                </div>
            </div>
        )
    }

}

export default withRouter(Forum);