import React from 'react'
import { Data } from '../../datastruct/data'
import { RowApp } from './RowApp'
import { LabelApp } from './LabelApp'
import * as arrUtil from '../../utility/datastruct/arrayUtil'
import * as regxUtil from '../../utility/regx/regxUtil'
import * as htmlutil from '../../utility/html/htmlUtil'
import * as TConst from './tableConst'

import './table.css'

/** -----------------------------------------------------------
 * 伪滚动表格是为了提供一种近似于鼠标滚动但使用固定行数 div 展示数据的表格
 * 实现逻辑，数据一开始加载时创建 2 * 全屏单元格数，
 * 然后鼠标滚动，顶部的行向上走，底部的行跟上，当顶部的行移动一定的距离，
 * 就将其元素位置调整为数据表格的底部，并填充对应的数据，如此周而复始
 * -----------------------------------------------------------
 * 这样做的好处是技能提供一种滚动的感觉，让使用者感觉不出差异，
 * 同时又能提升性能
 * ----------------------------------------------------------- */

/** 默认行高 48px */
const DEFAULT_ROWHEIGHT = 45;
/** 默认间隙 8px */
const DEFAULT_GAP = 8;
/** 渲染行距离视窗的最大距离 */
const MAX_DISTANCE = 500;

/**
 * 伪滚动表格
 * liuzhen
 * 20230829
 */
class FakeScrollTableApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref_data = React.createRef();
        this.gridsContainerRef = React.createRef(); // 音频单元格容器引用
        this.state = {
            /* ----------------------列标题---------------------- */
            /** 标题列 */
            title_cols: [],

            /* ----------------------列相关---------------------- */
            /** 行的样式 */
            style_row: [],
            /** 列的样式 */
            style_col: [],
            /** 列id们及其排序方式，默认不排序，只有在点击排序按钮的时候才会排序 true: 正序; false: 倒序; */
            cols: [],

            /* ----------------------表格数据---------------------- */

            /** 表格数据 */
            table_data: new Data(),
            /** 表格子元素 */
            table_data_elements: [],
            /** 第一行对应的数据的下标索引 */
            row_first_index: 0,
            /** 与行的交互函数们 */
            connect_funcs_row: new Map(),
        }
    }

    /**
     * 鼠标滚动，表格数据滚动
     * @param {*} event 
     */
    onWheelHandle = (event) => {
        let dataElements = this.mref_data.current.children; // 获取所有的行

        // if (!this.state.table_data || !dataElements || dataElements.length <= 0)
        return;

        this.setState({
            /*  event.deltaY > 0，数据往上跑，需要加载下面的数据
                反之，event.deltaY < 0，数据往下跑，需要加载上面的数据  */
            row_first_index: event.deltaY > 0 ?
                (this.state.row_first_index + 1) : (this.state.row_first_index - 1)
        }, () => {
            console.log(this.state.row_first_index);
            // 如果当前数据的下标索引 row_first_index 大于（当前数据的最大索引 - 当前行数），
            // 停止滚动，并将该索引限制在一个合理范围内
            const index_max = this.state.table_data.count - dataElements.length + 1;
            if (this.state.row_first_index >= index_max) {
                this.setState({
                    row_first_index: index_max
                });
                return;
            } else if (this.state.row_first_index <= 0) {
                this.setState({
                    row_first_index: 0
                });
            }

            let rowData = null;
            let index_data = this.state.row_first_index;
            // 鼠标滚动之后，表格行的所有数据跟随当前第一行对应的数据切换显示
            // debugger
            // 循环遍历注册的行交互函数们，调用行数据更新函数
            for (let [k, v] of this.state.connect_funcs_row) {
                rowData = this.state.table_data.get(index_data);

                if (!rowData) break;

                if (v) {
                    v.get('update_row')(rowData);
                }

                index_data++;
            }

        });


    }

    /**
     * 数据排序
     * @param {*} index 点击的列索引
     * @param {*} order 排序 true: 正序; false: 倒序
     */
    sortData = (index, order) => {
        let count = this.mref_data.current.children.length; // 当前表格行数
        let colId = this.state.cols[index].keys().next().value; // 当前点击的列ID 
        let colVals = this.state.table_data.getColVal(colId); // 当前点击的列的所有数据
        let arr = []; // 将列数据排序后的数组
        let is_num = false; // 当前列是否是数值
        // 判断当前点的列的值是否全部都是纯数值，如果是数值，按照数值的大小比较

        if (regxUtil.is_pure_num_arr(colVals)) {
            arr = order ? arrUtil.sort_num(colVals) : arrUtil.reverse_num(colVals);
            is_num = true;
        }
        // 如果不是纯数值，按照字符串排序
        else {
            arr = order ? colVals.sort() : arrUtil.reverse_str(colVals);
        }

        for (let i = 0; i < count; i++) {
            let rowApp = this.mref_data.current.children[i].children; // 行view
            let colVal = rowApp[index].innerText; // 行的列的值
            // 排序，如果是数值需要将列值转为数值
            let order_data = `${arr.indexOf(is_num ? parseFloat(colVal) : colVal)}`;
            this.mref_data.current.children[i].style.order = order_data;
        }

        // 点击排序了之后，再将排序逆转
        this.state.cols[index].set(colId, !this.state.cols[index].get(colId));
    }

    /**
     * 计算行数
     */
    calRowCount = () => {
        if (this.mref_data.current) {
            // 容器高度
            const containerHeight = this.mref_data.current.offsetHeight;
            // 期望行数（浮点数 4.111123）
            let rowCount = containerHeight / DEFAULT_ROWHEIGHT;
            const avalibleHeight = containerHeight - (rowCount - 1) * DEFAULT_GAP;
            rowCount = Math.max(1, Math.floor(avalibleHeight / DEFAULT_ROWHEIGHT));
            // console.log(containerHeight, avalibleHeight, rowCount);
            return rowCount;
        }
    }

    /**
     * 重新调整行数
     */
    resize = () => {

    }

    checkVisible = () => {
        const observer = new IntersectionObserver((entries) => {
            // 当目标元素与视口交叉状态改变时，会触发回调函数
            entries.forEach((entry) => {
                // 不在视窗内，
                if (entry.target && !entry.isIntersecting) {
                    // 当前元素上边缘与视窗上边缘距离
                    const top = entry.boundingClientRect.top;
                    // 如果 top < 0 说明当前元素在视窗上部
                    if (top < 0) {
                        // 如果超出最大距离限制，则需要移动到底部
                        if (-top > MAX_DISTANCE) {
                            console.log(`${entry.target} move to bottom`);
                            entry.target.style.visibility = 'hidden';
                        } else {
                            entry.target.style.visibility = 'visible';
                        }
                    }
                    // 如果 top 大于 0 说明当前元素在视窗底部
                    else if (top > 0) {
                        // 如果超出最大距离限制，则需要移动到顶部
                        if (Math.abs(top - htmlutil.screenHeight()) > MAX_DISTANCE) {
                            console.log(`${entry.target} move to top`);
                            entry.target.style.visibility = 'hidden';
                            debugger
                        } else {
                            entry.target.style.visibility = 'visible';
                        }
                    }
                } else {
                    if (entry.target)
                        entry.target.style.visibility = 'visible';
                }
            });
        });

        if (this.mref_data && this.mref_data.current) {
            const arr = Array.from(this.mref_data.current.children);
            for (const element of arr) {
                observer.observe(element);
            }
        }
    }

    /**
     * 行反注册函数
     * @param {*} index 
     * @param {*} func 
     */
    registerFuncRow = (index, funcs) => {
        this.state.connect_funcs_row.set(`${index}`, funcs);
        if (!this.state.connect_funcs_row.has(`${index}`)) {
            console.log(index, funcs);
        }
    }

    /**
     * 获取标题
     * @param {数据} data 
     */
    getDatas = (data, title, row_click) => {
        // const rowCount = this.calRowCount() * 3;

        if (this.mref_data.current) {
            this.mref_data.current.style.gridAutoRows = `${DEFAULT_ROWHEIGHT}px`;
            this.mref_data.current.style.gap = `${DEFAULT_GAP}px`;
        }

        if (!data || data.length <= 0) return;
        this.state.table_data_elements.splice(0);
        let row = null;
        // 遍历 data 获取所有行数据
        for (let i = 0; i < data.count; i++) {
            row = data.get(i);
            this.state.table_data_elements.push(
                <RowApp
                    key={row.key}
                    row={row}
                    title={title}
                    style_row={this.state.style_row[0]}
                    style_col={this.state.style_col}
                    index={i}
                    on_click={row_click}
                    connect_funcs_row={this.registerFuncRow}
                />
            );
        }

        // 记录数据
        this.state.table_data.replace(data);
    }

    /**
     * 获取标题，并设置行样式
     * @param {标题} title 
     */
    getTitles = (title) => {
        this.state.style_col.splice(0); // 清空样式
        this.state.cols.splice(0); // 清空列id
        let style_width = ''; // 样式-宽度
        this.state.title_cols.splice(0); // 清空行标题字段
        let index = 0;
        for (let t of title) {
            // 注册列的样式 align
            this.state.style_col.push({ justifyContent: `${t.align}` });

            // 注册列及其排序方式（默认不排序，只有在点击排序按钮的时候才会排序）
            this.state.cols.push(new Map([
                [t.col, true]
            ]));

            index++;

            // 如果不展示，不渲染标题
            if (!t.visible)
                continue;

            style_width += t.width + ' ';

            this.state.title_cols.push(
                <LabelApp
                    key={t.col}
                    title={t}
                    index={index}
                    func_sort={this.sortData}
                />
            );
        }

        // 处理行样式
        this.state.style_row.splice(0);
        this.state.style_row.push({
            gridTemplateColumns: `${style_width}`,
        });
    }

    /* ----------------------生命周期函数---------------------- */
    componentDidMount() {
        // try {
        //     this.timerID = setInterval(
        //         () => {
        //             this.checkVisible();
        //         }, 1000
        //     );
        // } catch (e) {
        //     console.log(e);
        // }
    }


    render() {
        const { data, title, row_click } = this.props;

        this.getDatas(data, title, row_click); // 获取数据
        this.getTitles(title); // 获取列标题

        return (
            <div className='table_main'>
                <div className='table_title' style={this.state.style_row[0]}>
                    {this.state.title_cols}
                </div>
                <div
                    className='fake_table_data'
                    ref={this.mref_data}
                    onWheel={this.onWheelHandle}
                >
                    {this.state.table_data_elements}
                </div>
            </div>
        );
    }
}

export { FakeScrollTableApp };
