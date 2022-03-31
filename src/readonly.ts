import { createReactive } from "./createReactive";

export function readonly<T extends object>(origin: T): T  {
    return createReactive(origin, false, true)
}

export function shallRowReadonly<T extends object>(origin: T): T  {
    return createReactive(origin, true, true)
}