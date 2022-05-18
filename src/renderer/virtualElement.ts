import { VComponent, ComponentOptions } from '../component/component'
export const VText = Symbol()
export const VComment = Symbol()
export const VFragment = Symbol()
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