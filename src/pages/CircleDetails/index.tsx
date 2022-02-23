import React from 'react';
import styles from './styles.module.css';
import '../../App.css'
import { withRouter } from 'react-router-dom';
import { Avatar, Button, Input, Space, Tag, Typography } from 'antd';
import { DownOutlined, EditOutlined, EllipsisOutlined, LikeOutlined, MessageOutlined, StarOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Paragraph, } = Typography;

class CircleDetails extends React.Component<any, any> {
    labelRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = { active: 1, isSearch: false, labels: [1], isExpanded: false, isNeedExpand: false };
        this.labelRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            if (this.state.isSearch) this.setState({ isSearch: false })
        }, true);
        if (this.labelRef.current.clientHeight > 28) {
            this.setState({ isNeedExpand: true })
        };
    }

    componentWillUnmount() {
        document.removeEventListener('click', () => {
            if (this.state.isSearch) this.setState({ isSearch: false })
        }, true)
    }

    handleChangeExpand() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    render() {
        const tabs = [
            { id: 1, title: '最新' },
            { id: 22, title: '最热' }
        ];
        const labels = [
            { id: 1, msg: '双指针' },
            { id: 2, msg: '双指针贞' },
            { id: 3, msg: '双指贞' },
            { id: 4, msg: '双针贞' },
            { id: 5, msg: '指针贞' },
            { id: 6, msg: '指针贞' },
            { id: 7, msg: '指针贞' },
            { id: 8, msg: '指针贞' },
            { id: 9, msg: '双指针' },
            { id: 10, msg: '双指针' },
            { id: 11, msg: '双指针' },
            { id: 12, msg: '双指针' },
            { id: 1, msg: '双指针' },
            { id: 2, msg: '双指针' },
            { id: 3, msg: '双指针' },
            { id: 4, msg: '双指针' },
            { id: 5, msg: '双指针' },
            { id: 6, msg: '双指针' },
            { id: 7, msg: '双指针' },
            { id: 8, msg: '双指针' },
            { id: 9, msg: '双指针' },
            { id: 10, msg: '双指针' },
            { id: 11, msg: '双指针' },
            { id: 12, msg: '双指针' },
        ]
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
                                <Button type="primary" shape="round" icon={<EditOutlined />} >
                                    发起讨论
                                </Button>
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
                    {[1, 2].map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.header}>
                                <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} />
                                <div className={styles.title}>提问:有关暑期实习的问题</div>
                                <div>
                                    <Tag color="success">推荐榜</Tag>
                                    <Tag color="processing">置顶</Tag>
                                    <Tag color="error">官方</Tag>
                                </div>
                            </div>
                            <div className={styles.labels}>
                                {['实习', '暑假'].map((item, index) => <div style={{ color: '#57606a' }} key={index} className={styles.label}>{item}</div>)}
                            </div>
                            <div className={styles.content}>
                                <Paragraph ellipsis={{ rows: 2, }}>
                                    Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team. Ant
                                    Design, a design language for background applications, is refined by Ant UED Team.
                                </Paragraph>
                            </div>
                            <div className={styles.footer}>
                                <div>
                                    <div className={styles.iconText}>
                                        <LikeOutlined style={{ fontSize: '18px', marginRight: '5px' }} />1
                                    </div>
                                    <div className={styles.iconText}>
                                        <MessageOutlined style={{ fontSize: '18px', marginRight: '5px' }} />1
                                    </div>
                                    <div className={styles.iconText}>
                                        <StarOutlined style={{ fontSize: '18px', marginRight: '5px' }} />1
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
                            {new Array(9).fill(0).map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <div data-hot={index < 3} className={styles.index}>{index}</div>
                                    <div className={styles.content}>
                                        <div className={styles.title}>前端面试八股文</div>
                                        <div className={styles.description}>
                                            足利大将军足利大...
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
