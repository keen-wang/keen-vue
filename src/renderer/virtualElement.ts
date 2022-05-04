export class VirtualElement {
    el: Element | any
    constructor(public type: string, public children: VirtualElement[] | string, public props: any = {}) {

    }
}