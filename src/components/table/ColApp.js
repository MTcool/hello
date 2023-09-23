import React from 'react'

import './table.css'

/**
 * 列表单元格
 * liuzhen
 * 20230826
 */
class ColApp extends React.Component {
    constructor(props) {
        super(props);
        this.col_ref = React.createRef();
        this.state = {
            col: [], // 当前列的ID
            val: [], // 当前单元格所存储的值
            render: false,
        };
    }

    /**
     * 设置当前单元格的列ID
     */
    set_col = (col) => {
        this.state.col.splice(0);
        this.state.col.push(col);
    }

    /**
     * 获取当前单元格的列ID
     */
    get_col = () => {
        return this.state.col ? this.state.col[0] : '';
    }

    /**
     * 获取当前单元格的值
     */
    set_val = (val) => {
        this.state.val.splice(0);
        this.state.val.push(val);
        // console.log(this.state.col[0], this.state.val[0]);
        // this.col_ref.current = document.create
        if (this.col_ref.current)
            this.col_ref.current.innerHTML = `${val}`;
    }

    /**
     * 获取当前单元格的值
     */
    get_val = () => {
        return this.state.val ? this.state.val[0] : '';
    }

    render() {
        const { col, val, style, connect_funcs_col, index } = this.props;

        // 列向行注册交互函数
        if (connect_funcs_col) {
            let funcs = new Map();
            funcs.set('get_val', this.get_val); // 获取值的函数
            funcs.set('set_val', this.set_val); // 设置值的函数

            connect_funcs_col(index, funcs);
        }

        // 更新值，只在第一次时
        // if (this.state.val.length <= 0)
        //     this.set_val(val);
        // 更新列ID
        if (this.state.col.length <= 0)
            this.set_col(col);

        // console.log('col改变', this.state.val[0], val);

        return (
            <div
                className='table_col'
                style={style}
                ref={this.col_ref}
            >
                {this.state.val[0] ? this.state.val[0] : val}
            </div>
        );
    }
}

export { ColApp };
