import axios from 'axios';
import { observable, action, makeObservable } from 'mobx';

class ForumStore {

    @observable title: string = '';
    @observable content: string = '';

    constructor() {
        makeObservable(this);
    }

    @action setTitle(value: string): void {
        this.title = value;
    }

    @action setContent(value: string): void {
        this.content = value;
    }

    @action setEmpty(): void {
        this.title = '';
        this.content = '';
    }

    addForum = async (args: any): Promise<any> => {
        const { title, content } = this;
        const params = new URLSearchParams();
        params.append('title', title);
        params.append('content', content);
        params.append('isofficial', '0');
        for (let key in args) {
            params.append(key, args[key]);
        }
        this.setEmpty();
        return axios.post('http://127.0.0.1:5000/circle/forum', params)
            .then(() => { return Promise.resolve() })
            .catch(() => { return Promise.reject() })
    }
};

export default new ForumStore();
