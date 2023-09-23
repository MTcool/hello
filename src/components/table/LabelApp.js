import React from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

import './table.css'

/**
 * 列表标题
 * liuzhen
 * 20230827
 */
class LabelApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: true, // 排序方式 true: 正序; false: 倒序
            connect_funcs: new Map(), // 与父组件交互的函数
            index: [0], // 当前 app 的索引
        };
    }

    /**
     * 排序
     */
    sort = (event) => {
        this.state.connect_funcs.get('sort')(this.state.index[0], this.state.order);

        this.setState({
            order: !this.state.order
        });
    }

    render() {
        const { title, index, func_sort } = this.props;

        this.state.connect_funcs.set('sort', func_sort);

        this.state.index.splice(0);
        this.state.index.push(index);

        return (
            <div
                className='table_title_label'
                style={{ justifyContent: `center` }}
            >
                <div className='table_title_label_text'> {title.label} </div>
                {
                    title.allowSort ? // 是否需要排序，如果需要排序增加排序图标
                        <div
                            className='table_title_sort'
                            onClick={this.sort.bind(this)}
                            id={index} // 这里投机使用了id这个属性值，不知道会不会造成影响
                        >
                            {
                                this.state.order ? <BiSolidDownArrow /> : <BiSolidUpArrow />
                            }
                        </div>
                        : ''
                }
            </div>
        );
    }
}

export { LabelApp };
