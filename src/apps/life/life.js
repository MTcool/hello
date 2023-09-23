import React from 'react'

import * as ENUM from '../const/const'
import * as T from '../../utility/time/time'

import './life.css'
import '../../css/base.css'

/**
 * 生活应用
 * liuzhen
 * 20230821
 */
class LifeApp extends React.Component {
    constructor(props) {
        super(props);
        this.grids_container_ref = React.createRef(); // 单元格容器引用
        this.state = {
            grids: [], // 单元格子元素对象
            files: [], // 文件们
            style_app: ENUM.Style_Hide, // app 的样式
            time: [
                T.getYYYYMMDD('-'),
                T.gethhmmss(':'),
                T.getMillisecond(),
            ], // 时间
        }
    }


    /* ----------------------其他函数------------------------------ */

    /**
     * 点击事件
     */
    on_click = () => {
    }

    /**
     * 隐藏或展示本 app
     */
    toggleApp = (isShow) => {
        // console.log('life:', isShow);
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    /* ----------------------生命周期函数------------------------------ */
    componentDidMount() {
        this.timerID = setInterval(
            () => {
                this.setState({
                    time: [
                        T.getYYYYMMDD('-'),
                        T.gethhmmss(':'),
                        T.getMillisecond(),
                    ]
                });
            }, 1000
        );
    }

    render() {
        const { registerFunc } = this.props;

        const funcs = new Map();
        funcs.set('toggle', this.toggleApp);
        funcs.set('adjust', this.adjustGrids);
        registerFunc('life', funcs);

        return (
            <div className='life_main app_main' style={this.state.style_app}>
                <div
                    className='life_container'
                    ref={this.grids_container_ref}
                    onClick={this.on_click}
                >
                    <div className='life_day life_time life_text'>
                        {this.state.time[0]}
                    </div>
                    <div className='life_hour life_time life_text'>
                        {this.state.time[1]}
                    </div>
                    <div className='life_mill life_time life_text'>
                        {this.state.time[3]}
                    </div>
                </div>
            </div>
        )
    };
}

export { LifeApp };
