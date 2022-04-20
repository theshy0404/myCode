import axios from 'axios';
import { observable, action, makeObservable } from 'mobx';

type TParams = {
    problemid: string,
    userid: string,
}

class SolutionStore {

    @observable title: string = '';
    @observable labels: Array<{ value: string, label: string }> = [];
    @observable content: string = '';

    constructor() {
        makeObservable(this);
    }

    @action setTitle(value: string): void {
        this.title = value;
    }

    @action setLabels(value: Array<{ value: string, label: string }>): void {
        this.labels = value;
    }

    @action setContent(value: string): void {
        this.content = value;
    }

    addSolution = async (args: TParams): Promise<any> => {
        let flat = 0;
        let labels = '';
        let language;
        this.labels.forEach((item, index) => {
            if (item.value.length ===1) language = item.value;
            else {
                if (labels === '') labels += item.value;
                else labels += (';' + item.value)
            }
        })
        const { title, content } = this;
        const params = new URLSearchParams();
        params.append('title', title);
        params.append('labels', labels);
        params.append('content', content);
        params.append('isofficial', '0');
        if (language) params.append('language', language);
        for (let key in args) {
            params.append(key, args[key]);
        }
        await axios.post('http://127.0.0.1:5000/problem/solutions', params)
            .then(res => flat = 1).catch(err => flat = 2);
        if (flat === 1) return Promise.resolve(flat);
        else return Promise.reject(flat);
    }
};

export default new SolutionStore();
