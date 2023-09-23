/* ---------------------------------------------------------------*
 * 数组工具方法
 * liuzhen
 * 20230826
 * ---------------------------------------------------------------*/

/**
 * 数组按照数值排序
 * @param array 要排序的数组
 */
export const sort_num = (array: []) => {
    return array.map((str) => {
        return parseFloat(str);
    }).sort((a, b) => { return a - b });
}

/**
 * 数组按照数值倒序排序
 * @param array 要排序的数组
 */
export const reverse_num = (array: []) => {
    return array.map((str) => {
        return parseFloat(str);
    }).sort((a, b) => { return b - a });
}

/**
 * 数组按照字符串倒序排序
 * @param array 要排序的数组
 */
export const reverse_str = (array: []) => {
    return array.sort(function (a: string, b: string) {
        return b.localeCompare(a); // 使用localeCompare()方法进行逆向排序
    });
}

/**
 * 根据给定的索引在一个循环数组中求得合理的索引
 * 
 * ------------------------------------------
 * 比如：
 * 1. 一个数组 [1,2,3,4,5]，给定一个索引 -2
 * 很显然数组的索引没有负数，如果我们想把这个数组作为一个循环数组，
 * 那么 -2 就可以转换为: -2 + 数组长度 = 3
 * 就是求得该数组第一个元素前面的两个元素，转一圈，求得第三个元素
 * 2. 如果给定的索引为 -12 => -(Math.abs(-12) % 数组长度) + 数组长度
 * 3. 如果给定的索引大于数组长度比如 18 => 18 % 数组长度
 * 
 * @param arr 要求索引的数组
 * @param index 给定的索引
 */
export const get_regular_index = (arr: [], index: number) => {
    if (arr) {
        const length = arr.length;
        return index < 0 ? length -(Math.abs(index) % length) : index % length;
    }

    return 0;
}