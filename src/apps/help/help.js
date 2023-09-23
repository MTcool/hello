import React from 'react'
import { TableApp } from '../../components/table/table'
import { Data } from '../../datastruct/data'

import * as helpConst from './helpConst'
import * as ENUM from '../const/const'
import * as dataUtil from '../../utility/datastruct/dataUtil'

import './help.css'

/**
 * 帮助界面
 * liuzhen
 * 20230923
 */
class HelpApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            /** 帮助数据集们 */
            datas: [],
            /* 样式 */
            style_app: ENUM.Style_Hide,
        };
    }

    /**
     * 获取所有的帮助信息（帮助大类包含帮助小类）
     * @param {Data[]} datas 多个帮助数据信息
     */
    renderData = (datas) => {
        if (!datas) {
            return null;
        }

        const helpItems = [];
        for (const data of datas) {
            helpItems.push(
                <HelpItemApp
                    key={data.key}
                    data={data}
                />
            );
        }

        return helpItems;
    }

    /**
     * 隐藏或展示本 app 
     */
    toggleApp = (isShow) => {
        console.log('help:', isShow);
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    render() {
        const { datas, registerFunc } = this.props;

        const funcs = new Map();
        funcs.set('toggle', this.toggleApp);
        registerFunc('help', funcs);

        return (
            <div
                className='help_main app_main'
                style={this.state.style_app}
            >
                {this.renderData(dataUtil.getDatasFromObj(helpConst.helps))}
            </div>
        );
    }
}

export { HelpApp };


/**
 * 帮助中的一个条目
 * liuzhen
 * 20230923
 */
class HelpItemApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
        };
    }

    render() {
        const { data } = this.props;

        return (
            <TableApp
                data={data}
                rowHeight={'3em'}
                title={helpConst.title}
                row_click={''}
                gap={'calc(var(--default_gap) * 2)'}
            />
        );
    }
}

export { HelpItemApp };

