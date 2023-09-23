/*  +----------------------------------------+
    20230622
    liuzhen
    时间工具方法
    ------------------------------------------
    对于月份、日期、小时、分钟、秒数、毫秒数 都前补0
    如果不传拼接符，返回的时间字符串各元素之间不做特殊分割
    年月日、时分秒、毫秒 三者之间默认用空格分割
    ------------------------------------------
    字符串拼接：https://blog.csdn.net/u012320487/article/details/123822785
    +----------------------------------------+  */

/**
 * 获取当前年份 2023
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前年份
 */
export function getYear(date) {
    return date ? date.getFullYear() : new Date().getFullYear();
}

/**
 * 获取当前月份 06
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前月份
 */
export function getMonth(date) {
    // 因为月份是从 0 开始，所以需要 +1
    return date
        ? `${date.getMonth() + 1}`.padStart(2, '0')
        : `${new Date().getMonth() + 1}`.padStart(2, '0');
}

/**
 * 获取当前日期 06
 * @returns 当前日期
 */
export function getDay(date) {
    return date
        ? `${date.getDate()}`.padStart(2, '0')
        : `${new Date().getDate()}`.padStart(2, '0');
}

/**
 * 获取当前小时 11
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前小时
 */
export function getHour(date) {
    return date
        ? `${date.getHours()}`.padStart(2, '0')
        : `${new Date().getHours()}`.padStart(2, '0');
}

/**
 * 获取当前分钟 52
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前分钟
 */
export function getMinute(date) {
    return date
        ? `${date.getMinutes()}`.padStart(2, '0')
        : `${new Date().getMinutes()}`.padStart(2, '0');
}

/**
 * 获取当前秒 40
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前秒
 */
export function getSecond(date) {
    return date
        ? `${date.getSeconds()}`.padStart(2, '0')
        : `${new Date().getSeconds()}`.padStart(2, '0');
}

/**
 * 获取当前秒 369
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前秒
 */
export function getMillisecond(date) {
    return date
        ? `${date.getMilliseconds()}`.padStart(3, '0')
        : `${new Date().getMilliseconds()}`.padStart(3, '0');
}

/**
 * 获取当前年月
 * @param {*} str 年月的拼接符
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前年月
 */
export function getYYYYMM(str, date) {
    return `${getYear(date)}${str || ''}${getMonth(date)}`;
}

/**
 * 获取当前年月日 20230622
 * @param {*} str 年月日的拼接符
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前年月日
 */
export function getYYYYMMDD(str, date) {
    return `${getYYYYMM(str, date)}${str || ''}${getDay(date)}`;
}

/**
 * 获取当前年月日 20230622
 * @param {*} str 年月日的拼接符
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前时分秒
 */
export function gethhmmss(str, date) {
    return `${getHour(date)}${str || ''}${getMinute(date)}${str || ''}${getSecond(date)}`;
}

/**
 * 获取当前年月日时分秒 20230622 115240
 * @param {*} str1 年月日的拼接符
 * @param {*} str2 时分秒的拼接符
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前年月日时分秒
 */
export function getYYYYMMDDhhmmss(str1, str2, date) {
    return `${getYYYYMMDD(str1 || '', date)} ${gethhmmss(str2 || '', date)}`;
}

/**
 * 获取当前年月日时分秒毫秒 20230622 115240 369
 * @param {*} str1 年月日的拼接符
 * @param {*} str2 时分秒的拼接符
 * @param {*} date 时间对象，如果有值则从此时间对象获取时间
 * @returns 当前年月日时分秒毫秒
 */
export function getYYYYMMDDhhmmssmmm(str1, str2, date) {
    return `${getYYYYMMDDhhmmss(str1, str2, date)} ${getMillisecond(date)}`;
}

