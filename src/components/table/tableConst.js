import { Data } from '../../datastruct/data'
import { Row } from '../../datastruct/row'

/**
 * 表单-测试
 */
export const title_test = [
    {
        col: 'index',
        label: '序号',
        width: '10vw',
        align: 'center',
        allowSort: true,
    },
    {
        col: 'id',
        label: '编号',
        width: '10vw',
        align: 'center',
        allowSort: true,
    },
    {
        col: 'name',
        label: '姓名',
        width: '10vw',
        align: 'center',
        allowSort: true,
    },
    {
        col: 'age',
        label: '年龄',
        width: '10vw',
        align: 'center',
        allowSort: true,
    },
    {
        col: 'addr',
        label: '住址',
        width: '10vw',
        align: 'center',
        allowSort: true,
    },
    {
        col: 'test',
        label: '测试',
        width: '10vw',
        align: 'center',
        allowSort: false,
    },

];

/**
 * 数据集 - 测试
 */
export const data = new Data();

for (let i = 0; i < 24; i++) {
    let row = new Row();
    row.set('hello', i);
    row.set('id', `000${i}`);
    row.set('name', '小明');
    row.set('age', `${i + 17}`);
    row.set('addr', '上1海');
    row.set('audio', <img alt='' />);
    data.add(row);
}


/* ------------------单位常量-------------------- */

/** 行高 */
export const ROW_HEIGHT = 3 * 16;