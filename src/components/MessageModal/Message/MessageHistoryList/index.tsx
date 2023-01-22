import { Empty, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import LOADING_GIF from '../../../../shared/images/public/LOADING_GIF.gif';
import UserMessageStore from '../../../../store/UserMessageStore';
import doRequest from '../../../../interface/useRequests';
import NULL_PNG from '../../../../shared/images/state/Null.png';
import AuthStore from '../../../../store/AuthStore';

const MessageHistoryList = (props: any) => {
    const [loading, changeLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [messageList, setMessageList] = useState([] as any[]);

    useEffect(() => {
        getMessage(page);
    }, [page]);

    const getMessage = (pageno: number) => {
        changeLoading(true);
        const params = {
            url: '/user/message/history', type: 'GET', needAuth: true,
            params: { id: UserMessageStore.activeUser, page: pageno, },
        }
        doRequest(params).then(res => {
            const results = res.data[0];
            setTotal(results.total);
            setMessageList(results.messageList);
        }).finally(() => changeLoading(false))
    }

    const onChangePage = (pageno: number) => {
        setPage(pageno);
    }

    return (
        <div className={styles.wrap}>
            {
                loading
                    ?
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', }} >
                        <img style={{ width: '70%', height: '70%', marginTop: '0px' }} src={LOADING_GIF} alt="loading..." />
                    </div >
                    :
                    <>
                        <div className={styles.content}>
                            {
                                total === 0 &&
                                <Empty image={NULL_PNG} description="暂无聊天记录" />
                            }
                            {
                                messageList.map((item: any, index: number) => {
                                    return (
                                        <div key={item.id} className={styles.messageItem}>
                                            <div className={styles.title}>{item.userid === AuthStore.userid ? '【我】' : ''}{item.title}</div>
                                            <div className={styles.message}>{item.message}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.footer}>
                            <Pagination current={page} onChange={onChangePage} size="small" pageSize={10} total={total} showTotal={total => "共有" + total + "条消息记录"} />
                        </div>
                    </>
            }
        </div>)
}

export default MessageHistoryList;