import { observable, action, makeObservable } from 'mobx';
import UserMessageStore from './UserMessageStore';

type userInfo = {
    userid: string,
    username: string,
    rankno?: number,
    isLogin: boolean,
}

class AuthStore {

    @observable isLogin: boolean = false;
    @observable userid: string = '';
    @observable username: string = '';
    @observable rankno: number | undefined = undefined;

    constructor() {
        makeObservable(this);
        this.isLogin = false;
    }

    @action doLogin(user: userInfo): void {
        this.isLogin = true;
        this.userid = user.userid;
        this.username = user.username;
        this.rankno = user.rankno || undefined;
        UserMessageStore._init();
    }

    @action exitLogin(): void {
        this.isLogin = false;
        this.userid = '';
        this.username = '';
        this.rankno = undefined;
    }

    afterLogin(next: Function): void {
        next();
    }
};

export default new AuthStore();
