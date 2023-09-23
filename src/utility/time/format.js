/*  +----------------------------------------+
    20230623
    liuzhen
    时间格式化工具方法
    +----------------------------------------+  */

import * as T from './time'

/**
* 格式化当前时间 20230623 13:12:26 369
* @returns 格式化后的时间
*/
export function getTime(date) {
    return T.getYYYYMMDDhhmmssmmm('-', ':', date);
}

/**
* 格式化当前时间 20230623 13:12:26
* @returns 格式化后的时间
*/
export function getTimeYMDhms(date) {
    return T.getYYYYMMDDhhmmss('-', ':', date);
}

/**
 * 根据 Date 获取时间戳
 * @param {*} date 123
 * @returns 
 */
export function getTimeStamp(date) {
    return Math.round(date / 1000)
}
