import styles from './styles.module.css';
import { withRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import doRequest from '../../interface/useRequests';
import Null from '../../shared/images/state/Null.png';
import AuthStore from '../../store/AuthStore';
import { message } from 'antd';

const LearnPage = (props: any) => {
    const [planList, setPlanList] = useState([] as any[]);
    const [myPlanList, setMyPlanList] = useState([] as any[]);

    useEffect(() => {
        doRequest({
            url: '/learn/plan', type: 'GET',
        }).then(res => setPlanList(res.data));
    }, []);

    useEffect(() => {
        if (AuthStore.isLogin) getMyPlanList();
    }, []);

    const getMyPlanList = () => {
        const params = {
            url: '/learn/plan/mine', type: 'GET', params: {
                userid: AuthStore.userid
            }
        }
        doRequest(params).then(res => setMyPlanList(res.data));
    }

    const doJoinLearn = (id: string) => {
        if (!AuthStore.isLogin) { return message.warning('请先登录'); }
        if (myPlanList.map(item => item.planid).includes(id)) return;
        const params = {
            url: '/learn/plan/mine', type: 'POST', needAuth: true, params: { planid: id }
        }
        doRequest(params).then(res => {
            setMyPlanList(res.data);
            message.success('加入学习计划成功')
        });
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.line}>
                <h2>学习广场</h2>
                <div className={styles.listTitle}>我的计划</div>
                <div className={styles.planList}>
                    {
                        myPlanList.length > 0 ?
                            myPlanList.map((item: any, index: number) => {
                                return (
                                    <div key={item.planid}>
                                        <div onClick={() => props.history.push(`/index/plan/${item.planid}`)} className={styles.planCard}>
                                            <img alt="plan" src={require('../../shared/images/public/learn' + index + '.png').default} />
                                            <div className={styles.footer}>
                                                已经完成 {item.rate} %
                                            </div>
                                        </div>
                                        <div className={styles.title}>{item.planname}</div>
                                    </div>
                                )
                            })
                            : <img style={{ width: '120px' }} alt="null" src={Null} />
                    }
                </div>
                <div className={styles.listTitle}>学习计划</div>
                <div className={styles.planList}>
                    {
                        planList.map((item: any, index: number) => {
                            return (
                                <div key={item.planid} >
                                    <div className={styles.planCard}>
                                        <img alt="plan.png" src={require('../../shared/images/public/learn' + index + '.png').default} />
                                        <div onClick={() => doJoinLearn(item.planid)} className={styles.footer}>
                                            {myPlanList.map(item => item.planid).includes(item.planid) ? '已经加入' : '加入学习'}
                                        </div>
                                    </div>
                                    <div className={styles.title}>{item.planname}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(LearnPage);