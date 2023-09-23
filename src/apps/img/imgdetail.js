import React from 'react'
import * as reg from '../../utility/regx/regxUtil'
import './img.css'

/**
 * 获取展示图片的宽高
 * @param {*} width 图片的宽
 * @param {*} height 图片的高
 */
function get_img_show_size(width, height) {
    // 图片宽高比率
    let ratio_of_img = width / height;
    // 显示器可用窗口的比率 （宽 / 高）
    let ratio_of_screen = window.innerWidth / window.innerHeight;

    // 如果图片的宽高比大于屏幕可用区域的宽高比，则需要减小展示图片展示的高来适应屏幕
    if (ratio_of_img > ratio_of_screen) {
        return [100, ((height / width) / (window.innerHeight / window.innerWidth) * 100)];
    }
    // 反之如果小于屏幕的宽高比，则需要减小图片展示的宽来适应屏幕
    else if (ratio_of_img < ratio_of_screen) {
        return [(ratio_of_img / ratio_of_screen * 100), 100]
    } else { // 最后如果相等，那么全屏即可
        return [100, 100];
    }
}

/**
 * 图片详情页
 * liuzhen
 * 20230812
 */
class ImgDetail extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
        };
    }

    /**
     * 与父组件的沟通函数-缩放图片
     * @param {*} amount 缩放的量
     */
    resize = (amount) => {
        const last_width = this.mref.current.style.width; // 原始宽
        const last_height = this.mref.current.style.height; // 原始高

        /*  amount 大于 0 放大，反之缩小，
            需要注意宽高变化的比率一样才对，比如宽增加 10%，高也要增加 10%  */
        const vw = (1 + amount) * parseFloat(last_width);
        const vh = (1 + amount) * parseFloat(last_height);

        // const offset_width = (vw - last_width) / 2; // 宽度偏移
        // const offset_height = (vw - last_height) / 2; // 高度偏移

        this.mref.current.style.width = `${vw}vw`;
        this.mref.current.style.height = `${vh}vh`;
        // this.mref.current.style.left = `calc(${this.mref.current.style.left}px - ${offset_width})`;
        // this.mref.current.style.top = `calc(${this.mref.current.style.top}px - ${offset_height})`;
        // console.log(`# resize:${vw}vw, ${vh}vh.`);

        this.mref.current.style.transition = `all var(--anim_time_default) linear`;
    }

    /**
     * 图片旋转
     * @param {number} amount 图片旋转的量
     */
    rotate = (amount) => {
        // 当前图片的旋转
        const curRotate = reg.getNum0(this.mref.current.style.transform);
        // 目标旋转
        const newRotate = curRotate + amount;
        this.mref.current.style.transform = `rotate(${newRotate}deg)`;
        this.mref.current.style.transition = `all var(--anim_time_default) linear`;
    }

    /**
     * 与父组件的沟通函数-滚动
     * @param {*} amount 滚动的量
     */
    drag = (event, mouse_offset, img_offset) => {
        const x = img_offset[0] + event.pageX - mouse_offset[0];
        const y = img_offset[1] + event.pageY - mouse_offset[1];

        // console.log(`# left: ${x} = ${event.pageX} - ${offset[0]}, ${event.clientX}`);
        // console.log(`# right: ${y} = ${event.pageY} - ${offset[0]}, ${event.clientY}`);

        this.mref.current.style.left = `${x}px`;
        this.mref.current.style.top = `${y}px`;
        this.mref.current.style.transition = ``;
    }

    /**
     * 复原、恢复图片尺寸、位置
     */
    restore = () => {
        const size = get_img_show_size(this.mref.current.naturalWidth, this.mref.current.naturalHeight);
        this.mref.current.style.width = `${size[0]}vw`;
        this.mref.current.style.height = `${size[1]}vh`;
        this.mref.current.style.left = ``;
        this.mref.current.style.top = ``;
        // console.log(`# restore:${size[0]}vw, ${size[1]}vh.`);

        // 恢复旋转
        this.mref.current.style.transform = `rotate(0deg)`;
    }

    render() {
        const { img_info, func_connect } = this.props;

        // 注册回调函数
        if (func_connect)
            func_connect({
                'resize': this.resize,
                'rotate': this.rotate,
                'drag': this.drag,
                'restore': this.restore,
                'detail_img_ref': this.mref,
            });

        return (
            <img
                ref={this.mref}
                alt={img_info.name}
                className='img_detail'
                src={img_info.src}
                draggable={true}
                style={{ transition: '' }}
                onLoad={this.restore} // 图片加载完成后自动重新调整样式
            />
        );
    }
}

export { ImgDetail };