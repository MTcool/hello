
/* ---------------------------------------------------------------*
 * 行数据
 * ---------------------------------------------------------------*/

import { v4 as uuidv4 } from 'uuid';

/**
 * 行数据
 * liuzhen
 * 20230823
 */
export class Row implements Iterable<[any, any]>{
    /** 主键 */
    key: string = uuidv4();
    /** 名称 */
    name: string = '';
    /** 字段id们 */
    cols: string[] = [];
    /** 字段个数 */
    count: number = 0;
    /** 行数据集 */
    row: Map<any, any> = new Map();

    constructor() {
        this.key = uuidv4();
    }

    /**
     * 插入一个键值对
     * @param {字段列id} col 
     * @param {值} val 
     */
    set(col: string, val: any) {
        this.row.set(col, val); // 写入数据集
        this.cols.push(col); // 字段列增加
        this.count++; // 行数增加
    }

    /**
     * 获取字段的值
     * @param {字段列id} col 
     */
    get(col: string) {
        return this.row.get(col);
    }

    /**
     * 根据索引获取对应的值
     * @param index 
     */
    get_by_index(index: number) {
        if (index >= 0 && index < this.count) {
            return this.get(this.cols[index]);
        }

        return '';
    }

    [Symbol.iterator](): Iterator<[any, any]> {
        return this.row.entries();
    }
}
