import { createReactive } from "./createReactive";

export function reactive<T extends object>(origin: T): T {
    return createReactive(origin)
}

export function shallowReactive<T extends object>(origin: T): T {
    return createReactive(origin, true)
}