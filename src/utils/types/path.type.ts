type Path<T> = T extends object ? { [K in keyof T]:
    `${Exclude<K, symbol>}${"" | `.${Path<T[K]>}`}`
}[keyof T] : never
