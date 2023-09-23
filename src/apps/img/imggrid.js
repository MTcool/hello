import React from 'react';
import './img.css'

/**
 * 图片单元格
 * liuzhen
 * 20230812
 */
class ImgGrid extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            style: {}, // 样式
            info: new Map(), // 图片单元格信息
        };
    }

    /**
     * 更新图片信息
     * @param {*} imginfo 要更新的图片信息
     * @param {*} gridStyle 单元格样式
     */
    updateData = (imginfo, gridStyle) => {
        // 如果 imginfo 为 null 则清空当前图片单元格的信息
        if (this.mref.current) {
            if (!imginfo) {
                this.mref.current.src = '';
                this.mref.current.alt = '';
            } else {
                this.adjustGrid(gridStyle);
                this.mref.current.src = imginfo.thumbnailSrc;
                this.mref.current.alt = imginfo.name;
            }
        }
    }

    /**
     * 调整单元格
     * @param {*} colInfo 列信息
     */
    adjustGrid = (style) => {
        if (this.mref.current && this.mref.current.style) {
            // 宽度
            this.mref.current.style.width = `${style.colWidth}`;
            // left(负左正右) top(负上 正下)
            this.mref.current.style.transform = `translate(${style.leftOffset}, ${style.topOffset})`;
        }
    }

    render() {
        const {
            index, // 当前图片单元格的索引
            imgInfo, // 当前图片信息
            registerFunc, // 与图片单元格容器的反注册函数
            gridStyle, // 单元格样式
        } = this.props;

        this.state.info.clear();
        this.state.info.set('index', index); // 当前图片单元格的索引
        this.state.info.set('imgInfo', imgInfo); // 当前图片信息

        const style = {
            transform: `translate(${gridStyle.leftOffset}, ${gridStyle.topOffset})`,
            width: `${gridStyle.colWidth}`,
            order: gridStyle.order,
        }

        const funcs = new Map();
        funcs.set('updateData', this.updateData);
        funcs.set('adjustGrid', this.adjustGrid);

        if (registerFunc)
            registerFunc(index, funcs);

        return (
            <img
                alt={imgInfo.name}
                loading='lazy'
                decoding='async'
                className='img'
                src={imgInfo.thumbnailSrc}
                ref={this.mref}
                style={style || this.state.style}
            />
        );
    }
}

export { ImgGrid };
