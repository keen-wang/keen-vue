
export const VText = Symbol()
export const VComment = Symbol()
export const VFragment = Symbol()
export class VirtualElement {
    el: Element | any
    constructor(
        public type: string | Symbol,
        public props: any = {},
        public children: VirtualElement[] | string,
        public key?: string
    ) {

    }
}