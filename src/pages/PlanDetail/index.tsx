import { CaretLeftOutlined, DoubleRightOutlined, } from '@ant-design/icons';
import { Button, Progress, Space, Spin, Typography } from 'antd';
import styles from './styles.module.css';
import planCover from '../../shared/images/public/learn0.png';
import { useEffect, useState } from 'react';
import DISABLED_LOGO from '../../shared/images/public/disabled.png'
import { withRouter } from 'react-router-dom';
import doRequest from '../../interface/useRequests';
import { PROBLEM_RANK_MAP } from '../../interface/Problem';

const { Paragraph, } = Typography;

const PlanDetail = (props: any) => {
    const [ellipsis, setEllipsis] = useState(true); // eslint-disable-line
    const [planDetail, setPlanDetail] = useState(null as any);
    const [problemList, setProblemList] = useState([] as []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        _init();// eslint-disable-next-line
    }, []);// eslint-disable-next-line

    const _init = () => {
        const params = {
            url: '/learn/plan/detail', type: 'GET', needAuth: true, params: { planid: props.match.params.id }
        }
        doRequest(params)
            .then(res => {
                setPlanDetail(res.data[0].detail);
                setProblemList(res.data[0].problemList);
                setLoading(false);
            });
    }

    return (
        <div className={styles.wrap}>
            {loading ?
                <Spin style={{ position: 'absolute', top: '50%', left: '50%' }} />
                : <Space direction="vertical" style={{ width: '100%', }}>
                    <div onClick={() => props.history.push('/index/learn')} className={styles.backTip}><CaretLeftOutlined />&nbsp;返回学习广场</div>
                    <div className={styles.header}>
                        <div className={styles.img}>
                            <img alt="plan" src={planCover} />
                        </div>
                        <div className={styles.direction}>
                            <div className={styles.title}>{planDetail.planname}</div>
                            <div className={styles.msg}>{planDetail.count}人已参加</div>
                            <div className={styles.labels}>
                                {
                                    planDetail.labels.split(',').map((label: any, index: number) => (
                                        <div className={styles.label} key={index}>{label}</div>
                                    ))
                                }
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }} className={styles.roundModal}>
                            <Progress
                                width={80}
                                type="circle"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={planDetail.rate}
                            />
                        </div>
                    </div>
                    <Paragraph style={{ fontSize: '16px' }} ellipsis={ellipsis ? { rows: 1, expandable: true, symbol: '展开' } : false}>
                        {planDetail.msg}
                    </Paragraph>
                    <div className={styles.partTitle}>第一部分</div>
                    <div className={styles.problemList}>
                        {
                            problemList.filter((item: any) => item.part === 1).map((item: any, index: number) => (
                                <div data-disabled={item.isdisabled === 1} className={styles.problemItem} key={item.problemid}>
                                    <div className={styles.left}>
                                        <div onClick={() => props.history.push(`/index/plan/problem/${props.match.params.id}/${item.problemid}`)} className={styles.title}>{index + 1}.  {item.problemname}</div>
                                    </div>
                                    {item.isdisabled === 1 && <div className={styles.icon}><img src={DISABLED_LOGO} alt="disabled" /></div>}
                                    <div data-rank={item.rankid} className={styles.rank}>{PROBLEM_RANK_MAP[item.rankid]}</div>
                                    <div className={styles.rate}>通过率:{item.problemrate}</div>
                                    <div className={styles.right}>
                                        {
                                            item.isdisabled
                                                ? <Button disabled icon={<DoubleRightOutlined />}>去做题</Button>
                                                : <Button icon={<DoubleRightOutlined />}>去做题</Button>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.partTitle}>第二部分</div>
                    <div className={styles.problemList}>
                        {
                            problemList.filter((item: any) => item.part === 2).map((item: any, index: number) => (
                                <div data-disabled={item.isdisabled === 1} className={styles.problemItem} key={item.problemid}>
                                    <div className={styles.left}>
                                        <div className={styles.title}>{index + 4}.  {item.problemname}</div>
                                    </div>
                                    {item.isdisabled === 1 && <div className={styles.icon}><img src={DISABLED_LOGO} alt="disabled" /></div>}
                                    <div data-rank={item.rankid} className={styles.rank}>{PROBLEM_RANK_MAP[item.rankid]}</div>
                                    <div className={styles.rate}>通过率:{item.problemrate}</div>
                                    <div className={styles.right}>
                                        {
                                            item.isdisabled
                                                ? <Button disabled icon={<DoubleRightOutlined />}>去做题</Button>
                                                : <Button icon={<DoubleRightOutlined />}>去做题</Button>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.partTitle}>第三部分</div>
                    <div className={styles.problemList}>
                        {
                            problemList.filter((item: any) => item.part === 3).map((item: any, index: number) => (
                                <div data-disabled={item.isdisabled === 1} className={styles.problemItem} key={item.problemid}>
                                    <div className={styles.left}>
                                        <div className={styles.title}>{index + 7}.  {item.problemname}</div>
                                    </div>
                                    {item.isdisabled === 1 && <div className={styles.icon}><img src={DISABLED_LOGO} alt="disabled" /></div>}
                                    <div data-rank={item.rankid} className={styles.rank}>{PROBLEM_RANK_MAP[item.rankid]}</div>
                                    <div className={styles.rate}>通过率:{item.problemrate}</div>
                                    <div className={styles.right}>
                                        {
                                            item.isdisabled
                                                ? <Button disabled icon={<DoubleRightOutlined />}>去做题</Button>
                                                : <Button icon={<DoubleRightOutlined />}>去做题</Button>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Space >}
        </div >
    )
}

export default withRouter(PlanDetail);