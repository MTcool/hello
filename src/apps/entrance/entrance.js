import React from 'react'
import { LeftNavigation } from '../navigation/navigation'

import { ImgApp } from '../img/img'
import { FakeScrollImgApp } from '../img/FakeScrollImg'
import { AudioApp } from '../audio/audio'
import { DataAnalysisApp } from '../dataanalysis/dataanalysis'
import { LifeApp } from '../life/life'
import { HelpApp } from '../help/help'

import * as ENUM from '../const/const'
import * as ECONST from './entranceconst'
import * as htmlutil from '../../utility/html/htmlUtil'

import './entrance.css'

/**
 * 主入口应用
 */
class EntranceApp extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            /* 样式相关 */
            collapsed: false, // 是否折叠
            fullscreen: false, // 是否全屏
            styleType: ECONST.StyleType.normal, // 样式类型

            /* app 相关 */
            cur_app: null, // 当前展示的右侧app
            apps: [], // 已展示的 app 们
            apps_funcs: new Map(), // 子 app 们的交互函数
        }
    }

    /* ----------------------其他---------------------- */

    /**
     * 根据用户在导航栏选择的 key 来让右侧展示对应的应用
     * @param {*} key 应用对应的 key
     */
    changeApp = (key) => {
        if (key === 'collapse') {
            this.setState({
                collapsed: !this.state.collapsed,
            },
                () => { this.setStyle(); } // 修改样式
            );
        } else {
            // 其他key，切换右侧app，如果还没有要展示的 app，先创建一个app
            for (let k of this.state.apps_funcs.keys()) {
                this.executeAppFunc(k, 'toggle', k === key);
            }
        }
    }

    /**
     * 子 app 们注册交互函数
     * @param {子app的主键} appKey 
     * @param {子app与入口应用的交互函数们} funcs 
     */
    registerFunc = (appKey, funcs) => {
        if (!this.state.apps_funcs.has(appKey)) {
            // console.log('注册:', appKey, '，函数', funcs);
            this.state.apps_funcs.set(appKey, funcs);
        }
    }

    /* ----------------------事件监听---------------------- */

    press_key = (event) => {
        // console.log('entrance-press:', event.key);

        // 如果不是主界面，不执行按键监听事件
        if (window.state !== ENUM.WindowState.normal) {
            return;
        }

        switch (event.key) {
            case 'F': case 'f': // F 键，则切换右侧 app 的全屏与非全屏
                if (!event.ctrlKey) { // 20230820 如果按住 Ctrl 不切换全屏
                    this.setState({
                        fullscreen: !this.state.fullscreen
                    }, () => {
                        this.setStyle();
                    });
                }
                break;
            // case '`': // Tab 键，切换折叠与非折叠状态
            //     this.setState(
            //         { collapsed: !this.state.collapsed }, () => { this.setStyle(); }
            //     );
            //     break;
            default: break;
        }
    }

    /**
     * 执行 app 的反注册函数
     * @param {string} funcName 函数名
     * @param {*} params 参数们
     */
    executeAppFunc = (appKey, funcName, params) => {
        if (this.state.apps_funcs.has(appKey)) {
            const appFunc = this.state.apps_funcs.get(appKey);
            if (appFunc && appFunc.get(funcName)) {
                appFunc.get(funcName)(params);
            }
        }
    }

    /* ----------------------样式---------------------- */

    // 根据样式类型返回对应的样式设置
    setStyle = () => {
        let cur_style = ECONST.StyleType.normal; // 当前入口界面样式

        if (this.state.collapsed) { // 折叠
            cur_style = ECONST.StyleType.collapsed;
        } else if (this.state.fullscreen) { // 全屏
            cur_style = ECONST.StyleType.fullscreen;
        } else { // 如果既不是全屏也不是折叠，那只能是普通
            cur_style = ECONST.StyleType.normal;
        }

        // 根据当前的样式类型计算右侧的宽度要增加多少
        const leftWidth = ECONST.StyleWidth.get(cur_style);
        // 根据之前的样式类型计算右侧 app 的宽度要增加多少
        const appAddWidth = ECONST.StyleWidth.get(this.state.styleType);

        // 应用到当前界面样式
        this.mref.current.style.gridTemplateColumns = `${leftWidth}px 1fr`

        // 调整 app 的自适应样式
        for (let k of this.state.apps_funcs.keys()) {
            this.executeAppFunc(k, 'adjust', appAddWidth - leftWidth);
        }

        // 记录当前样式类型
        this.setState({
            styleType: cur_style,
        });
    }

    /**
     * 获取左边导航栏的宽度
     */
    getLeftContainerWidth = () => {
        switch (this.state.styleType) {
            case ECONST.StyleType.collapsed:
                return
        }
    }

    /* ----------------------生命周期函数---------------------- */
    componentDidMount() {
        // 挂载主界面组件时设置主界面状态为 normal
        window.state = ENUM.WindowState.normal;
    }

    render() {
        const apps = [
            <ImgApp key={'image'} registerFunc={this.registerFunc} />,
            <AudioApp key={'audio'} registerFunc={this.registerFunc} />,
            <LifeApp key={'life'} registerFunc={this.registerFunc} />,
            <DataAnalysisApp key={'dataanalysis'} registerFunc={this.registerFunc} />,
            <HelpApp key={'help'} registerFunc={this.registerFunc} />,
        ];

        return (
            <div
                ref={this.mref}
                onKeyDown={this.press_key}
                tabIndex={0}
                className='entrance_container'
            >
                <LeftNavigation
                    items={ECONST.items}
                    func_change_app={this.changeApp}
                />

                <div className='app_container'>
                    {apps}
                </div>
            </div>
        )
    };
}

export default EntranceApp;
