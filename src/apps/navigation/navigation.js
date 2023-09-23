import React from 'react'
import { AiFillCaretLeft, AiFillFire } from "react-icons/ai";
import { MenuItem, Logo } from '../../components/menu/menu'
import * as ECONST from '../entrance/entranceconst'

import './navigation.css'

/**
 * Antd: https://ant.design/components/overview-cn/
 * icons: https://ant.design/components/icon
 */

/**
 * 入口主界面折叠状态样式
 */
const style_collapse = {
    gridTemplateColumns: '2.5em',
}

/**
 * 入口主界面未折叠状态样式
 */
const style_uncollapse = {
    // gridTemplateRows: 'repeat(10, 2.5em)',
}

/**
 * 菜单条目属性-折叠、收起、合并
 */
const item_collapse = [
    {
        label: 'Collapse', // 收起
        key: 'collapse',
        icon: <AiFillCaretLeft />,
        disabled: false,
    },
]

/**
 * 菜单条目属性-标识
 */
const item_logo = {
    label: 'Assistant',
    key: 'logo',
    icon: <AiFillFire style={{ height: '1.5em', width: '1.5em' }} />,
    disabled: false,
};

/**
 * 左导航栏
 * liuzhen
 * 20230816
 */
class LeftNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.itemsRef = React.createRef();
        this.state = {
            func_connect: new Map(), // 回调函数
            style: style_uncollapse, // 样式
            menu_items: new Map(), // 菜单条目们
            menu_items_preset: new Map(), // 预设的菜单条目们
            menu_funcs: new Map(), // 菜单条目的函数们
        }
    }

    /**
     * 点击导航栏按钮
     * @param {*} key
     */
    on_click = (key) => {
        if ('collapse' === key) {
            this.setState({
                collapsed: !this.state.collapsed,
            },
                // 因 setState 是异步的，所以在设置 state 的回调函数中更新样式，确保能获取到 collapsed
                () => {
                    // 执行菜单条目的折叠函数
                    for (let menu_funcs of this.state.menu_funcs.values()) {
                        menu_funcs.get('itemCollapse')(this.state.collapsed);
                    }

                    // 根据是否折叠改变菜单的样式
                    this.setState({
                        style: this.state.collapsed ? style_collapse : style_uncollapse,
                    });
                }
            );
        } else {
            // 如果点击的不是 折叠 条目，固定当前点击的条目颜色为选中颜色，其他条目都为不选中状态
            for (let menu_funcs of this.state.menu_funcs.values()) {
                menu_funcs.get('itemSelected')(key);
            }
        }

        // 调用主页面的切换 app 函数，根据点击的菜单的 key 来切换展示对应的 app
        this.state.func_connect.get('func_change_app')(key);
    }

    /**
     * 将菜单条目按照条目的 key 注册到导航栏函数中
     * @param {*} key 菜单条目
     * @param {*} func 菜单条目的交互函数
     */
    registerItemFunc = (key, funcs) => {
        if (this.state.menu_items && !this.state.menu_funcs.get(key)) {
            this.state.menu_funcs.set(key, funcs);
        }
    }

    // 获取菜单条目
    getMenuItem = (item) => {
        return <MenuItem
            key={item.key}
            item={item}
            on_click={this.on_click}
            registerFunc={this.registerItemFunc}
        />;
    }

    render() {
        let { items, func_change_app } = this.props;

        this.state.func_connect.set('func_change_app', func_change_app);

        // 清空菜单条目信息
        this.state.menu_items.clear();

        // 添加 logo
        this.state.menu_items.set(item_logo.key,
            <Logo
                key={'logo'}
                item={item_logo}
                on_click={this.on_click}
                registerFunc={this.registerItemFunc}
            />
        );

        // 添加剩余的菜单条目
        items = [item_collapse[0], ...items];
        for (let item of items) {
            this.state.menu_items.set(item.key, this.getMenuItem(item));
        }

        for (let item of ECONST.items_preset) {
            this.state.menu_items_preset.set(item.key, this.getMenuItem(item));
        }

        return (
            <div className='navigation_container'>
                <div className='navigation_top' style={this.state.style} ref={this.itemsRef}>
                    {Array.from(this.state.menu_items.values())}
                </div>
                <div className='navigation_buttom' style={this.state.style}>
                    {Array.from(this.state.menu_items_preset.values())}
                </div>
            </div>
        )
    };
}

export { LeftNavigation };
