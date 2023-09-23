/*  +----------------------------------------+
    20230623
    liuzhen
    数学计算相关工具方法
    +----------------------------------------+  */

/**
 * 向下保留 len 位小数（不改变数据类型，向下取舍）
 * @param {*} num 要处理的原数
 * @param {*} len 保留的精度位数
 */
export const floor = (num: number, len: number) => {
    let a = Math.pow(10, len);
    return Math.floor(num * a) / a;
}

/**
 * 四舍五入保留 len 位小数（不改变数据类型）
 * @param {*} num 要处理的原数
 * @param {*} len 保留的精度位数
 */
export const round = (num: number, len: number) => {
    let a = Math.pow(10, len);
    return Math.round(num * a) / a;
}

/**
 * 保留 len 位小数（不改变数据类型，不四舍五入）
 * 如果原数没有小数点，则右补小数点及要求的精度位数的 0
 * @param {*} num 要处理的原数
 * @param {*} len 保留的精度位
 */
export const origin = (num: number, len: number) => {
    let str = num.toString();
    if (str.indexOf('.') > -1)
        return Number(str.substring(0, str.indexOf('.') + len + 1))
    else
        return Number((str + '.').padEnd(0, `${len}`));
}

