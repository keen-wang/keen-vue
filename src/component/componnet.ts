import { VirtualElement } from '../renderer/virtualElement'
export class VComponent {
    isMounted: boolean = false
    constructor(public state: any, public subTree: VirtualElement | null = null) {

    }
}