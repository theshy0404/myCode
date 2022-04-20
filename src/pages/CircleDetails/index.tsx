import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import { withRouter } from 'react-router-dom';
import { Avatar, Button, Input, message, Modal, Skeleton, Space, Tag, Typography } from 'antd';
import { DownOutlined, EditOutlined, EllipsisOutlined, LikeOutlined, StarOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import doRequest from '../../interface/useRequests';
import ForumStore from '../../store/ForumStore';
import AuthStore from '../../store/AuthStore';

const ForumModal = React.lazy(() => import('../../components/Circle/ForumModal'));
const { Search } = Input;
const { Paragraph, } = Typography;

class CircleDetails extends React.Component<any, any> {
    labelRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            isShowForumModal: false,
            active: 1,
            isSearch: false,
            labels: [1],
            isExpanded: false,
            isNeedExpand: false,
            forumList: [],
            rankList: []
        };
        this.labelRef = React.createRef();
        this.saveForum = this.saveForum.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            if (this.state.isSearch) this.setState({ isSearch: false })
        }, true);
        if (this.labelRef.current.clientHeight > 28) {
            this.setState({ isNeedExpand: true }, () => { console.log(this.state.forumList) })
        };
        this.init();
    }

    componentWillUnmount() {
        document.removeEventListener('click', () => {
            if (this.state.isSearch) this.setState({ isSearch: false })
        }, true)
    }

    handleChangeExpand() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    init = async () => {
        let params = {
            url: '/forums', type: 'GET', params: { circleid: this.props.match.params.id }
        }
        await doRequest(params).then((results) => {
            if (results.data.length === 0) return;
            let rankList = results.data.sort((a: any, b: any) => {
                return a.star - b.star;
            })
            rankList = rankList.slice(0, 9);
            console.log(results)
            this.setState({ forumList: results.data, rankList }, () => console.log(results.data));
        })
    }

    handleChangeForumModalShow() {
        this.setState({ isShowForumModal: !this.state.isShowForumModal })
    }

    saveForum() {
        if (!AuthStore.userid) return message.error('请先登录');
        const args = {
            circleid: this.props.match.params.id,
            userid: AuthStore.userid,
        };
        ForumStore.addForum(args)
            .then(() => {
                message.success('已提交');
                this.setState({ isShowForumModal: false });
            })
            .catch(() => {
                message.error('出错了');
            });
    }

    render() {
        const tabs = [
            { id: 1, title: '最新' },
            { id: 22, title: '最热' }
        ];
        const labels: any[] = []
        return (
            <div className={styles.wrap}>
                <div className={styles.center}>
                    <div className={styles.header}>
                        <div className={styles.tabs}>
                            {tabs.map((tab) => <div data-active={tab.id === this.state.active} key={tab.id} className={styles.tab}>{tab.title}</div>)}
                        </div>
                        <div className={styles.input}>
                            <Space>
                                <Search placeholder="搜索" onClick={e => { e.stopPropagation(); this.setState({ isSearch: true }); }} className={styles.search} style={this.state.isSearch ? { width: 400 } : { width: 200 }} />
                                <Button onClick={() => this.handleChangeForumModalShow()} type="primary" shape="round" icon={<EditOutlined />} >
                                    写一写
                                </Button>
                                <Modal
                                    title={<>新增</>}
                                    visible={this.state.isShowForumModal}
                                    onCancel={() => this.handleChangeForumModalShow()}
                                    cancelText="关闭"
                                    okText="提交"
                                    width={700}
                                    onOk={this.saveForum}
                                >
                                    <React.Suspense fallback={<Skeleton />}>
                                        <ForumModal circleid={this.props.match.params.id} />
                                    </React.Suspense>
                                </Modal>
                            </Space>
                        </div>
                    </div>
                    <div ref={this.labelRef} className={styles.labels} style={this.state.isNeedExpand ? this.state.isExpanded ? {} : { height: '28px' } : {}} >
                        {this.state.isNeedExpand ? <>
                            {
                                this.state.isExpanded
                                    ? <Button className={styles.expandButton} onClick={() => this.handleChangeExpand()} icon={<UpOutlined />} type="text">收起</Button>
                                    : <Button className={styles.expandButton} onClick={() => this.handleChangeExpand()} icon={<DownOutlined />} type="text">展开</Button>
                            }</>
                            : null}
                        {labels.map(item => <div data-active={this.state.labels.includes(item.id)} key={item.id} className={styles.label}>{item.msg}</div>)}
                    </div>
                    {this.state.forumList.map((item: any,) => (
                        <div key={item.forumid} className={styles.card}>
                            <div className={styles.header}>
                                <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} />
                                <div className={styles.title}>{item.title}</div>
                                <div>
                                    {item.isrecommend === 1 && <Tag color="success">推荐</Tag>}
                                    {item.istop === 1 && <Tag color="processing">置顶</Tag>}
                                    {item.isofficial === 1 && <Tag color="error">官方</Tag>}
                                </div>
                            </div>
                            <div className={styles.labels}>
                                {item.labels !== '' && item.labels.split(',').map((item: string, index: number) => <div style={{ color: '#57606a' }} key={index} className={styles.label}>{item}</div>)}
                            </div>
                            <div className={styles.content}>
                                <Paragraph onClick={() => this.props.history.push(`/index/forum/${item.forumid}`)} style={{ cursor: 'pointer' }} ellipsis={{ rows: 1, }}>
                                    {item.content.replace(/###(\S*)###/g, '')}
                                </Paragraph>
                            </div>
                            <div className={styles.footer}>
                                <div>
                                    <div className={styles.iconText}>
                                        <LikeOutlined style={{ fontSize: '18px', marginRight: '5px' }} />{item.good}
                                    </div>
                                    <div className={styles.iconText}>
                                        <StarOutlined style={{ fontSize: '18px', marginRight: '5px' }} />{item.star}
                                    </div>
                                </div>
                                <div className={styles.iconText}><EllipsisOutlined style={{ fontSize: '18px' }} /></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.aside}>
                    <div className={styles.card}>
                        <div className={styles.header}><span className={styles.ranknoTitle}>推荐榜</span></div>
                        <div className={styles.rankno}>
                            {this.state.rankList.map((item: any, index: number) => (
                                <div key={item.forumid} className={styles.item}>
                                    <div data-hot={index < 3} className={styles.index}>{index}</div>
                                    <div className={styles.content}>
                                        <div className={styles.title}>{item.title}</div>
                                        <div className={styles.description}>
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(CircleDetails);
