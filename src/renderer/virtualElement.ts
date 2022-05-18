
import { VComponent } from '../component/componnet'
export const VText = Symbol()
export const VComment = Symbol()
export const VFragment = Symbol()
export interface ComponentOptions {
    render: (state: any) => VirtualElement,
    data: Function
}
export class VirtualElement {
    el: Element | any
    component?: VComponent
    constructor(
        public type: string | Symbol | ComponentOptions,
        public props: any = {},
        public children: VirtualElement[] | string,
        public key?: string
    ) { }
}