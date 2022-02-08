import { observable, action, makeObservable } from 'mobx';

type userInfo = {
    userid:string,
    username:string,
    rankno?:number,
    isLogin:boolean,
  }

class AuthStore {

    @observable isLogin: boolean = false;
    @observable userid: string = '';
    @observable username: string = '';
    @observable rankno: number | undefined = undefined;

    constructor(){
        makeObservable(this);
    }

    @action doLogin(user:userInfo):void {
        this.isLogin = true;
        this.userid = user.userid;
        this.username = user.username;
        this.rankno = user.rankno||undefined;
    }

    @action exitLogin(): void {
        this.isLogin = false;
        this.userid = '';
        this.username = '';
        this.rankno = undefined;
    }

    afterLogin(next:Function): void {
        next();
    }
};

export default new AuthStore();
