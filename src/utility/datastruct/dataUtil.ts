/* ---------------------------------------------------------------*
 * Data工具方法
 * liuzhen
 * 20230923
 * ---------------------------------------------------------------*/

import { Data } from '../../datastruct/data'
import { Row } from '../../datastruct/row'

/**
 * 从对象字面量获取Data数组
 * @param obj 对象字面量 {}
 * @returns Data 数组
 */
export const getDatasFromObj = (obj: any) => {
    const datas: Data[] = [];

    Object.keys(obj).forEach(key => {
        const data = new Data();

        for (const item of obj[key]) {
            const row = new Row();

            Object.keys(item).forEach(itemKey => {
                row.set(itemKey, item[itemKey]);
            });

            data.add(row);
        }

        datas.push(data);
    });

    return datas;
}
