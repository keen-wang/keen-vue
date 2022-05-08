
export const TextType = Symbol()
export const CommentType = Symbol()
export class VirtualElement {
    el: Element | any
    constructor(public type: string | Symbol, public props: any = {}, public children: VirtualElement[] | string) {

    }
}