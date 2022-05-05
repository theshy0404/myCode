import { notification } from 'antd';
import { observable, makeObservable, action } from 'mobx';
import doRequest from '../interface/useRequests'
import AuthStore from './AuthStore';
import WebSocketStore from './WebSocket';

type TMessage = {
    time: string;
    content: string;
    isowned: boolean;
    id: string | number;
}

type TUserMessage = {
    userid: string;
    username: string;
    count: number;
    time: string;
    content: string;
}

class UserMessageStore {

    @observable messageList: Array<TMessage>;
    @observable userMessageList: Array<TUserMessage>;
    @observable activeUser: string;
    @observable isShowMessageModal: boolean;
    @observable isShowNew: boolean;

    constructor() {
        makeObservable(this);
        this.userMessageList = [];
        this.messageList = [];
        this.activeUser = '';
        this.isShowMessageModal = false;
        this.isShowNew = false;
    }

    @action
    connectWs() {
        WebSocketStore.connectMessageWebSocket();
    }

    @action
    changeShowMessageModal() {
        this.isShowMessageModal = !this.isShowMessageModal;
        this.isShowNew = false;
    }

    @action
    changeUser(userid: string) {
        this.activeUser = userid;
        this.userMessageList = this.userMessageList.map(item => {
            if (item.userid === this.activeUser) return { ...item, count: 0 };
            return { ...item };
        })
    }

    @action
    getUserMessage(useridList: Array<string>, userid: string) {
        const params = {
            url: '/user/message', type: 'GET', needAuth: true,
            params: { useridList: useridList.join(','), userid },
        }
        doRequest(params).then(res => {
            this.userMessageList = res.data;
        });
    }

    @action
    setMessageList(messageList: Array<any>) {
        this.messageList = messageList.map(message => {
            return {
                id: message.id,
                time: transTime(message.time),
                isowned: AuthStore.userid === message.userid,
                content: message.message,
            }
        });
    }

    @action
    getMessage(message: any) {
        if (AuthStore.userid === message.user) {
            if (this.activeUser === message.to) {
                this.messageList.push({
                    id: new Date().getTime(),
                    time: new Date().toString().substring(16, 21),
                    content: message.message,
                    isowned: true,
                });
            }
            return;
        }
        if (AuthStore.userid === message.to) {
            if (this.activeUser === message.user) {
                this.messageList.push({
                    id: new Date().getTime(),
                    time: new Date().toString().substring(16, 21),
                    content: message.message,
                    isowned: false,
                });
                const params = {
                    url: '/user/message/detail', type: 'GET', needAuth: true, params: {
                        id: message.to,
                    }
                }
                doRequest(params);
            }
            else {
                if (!this.isShowMessageModal) {
                    this.isShowNew = true;
                    notification.open({
                        message: '您有新的消息',
                        description: "点击左上角查看: " + message.message.substring(0, 10) + '...',
                    });
                }
                else {
                    const userIndex = this.userMessageList.findIndex(item => item.userid === message.user);
                    if (userIndex !== -1) {
                        this.userMessageList = this.userMessageList.map((item, index) => {
                            if (index === userIndex) {
                                return { ...item, content: message.message, count: item.count + 1, time: 'Just now' };
                            }
                            return { ...item };
                        })
                    }
                }
            }
            return;
        }
    }

    @action
    sendMessage(message: string, touserid: string) {
        WebSocketStore.sendMessage(message, touserid);
    }
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

export default new UserMessageStore();