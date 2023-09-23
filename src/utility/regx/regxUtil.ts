/* ---------------------------------------------------------------*
 * 正则表达式工具方法
 * liuzhen
 * 20230827
 * ---------------------------------------------------------------*/

/* -------------------------------数字---------------------------------- */

/**
 * 正则表达式-纯数字
 */
const reg_pure_num = /^-?\d+(\.\d+)?$/;

/**
 * 判断该字符串是否是纯数字
 * @param str 要判断的字符串
 */
export const is_pure_num = (str: string) => {
    return reg_pure_num.test(str);
}

/**
 * 判断该数组的元素是否都是纯数字
 * @param str 要判断的字数组
 */
export const is_pure_num_arr = (arr: []) => {
    // 临界情况，如果为空，返回否
    if (!arr) return false;

    for (let element of arr) {
        // 如果其中有个元素不为纯数字，返回否
        if (!is_pure_num(element)) {
            return false;
        }
    }

    return true;
}

/**
 * 判断该对象是否是纯数字
 * @param str 要判断的对象
 */
export const objIsNum = (obj: any) => {
    return reg_pure_num.test(obj.toString());
}

const pureNumRegx = /-?\d+/g;
/**
 * 获取对象中的纯数字们
 * @param str 要判断的对象
 * @returns []
 */
export const getNums = (obj: any) => {
    if (obj) {
        const strNumArr = obj.toString().match(pureNumRegx);
        return strNumArr.map((str: string) => + str);
    }

    return [];
}

/**
 * 获取对象中的第一个纯数字，如果没数字，则返回 0
 * @param str 要判断的对象
 * @returns num
 */
export const getNum0 = (obj: any) => {
    if (obj) {
        const arr = obj.toString().match(pureNumRegx);
        return arr && arr.length > 0 ? Number(arr[0]) : 0;
    }
    return 0;
}
