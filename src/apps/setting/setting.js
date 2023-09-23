import React from 'react'
import './setting.css'

/**
 * 设置界面
 * liuzhen
 * 20230923
 */
class SettingApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            /** 设置数据集们 */
            datas: [],
        };
    }

    /**
     * 获取所有的设置信息（设置大类包含设置小类）
     * @param {Data[]} datas 多个设置数据信息
     */
    renderData = (datas) => {
        if (!datas) {
            return null;
        }

        for (const data of datas) {

        }
    }

    render() {
        const { datas } = this.props;

        return (
            <div>
                {this.state.datas}
            </div>
        );
    }
}

export { SettingApp };


/**
 * 设置中的一个条目
 * liuzhen
 * 20230923
 */
class SettingItemApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
        };
    }

    render() {
        const { data } = this.props;

        return (
            <div
                className='item'
            >

            </div>
        );
    }
}

export { SettingItemApp };

