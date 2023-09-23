import React from 'react'
import {
    AiFillCaretRight,
} from "react-icons/ai";

import './menu.css'

/**
 * 不需要选中的菜单栏条目的 key 们
 */
const no_need_selected = ['console', 'help', 'setting', 'collapse'];

/**
 * 菜单组件
 * liuzhen
 * 20230817
 */
class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 是否折叠导航栏
            func_connect: new Map(), // 回调函数
            info: new Map(), // 当前logo条目的数据
        }
    }

    // logo 点击事件
    on_click = () => {
        // this.state.func_connect.get('on_click')(this.state.info.get('key'));
        console.log(this.state.info.get('key'));
    }

    /**
     * 改变logo条目
     * @param {*} isCollapsed 是否折叠
     */
    itemCollapse = (isCollapsed) => {
        this.setState({
            collapsed: isCollapsed,
        });
    }

    /**
     * 条目选中回调函数
     * @param {*} key 被选中的key
     */
    itemSelected = (key) => {
        // console.log(key);
    }

    render() {
        let { on_click, item, registerFunc } = this.props;

        if (!item)
            return;

        this.state.info.clear();
        this.state.info.set('key', item.key);
        this.state.func_connect.set('on_click', on_click);
        // registerFunc(item.key, this.itemCollapse);
        let map = new Map();
        map.set('itemCollapse', this.itemCollapse);
        map.set('itemSelected', this.itemSelected);
        registerFunc(item.key, map);
        return (
            <div className='logo' onClick={this.on_click} >
                <div className='logo_icon'> {item.icon} </div>
                {!this.state.collapsed && <div className='logo_label'>{item.label}</div>}
            </div>
        )
    };
}

export { Logo };

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 是否折叠
            func_connect: new Map(), // 交互函数
            info: new Map(), // 当前菜单条目的数据
            icon: <AiFillCaretRight />,
            isSelected: false, // 是否被选中
        }
    }

    on_click = () => {
        this.state.func_connect.get('on_click')(
            this.state.info.get('key')
        );
    }

    /**
     * 改变菜单条目
     * @param {*} isCollapsed 是否折叠
     */
    itemCollapse = (isCollapsed) => {
        this.setState({
            collapsed: isCollapsed,
        });
    }

    /**
     * 选中菜单条目
     * @param {*} key 被选中的key
     */
    itemSelected = (key) => {
        // 如果不需要选中，返回
        if (no_need_selected.indexOf(key) > -1) {
            return;
        }

        this.setState({
            // 是否与当前条目的key相同，如果相同，则视为被选中
            isSelected: key === this.state.info.get('key'),
        });

        // console.log('key:', key, ', cur:', this.state.info.get('key'));
    }

    /**
     * 获取图标
     * @param {*} icon 给定的默认图标
     * @returns 如果当前的菜单条目是折叠条目则切换图标
     */
    getIcon = (icon) => {
        return (this.state.collapsed && 'collapse' === this.state.info.get('key'))
            ? this.state.icon : icon;
    }

    render() {
        let { on_click, item, registerFunc } = this.props;

        if (!item) return;

        this.state.info.clear();
        this.state.info.set('key', item.key);
        this.state.func_connect.set('on_click', on_click);

        let map = new Map();
        map.set('itemCollapse', this.itemCollapse);
        map.set('itemSelected', this.itemSelected);
        registerFunc(item.key, map);
        // <div className='menu_item_icon' > {this.state.collapsed ? this.state.icon : item.icon} </div>
        return (
            <div
                className={this.state.isSelected ? 'menu_item_selected' : 'menu_item'}
                onClick={this.on_click} >
                <div className='menu_item_icon' > {this.getIcon(item.icon)} </div>
                {!this.state.collapsed && <div className='menu_item_label'>{item.label}</div>}
            </div>
        )
    };
}

export { MenuItem };