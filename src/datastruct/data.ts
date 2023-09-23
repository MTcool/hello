
/* ---------------------------------------------------------------*
 * 数据集
 * ---------------------------------------------------------------*/

import { v4 as uuidv4 } from 'uuid';

import { Row } from './row'

/**
 * 数据集
 * liuzhen
 * 20230823
 */
export class Data implements Iterable<Row> {
    /** 主键 */
    key: string = uuidv4();
    /** 主键 */
    name: string = '';
    /** 行数据们 */
    data: Row[] = [];
    /** 行数 */
    count: number = 0;

    /**
     * 将目标 data 合并到当前 data
     * @param {Data} targetData 目标data
     */
    append(targetData: Data) {
        for (let row of targetData) {
            this.add(row);
        }
    }

    /**
     * 将目标 data 替换到当前 data
     * @param {Data} targetData 目标data
     */
    replace(targetData: Data) {
        this.clear(); // 先清空数据集
        this.append(targetData); // 再添加新数据集
    }

    /**
     * 清空数据集
     */
    clear() {
        this.data = [];
        this.count = 0;
    }

    /**
     * 插入行数据
     * @param {Row} row 行数据
     */
    add(row: Row) {
        this.data.push(row);
        this.count++; // 行数自增
    }

    /**
     * 获取row
     * @param {any} index 行索引
     * @returns 
     */
    get(index: any) {
        return this.data[index];
    }

    /**
     * 获取一列数据
     * @param colId 列ID
     */
    getColVal(colId: string) {
        let col = []; // 要求的列内容，以数组形式返回
        for (let row of this.data) {
            col.push(row.get(colId));
        }
        return col;
    }

    [Symbol.iterator](): Iterator<Row> {
        let index = 0;
        return {
            next: () => {
                if (index < this.data.length) {
                    return { value: this.data[index++], done: false };
                } else {
                    return { done: true, value: undefined };
                }
            }
        }
    }
}
