import React from 'react'

import * as ENUM from '../const/const'
import { TableApp } from '../../components/table/table';
import { FakeScrollTableApp } from '../../components/table/ScrollTable';
import * as TableConst from '../../components/table/tableConst'
import { Data } from '../../datastruct/data'
import { Row } from '../../datastruct/row'
import { Btn } from '../../components/btn/btn'

import './dataanalysis.css'
import '../../css/base.css'

/**
 * 模板应用
 * liuzhen
 * 20230822
 */
class DataAnalysisApp extends React.Component {
    constructor(props) {
        super(props);
        this.grids_container_ref = React.createRef(); // 单元格容器引用
        this.state = {
            grids: [], // 单元格子元素对象
            files: [], // 文件们
            style_app: ENUM.Style_Hide, // app 的样式
        }
    }

    /**
     * 点击事件
     */
    on_click = () => {
    }

    /**
     * 隐藏或展示本 app
     */
    toggleApp = (isShow) => {
        // console.log('dataanalysis:', isShow);
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    render() {
        const { registerFunc } = this.props;

        const funcs = new Map();
        funcs.set('toggle', this.toggleApp);
        funcs.set('adjust', this.adjustGrids);
        registerFunc('dataanalysis', funcs);

        let style = {
            width: '100px',
            height: '20px',
            backgroundColor: 'red',
        }

        let data = new Data();

        for (let i = 0; i < 54; i++) {
            let row = new Row();
            row.set('index', i + 1);
            row.set('id', `${i}`.padStart(4, '0'));
            row.set('name', '小明');
            row.set('age', `${i + 17}`);
            row.set('addr', '上1海');
            row.set('test', <img alt='' style={style} />);
            data.add(row);
        }

        return (
            <div className='data_main app_main' style={this.state.style_app}>
                <div className='grids_btn'>
                    <Btn click_func={this.openDir} name={'选择音频'} />
                </div>
                <FakeScrollTableApp title={TableConst.title_test} data={data} />
            </div>
        )
    };
}

export { DataAnalysisApp };
