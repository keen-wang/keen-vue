export class VirtualElement {
    el: Element | any
    constructor(public type: string, public props: any = {}, public children: VirtualElement[] | string) {

    }
}