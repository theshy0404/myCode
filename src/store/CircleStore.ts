import { observable, action, makeObservable } from 'mobx';

// type TActionInfo = {
//     key?: string;
//     children?: Array<any>;
// }

class CircleStore {

    @observable selectKey: string | undefined = undefined;
    @observable children: Array<any> | undefined = undefined;

    constructor() {
        makeObservable(this);
        this.children = [];
    }

    @action updateChild(children: any[]): void {
        this.children = children;
        console.log(children);
    }
};

export default new CircleStore();
