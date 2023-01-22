import { CommentOutlined, SearchOutlined, SendOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Badge, Drawer, Input, message as antdMessage, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { WaterMark } from '@ant-design/pro-layout';
import UserAvatar from '../../../shared/images/public/user.png';
import UserMessageStore from '../../../store/UserMessageStore';
import { observer } from 'mobx-react';
import AuthStore from '../../../store/AuthStore';
import doRequest from '../../../interface/useRequests';
import LOADING_GIF from '../../../shared/images/public/LOADING_GIF.gif';
import CAT_PNG from '../../../shared/images/public/CAT.png';
import MessageHistoryList from './MessageHistoryList';
import './antd.css';

const MessageContent = observer((props: any) => {
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null as any);
    const [message, changeMessage] = useState('');
    const [isMessageHistoryListShow, changeShow] = useState(false);

    const messageRef = useRef(null as any);

    useEffect(() => {
        _init();
    }, [props.activeUser]);  // eslint-disable-line

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView();
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    });  // eslint-disable-line

    const _init = async (): Promise<void> => {
        const params = {
            url: '/user/message/detail', type: 'GET', needAuth: true, params: {
                id: props.activeUser
            }
        }
        doRequest(params).then(res => {
            setDetail(res.data[0]);
            setLoading(false);
            UserMessageStore.setMessageList(res.data[0].messages);
            messageRef.current.scrollIntoView();
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        })
    }

    const renderMessage = (message: any) => {
        if (message.isowned) {
            return (
                <div key={message.id} data-mine="true" className={styles.messageItem}>
                    <div className={styles.time}>{message.time}</div>
                    <div className={styles.body}>
                        <div className={styles.icon}>
                            <Avatar size={36} src={UserAvatar} />
                        </div>
                        <div className={styles.message}>
                            {message.content}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div key={message.id} className={styles.messageItem}>
                <div className={styles.time}>{message.time}</div>
                <div className={styles.body}>
                    <div className={styles.icon}>
                        <Avatar size={36} src={CAT_PNG} />
                    </div>
                    <div className={styles.message}>
                        {message.content}
                    </div>
                </div>
            </div>
        )
    }

    const onSendMessage = () => {
        if (message === '') return antdMessage.warning('不可为空');
        UserMessageStore.sendMessage(message, props.activeUser);
        changeMessage('');
    }

    const onMessageDrawerClose = () => {
        changeShow(false);
    }
    const onMessageDrawerOpen = () => {
        changeShow(true);
    }

    return (
        <div className={styles.content}>
            {
                loading
                    ?
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', }}>
                        <img style={{ width: '70%', height: '70%', marginTop: '50px' }} src={LOADING_GIF} alt="loading..." />
                    </div>
                    :
                    <>
                        <div className={styles.header}>
                            <div className={styles.username}>{detail.username}</div>
                            <div className={styles.left}>
                                {
                                    detail.isfriend === 1
                                        ? <div className={styles.text}>
                                            <TeamOutlined />好友
                                        </div>
                                        : <div className={styles.action}>
                                            <UsergroupAddOutlined />加为好友
                                        </div>
                                }
                                <div onClick={onMessageDrawerOpen} className={styles.list}><CommentOutlined /></div>
                            </div>
                        </div>
                        <WaterMark gapY={120} content={AuthStore.username}>
                            <div className={styles.content} ref={messageRef}>
                                {
                                    UserMessageStore.messageList.map((item: any) => renderMessage(item))
                                }
                                <Drawer
                                    title="聊天记录"
                                    placement="right"
                                    closable={false}
                                    onClose={onMessageDrawerClose}
                                    visible={isMessageHistoryListShow}
                                    getContainer={false}
                                    style={{ position: 'absolute' }}
                                    width={640}
                                >
                                    <MessageHistoryList />
                                </Drawer>
                            </div>
                            <div className={styles.footer}>
                                <Input.TextArea onKeyDown={e => { if (e.keyCode === 13) { e.preventDefault(); onSendMessage(); } }} value={message} onChange={e => changeMessage(e.target.value)} rows={4} style={{ zIndex: 10 }} />
                                <div onClick={onSendMessage} className={styles.icon}>
                                    <SendOutlined />
                                </div>
                            </div>
                        </WaterMark>
                    </>
            }
        </div>
    )
})

const Message = (props: any) => {
    // const [activeUser, changeUser] = useState('');

    useEffect(() => {
        let userList: string | null | string[] = localStorage.getItem(AuthStore.userid + 'usersMessageList');
        userList = !userList ? [] : userList.split(',');
        if (UserMessageStore.userMessageList.length === 0) UserMessageStore.getUserMessage(userList, AuthStore.userid);
        return () => {
            localStorage.setItem(AuthStore.userid + 'usersMessageList', UserMessageStore.userMessageList.map(item => item.userid).join(','));
        }
    }, []);

    return (
        <div className={styles.wrap}>
            <div className={styles.aside}>
                <div className={styles.header}>
                    <Input style={{ borderRadius: '20px' }} placeholder="Search for..." prefix={<SearchOutlined />} />
                </div>
                {
                    UserMessageStore.userMessageList.map((item: any) => {
                        return (
                            <div onClick={() => UserMessageStore.changeUser(item.userid)} data-active={item.userid === UserMessageStore.activeUser} className={styles.userItem}>
                                <div className={styles.left}><Avatar size={36} src={item.userid === AuthStore.userid ? UserAvatar : CAT_PNG}></Avatar></div>
                                <div className={styles.right}>
                                    <div className={styles.top}>
                                        <div className={styles.username}>{item.username}</div>
                                        <div className={styles.timeout}>{transTime(item.time)}</div>
                                    </div>
                                    <div className={styles.bottom}>
                                        <div className={styles.content}>{item.content}</div>
                                        <Badge count={item.count || 0} size="small" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <MessageContent activeUser={UserMessageStore.activeUser} />
        </div>
    )
}

function transTime(time: string): string {
    if (!time) return '';
    const before = new Date(time).getTime();
    const after = new Date().getTime();
    const timeout = after - before;
    if (timeout < (1000 * 60 * 60)) return 'Just now';
    else if (timeout < (1000 * 60 * 60 * 24)) {
        return Math.ceil(timeout / (1000 * 60 * 60)) + '小时前';
    }
    else if (timeout < (1000 * 60 * 60 * 24 * 7)) {
        return Math.ceil(timeout / (1000 * 60 * 60 * 24)) + '天前';
    }
    return time.substring(0, 10);
}

export default observer(Message);