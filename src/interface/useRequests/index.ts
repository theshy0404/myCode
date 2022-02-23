import { message } from 'antd';
import axios from 'axios';
import AuthStore from '../../store/AuthStore';

const request = async (args: any): Promise<any> => {
    if (args.needAuth && !AuthStore.isLogin) {
        message.warning('请先登录');
        return Promise.reject('withoutAuth');
    };
    let { url, type, params } = args;
    let result = undefined;
    let error = undefined;
    url = 'http://127.0.0.1:5000' + url;
    if (type === 'POST') {
        await axios.post(url, {
            params: { ...params, userid: AuthStore.userid }
        }).then(response => {
            result = response;
        }).catch(err => error = err);
    }
    else{
        await axios.get(url, {
            params: { ...params, userid: AuthStore.userid }
        }).then(response => result = response).catch(err => error = err);
    }
    if (error) return Promise.reject(error);
    return Promise.resolve(result);
}

export default request;