import { VirtualElement } from '../renderer/virtualElement'
export interface ComponentOptions {
    name?: string;
    render: (state: any, props: any) => VirtualElement,
    data: Function;
    // 参数
    props?: any;
    // 生命周期函数
    beforeCreate?: Function;
    created?: Function;
    beforeMount?: Function;
    mounted?: Function;
    beforeUpdate?: Function;
    updated?: Function;
}
export class VComponent {
    isMounted: boolean = false
    public subTree: VirtualElement | null = null
    constructor(public state: any, public props: any) {

    }
}