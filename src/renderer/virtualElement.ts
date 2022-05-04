export class VirtualElement {

    constructor(public type: string, public children: VirtualElement[] | string, public props: any = {}) {

    }
}