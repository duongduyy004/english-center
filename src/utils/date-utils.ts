export const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleDateString('vi-VN')
}

export const formatDateTime = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleString('vi-VN')
}
