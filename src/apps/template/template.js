import React from 'react'

import * as ENUM from '../const/const'

/**
 * 模板应用
 * liuzhen
 * 20230821
 */
class TemplateApp extends React.Component {
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
        console.log('template:', isShow);
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    render() {
        const { registerFunc } = this.props;

        registerFunc('template', { // 注册函数
            'toggleApp': this.toggleApp
        });
        return (
            <div className='template_main' style={this.state.style_app}>
                <div
                    className='template_container'
                    ref={this.grids_container_ref}
                    onClick={this.on_click}
                >
                    {this.state.grids}
                </div>
            </div>
        )
    };
}

export { TemplateApp };
