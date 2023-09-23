/**
 * 窗口界面状态
 */
export const WindowState = {
    /**
     * 普通、主界面
    */
    normal: 'normal',
    /**
     * 弹窗
     */
    popup: 'popup',
}

/**
 * app隐藏，不接收鼠标事件
 */
export const Style_Hide = {
    opacity: '0',
    pointerEvents: 'none'
}

/**
 * app展示，接收鼠标事件
 */
export const Style_Show = {
    opacity: '1',
    pointerEvents: 'all'
}

/**
 * 排序的类型
 */
export const OrderType = {
    /**
     * 增大的顺序
     */
    increase: 'increase',
    /**
     * 减小的顺序
     */
    decrease: 'decrease',
}