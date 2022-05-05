import AuthStore from "./AuthStore";
import UserMessageStore from "./UserMessageStore";

class MyWebSocketStore {
    messageWebSocket: any;

    constructor() {
        this.messageWebSocket = null;
    }

    connectMessageWebSocket() {
        this.messageWebSocket = new WebSocket('ws://localhost:5001/user/message');
        this.messageWebSocket.onopen = () => {
            this.messageWebSocket.send('login/myws/' + AuthStore.userid);
        }
        this.messageWebSocket.onmessage = (e: any) => {
            const res = e.data.split('/myws/');
            const type = res[0];
            const message = JSON.parse(res[1]);
            if (type === 'message') {
                UserMessageStore.getMessage(message);
                return;
            }
        }
        this.messageWebSocket.onclose = (e: any) => {
            console.log(e);
        }
    }

    sendMessage(message: string, touserid: string) {
        this.messageWebSocket.send('message/myws/' + JSON.stringify({
            to: touserid, message, user: AuthStore.userid
        }));
    }
}

export default new MyWebSocketStore();