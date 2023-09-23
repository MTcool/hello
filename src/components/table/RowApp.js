import React from 'react'

import { ColApp } from './ColApp'
import { Row } from '../../datastruct/row'

import './table.css'

/**
 * 列表行
 * liuzhen
 * 20230826
 */
class RowApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            connect_funcs_col: new Map(), // 子单元格与 row 的交互函数们
            render: false,
            cols: [],
            on_click: [], // 行点击事件
            row: [], // 当前行数据
            title: [], // 当前行标题
        };
    }

    /**
     * 获取单元格的值
     * @param {*} col 单元格ID
     */
    getVal = (col) => {
        if (this.state.connect_funcs_col && this.state.connect_funcs_col.get(col))
            return this.state.connect_funcs_col.get(col)();

        return '';
    }

    /**
     * 子元素的注册函数
     * @param {*} funcs 子元素注册的函数
     */
    register_funcs = (index, funcs) => {
        this.state.connect_funcs_col.set(`${index}`, funcs);
    }

    /**
     * 更新行数据
     * @param {*} row 
     */
    update_row = (row) => {
        if (!row) return;

        this.state.row.splice(0);
        this.state.row.push(row);
        // console.log('# scroll:', row.get('name'), '|',this.state.row[0].get('name'));

        for (let i = 0; i < this.state.connect_funcs_col.size; i++) {
            const funcs = this.state.connect_funcs_col.get(`${i}`);
            if (funcs && this.state.title[0][i].visible) {
                funcs.get('set_val')(row.get_by_index(i));
            }
        }

        this.setState({
            render: true,
        });
    }

    /**
     * 行点击事件
     * @param {*} event 
     */
    on_click_row = (event) => {
        if (this.state.on_click && this.state.on_click[0]) {
            const row = this.state.row ? this.state.row[0] : new Row();
            console.log(row.get('name'));
            this.state.on_click[0](row);
        }
    }

    render() {
        const {
            title, row, style_row, style_col, index, connect_funcs_row, on_click
        } = this.props;
        // 向表格注册行的相关函数

        if (connect_funcs_row) {
            let funcs = new Map();
            funcs.set('update_row', this.update_row); // 更新行数据

            connect_funcs_row(index, funcs);
        }

        this.state.on_click.splice(0);
        this.state.on_click.push(on_click);

        if (!this.state.row || this.state.row.length <= 0) {
            this.state.row.push(row);
        }

        this.state.title.splice(0);
        this.state.title.push(title);

        // 遍历行数据 row，得到所有的列
        let index_col = 0;
        this.state.cols.splice(0);
        for (let [k, v] of row) {
            if (title && title[index_col].visible) {
                this.state.cols.push(
                    <ColApp
                        key={k}
                        col={k}
                        val={v}
                        index={index_col}
                        className='table_col'
                        connect_funcs_col={this.register_funcs}
                        style={style_col ? style_col[index_col] : {}}
                    />
                );
            }

            index_col++;
        }

        return (
            <div
                className='table_row text'
                style={style_row}
                onClick={this.on_click_row}
            >
                {this.state.cols}
            </div>
        );
    }
}

export { RowApp };