import React from 'react'
import ReactModal from 'react-modal';

import { ImgGrid } from './imggrid'
import { ImgDetail } from './imgdetail'
import { Btn } from '../../components/btn/btn'
import * as filehandler from '../../utility/file/filehandler'
import * as imgUtil from '../../utility/file/imgUtil'
import * as htmlutil from '../../utility/html/htmlUtil'
import * as arruitl from '../../utility/datastruct/arrayUtil'
import * as ENUM from '../const/const'
import * as T from '../../utility/time/format'
import * as optimize from '../../utility/optimize/analysis'

import { v4 as uuidv4 } from 'uuid';

import './img.css'
import '../../css/base.css'

/*  ------------------------------------------------------------------------------------------
 *  react-modal 文档: https://github.com/reactjs/react-modal/tree/master  
*/

/** 按钮组居顶部展示 */
const style_btn_show = {
    position: 'sticky',
    top: 0,
    zIndex: 9999,
}

/* -------------------------------------------图片单元格常量------------------------------------------- */
/** 渲染的图片距离视窗的最大距离 */
const MAX_RENDER_DIS = 100;
/** 渲染的图片距离视窗的最大距离 */
const MAX_EXCHNAGE_DIS = 200;
/** 最多加载的图片个数 */
const MAX_IMGS = 50;
/** 最多渲染图片个数 */
const MAX_SHOW_IMGS = 20;
/** 图片单元格的宽度 */
const GRID_WIDTH = 240;
/**
 * 列信息
 */
const COLINFO = {
    /** 列数 */
    colCount: 9,
    /** 列宽 */
    colWidth: GRID_WIDTH,
    /** 间隙 */
    gap: htmlutil.EM(),
    /** 左边的空白宽度 */
    leftOffset: 0,
}


/* -------------------------------------------详情页常量------------------------------------------- */
/** 图片缩放量-缓慢 */
const resize_slow = 0.1;
/** 图片缩放量-快速 */
const resize_fast = 0.5;
/** 弹窗样式 */
const customStyles = {
    overlay: {
        position: 'fixed',
        inset: '0px',
        backgroundColor: 'var(--color_backGroundShadow)',
    }
}

/**
 * 图片应用
 * liuzhen
 * 20230911
 */
class FakeScrollImgApp extends React.Component {
    constructor(props) {
        super(props);
        this.imgAppRef = React.createRef(); // 图片应用引用
        this.img_grids_ref = React.createRef(); // 图片单元格引用
        this.state = {
            /* 图片单元格们 */
            img_files: [], // 所有的图片文件们
            img_infos: [], // 所有图片文件的信息
            img_childs: [], // 所有的图片单元格们
            img_info_index: 0, // 第一个图片单元格的图片信息的索引
            img_detail_index: 0, // 当前加载图片详情的索引
            img_rerender: false, // 图片单元格们重新绘制
            img_funcs: new Map(), // 图片单元格们的反注册函数
            gridStartIndex: 0, // 第一个渲染的单元格的索引
            gridEndIndex: MAX_SHOW_IMGS - 1, // 最后一个渲染的单元格的索引

            /* 图片详情 */
            showModal: false, // 是否弹窗
            detail_info: {}, // 文件详情信息
            modal_fullscreen: false, // 弹窗是否全屏
            detail_index: 0, // 查看图片详情的图片顺序索引
            connect_funcs: new Map(), // 图片详情页的交互函数们
            detail_refs: new Map(), // 图片详情页的 ref 引用

            /* 事件相关 */
            is_draging: false, // 是否在拖拽图片
            mouse_offset: [0, 0], // 开始拖拽时鼠标的偏移量
            img_offset: [0, 0], // 开始拖拽时详情图片的偏移量

            /* 样式 */
            style_app: ENUM.Style_Hide, // Image app 的样式
        };
    }

    /* -------------------------------------------图片单元格------------------------------------------- */

    /**
     * 打开图片文件夹，选择图片
     */
    openImageDir = async () => {
        // 尝试用 URL.revokeObjectURL(url) 清空缓存却没效果，控制台报错缺少 header
        this.clear_img_blob();

        // 清空图片文件
        this.setState({
            img_files: [],
            img_infos: [],
            img_info_index: 0,
            img_detail_index: 0,
        });

        // 从文件夹获取所有的图片文件
        const files = await filehandler.fetchFiles(true, filehandler.FILE_TYPE.image, MAX_IMGS);
        // 先加载需要渲染的图片信息
        const fileRender = files.splice(0, MAX_SHOW_IMGS);

        // 异步加载并渲染单元格数的图片文件信息
        const promiseRender = imgUtil.refineImgByfile(fileRender).then((imgInfos) => {
            console.log('reading imgs.', fileRender.length, imgInfos.length);
            if (imgInfos) {
                this.setState({
                    img_files: files,
                    img_infos: imgInfos
                }, () => {
                    // 先渲染一部分图片单元格
                    this.after_select_img(imgInfos, MAX_SHOW_IMGS);

                    // 再加载后面的图片单元格
                    this.load_img_info(files);
                });

                // 默认允许界面滚动
                document.body.style.overflow = 'auto';
            }
        });

        await Promise.resolve(promiseRender);
    }

    /**
     * 加载除去单元格之外的其他图片信息
     * @param {*} files 
     */
    load_img_info = async (files) => {
        // 异步加载剩余的图片文件信息
        const promiseLoad = imgUtil.refineImgByfile(files).then((imgInfos) => {
            console.log('loading others.', files.length, imgInfos.length);
            if (imgInfos) {
                this.setState({
                    img_infos: [...this.state.img_infos, ...imgInfos]
                });
            }
        });

        await Promise.resolve(promiseLoad);
    }

    /**
     * 文件选择结束之后，展示图片
     * @param {*} imgInfos 图片信息
     * @param {*} gridsCount 要渲染的图片单元格数
     */
    after_select_img = (imgInfos, gridsCount) => {
        // 根据当前容器宽度初始化图片单元格样式
        this.initColInfo();

        // 根据单元格数量加载图片
        for (let i = 0; i < gridsCount && i < imgInfos.length; i++) {
            // 对于已有的图片单元格，更新其数据
            if (i < this.state.img_funcs.size) {
                this.state.img_funcs.get(i).get('updateData')(imgInfos[i], this.getGridStyle(i))
            }
            // 如果要添加的图片数大于已存在的单元格数，则需要添加新的图片单元格
            else {
                this.state.img_childs.push(
                    <ImgGrid
                        key={uuidv4()}
                        index={i}
                        imgInfo={imgInfos[i]}
                        registerFunc={this.gridRegisterFunc}
                        gridStyle={this.getGridStyle(i)}
                    />
                );
            }
        }

        // 对于已经存在的单元格，但是没有足够的图片信息填充了，需要清空这些单元格上的图片信息
        for (let i = imgInfos.length; i < this.state.img_funcs.size; i++) {
            this.state.img_funcs.get(i).get('updateData')(null)
        }

        this.setState({
            img_rerender: true,
        });
    }

    /**
     * 图片单元格反注册函数
     * @param {*} index 单元格索引
     * @param {*} funcs 单元格函数
     */
    gridRegisterFunc = (index, funcs) => {
        this.state.img_funcs.set(index, funcs);
    }

    /**
     * 初始化列属性（列宽、列数、间隙）
     */
    initColInfo = () => {
        // 当前图片单元格容器的宽度
        const gridContainerWidth = htmlutil.getElementWidth(this.img_grids_ref.current);
        // 最初期望的每行单元格数（浮点数 4.11231...）
        const colCount = gridContainerWidth / COLINFO.colWidth;
        // 所有的间隙宽度
        const allGapsWidth = (colCount - 1) * COLINFO.gap;
        // 计算减去 根据期望的列数得到的间隙 后的整个容器可用的列宽
        const avalibleWidth = gridContainerWidth - allGapsWidth;

        // 根据实际可用列宽计算实际的列数，如果容器实际可用宽度比固定列宽小，则当前列数固定为1
        COLINFO.colCount = avalibleWidth < COLINFO.colWidth ? 1 : Math.floor(avalibleWidth / COLINFO.colWidth);
        /*  左边的空白（偏移量）= (容器可用的宽度 - 列数 * 列宽 - （列数 - 1） * 间隙) / 2
            avalibleWidth 已经减去 colCount - 1 个间隙，所以最后需要再减一个 gap
            用 Math.max 是为了限制 offset 不要低于 0  */
        COLINFO.leftOffset = Math.max((avalibleWidth - COLINFO.colCount * COLINFO.colWidth) * .5 - COLINFO.gap, 0);
    }

    /**
     * 获取单元格的样式
     */
    getGridStyle = (index) => {
        let offsetTopRatio = 0; // 顶部的偏移系数
        const columnIndex = index % COLINFO.colCount; // 计算当前列数 也可视作 左部的偏移系数
        const frontRowCount = Math.floor(index / COLINFO.colCount); // 前面的行数

        let frontIndex = 0; // 上方的单元格的索引
        // 只有从第二行开始才计算顶部的偏移, 叠加上面所有图片的高度累计系数
        if (index > COLINFO.colCount - 1) {
            for (let i = 0; i < frontRowCount; i++) {
                frontIndex = columnIndex + i * COLINFO.colCount;
                // 前面图片单元格的宽高比
                if (this.state.img_infos[frontIndex]) {
                    offsetTopRatio += this.state.img_infos[frontIndex].heightWidthRatio;
                }
            }
        }

        return {
            // 距离左部的偏移
            leftOffset: `${columnIndex * COLINFO.colWidth + (columnIndex + 1) * COLINFO.gap + COLINFO.leftOffset}px`,
            // 距离顶部的偏移
            topOffset: `${offsetTopRatio * COLINFO.colWidth + (frontRowCount + 1) * COLINFO.gap}px`,
            // 宽度
            colWidth: `${COLINFO.colWidth}px`,
            order: index,
        }
    }

    /**
     * 调整图片单元格列数
     */
    adjustGrids = () => {
        // 初始化图片单元格的信息
        this.initColInfo();
        // 遍历所有的图片单元格，调整其style
        for (let i = 0; i < this.state.img_funcs.size; i++) {
            this.state.img_funcs.get(i).get('adjustGrid')(this.getGridStyle(i));
        }
    }

    /**
     * 清空 blob 缓存
     * 尝试清空，无效果呢
     */
    clear_img_blob = () => {
        for (const info of this.state.img_infos) {
            const blob = info.src.replace('blob:', '');
            URL.revokeObjectURL(blob);
            URL.revokeObjectURL(info.src);
        }
    }



    /**
     * 检查单元格是否可视
     * @param {*} event 鼠标滚动事件
     */
    checkVisible = (event) => {
        let executed = false;
        const observer = new IntersectionObserver((entries) => {
            if (executed) {
                // console.log('妄想再次校验，奶奶滴', entries.length);
                return;
            }

            executed = true;
            // 当目标元素与视口交叉状态改变时，会触发回调函数
            entries.forEach((entry) => {
                const top = entry.boundingClientRect.top; // 当前元素上边缘与视窗上边缘距离
                const bottom = entry.boundingClientRect.bottom; // 当前元素下边缘与视窗上边缘距离
                let visibility = 'visible'; // 是否可视
                let dis = 0; // 与视窗距离
                let color = 'red'; // 测试用颜色
                const onHead = top < 0; // 是否在头部
                // console.log('-----------------------------------------------------');

                // 如果完全或部分在视窗内，则可视，反之，说明完全不在视窗内，不可视
                if (!entry.isIntersecting) {
                    const mouseDown = event.deltaY > 0; // 是否是将图片往上推（鼠标往下拉）
                    // 如果在头部，说明在元素在视窗上面，反之说明元素在视窗底部
                    dis = onHead ? Math.abs(bottom) : top - htmlutil.screenHeight();

                    /*  如果元素刚超出视窗一点距离，仅隐藏即可
                        如果超出视窗一大段距离，将其调换位置
                        如果是在头部，则调换至尾部，反之如果是在尾部，则调换至头部
                        子元素在单元格容器内的顺序就是初始加载时的 index 索引   */
                    if (dis > MAX_RENDER_DIS && ((onHead && mouseDown) || (!onHead && !mouseDown))) {
                        // visibility = 'hidden';
                        color = 'blue';

                        if (dis > MAX_EXCHNAGE_DIS && entry.target) {
                            // 如果已经到达了最顶部却还再往顶部滚动 或者 到达了最底部却还在往底部滚动，不进行转换
                            if ((this.state.gridStartIndex <= 0 && !mouseDown)
                                || (this.state.gridEndIndex >= this.state.img_infos.length - 1 && mouseDown))
                                return;
                            // 当前顶部元素索引的偏移量
                            const offset = mouseDown ? 1 : -1;
                            // 更新图片单元格，开始索引 + 1，结束索引就 - 1，反之...
                            this.setState({
                                gridStartIndex: this.state.gridStartIndex + offset,
                                gridEndIndex: this.state.gridEndIndex + offset
                            }, () => {
                                console.log('------------------------------------------------------------', dis);
                                // 当前元素的索引
                                // const curIndex = htmlutil.getIndex(entry.target, this.img_grids_ref.current);
                                const curIndex = this.state.gridStartIndex - 1;

                                // const curIndex = parseInt(entry.target.style.order);
                                // 新索引，当前图片单元格要成为的图片信息的索引
                                const newIndex = mouseDown ? this.state.gridEndIndex : this.state.gridStartIndex;

                                console.log(
                                    // 'imgGrids:', this.state.img_funcs.size,
                                    // 'imgInfos:', this.state.img_infos.length,
                                    'curIndex:', curIndex,
                                    'order:', entry.target.style.order,
                                    'curName:', entry.target.alt,
                                    'newIndex:', newIndex,
                                    'newName:', this.state.img_infos[newIndex].name,
                                    'style:', this.getGridStyle(newIndex)
                                );

                                debugger
                                if (curIndex < 0) return;

                                // 更新当前单元格的图片信息数据，图片信息要取当前最后渲染的图片的索引 + 1，如果该索引不存在，则不调整
                                if (curIndex < this.state.img_funcs.size && newIndex < this.state.img_infos.length) {
                                    this.state.img_funcs
                                        .get(curIndex)
                                        .get('updateData')(
                                            this.state.img_infos[newIndex], this.getGridStyle(newIndex)
                                        );

                                    // entry.target.style.order = `${newIndex}`;
                                    if (mouseDown) {
                                        // this.img_grids_ref.current.appendChild(entry.target);
                                        // console.log('mouseDown:', this.img_grids_ref.current.lastElementChild);
                                        this.img_grids_ref.current.insertBefore(
                                            entry.target, this.img_grids_ref.current.lastElementChild.nextSibling
                                        );
                                    } else {
                                        // console.log('mouseUp:', this.img_grids_ref.current.firstElementChild);

                                        this.img_grids_ref.current.insertBefore(
                                            entry.target, this.img_grids_ref.current.firstElementChild
                                        );
                                    }
                                }
                            });
                        }

                        return;
                    }
                }

                // console.log(
                //     `${entry.isIntersecting}`.padStart(10, ' '),
                //     visibility.padStart(10, ' '),
                //     color.padStart(10, ' '),
                //     `${dis}`.padStart(15, ' '),
                //     // `${top}`.padStart(15, ' '),
                //     // `${bottom}`.padStart(15, ' '),
                //     entry.target.alt.padEnd(70, ' '),
                // );

                if (entry.target) {
                    // entry.target.style.visibility = `${visibility}`;
                    // entry.target.style.border = `solid 3px ${color}`;
                }
            }

            );
        });

        if (this.img_grids_ref && this.img_grids_ref.current) {
            const arr = Array.from(this.img_grids_ref.current.children);
            for (const element of arr) {
                observer.observe(element);
            }
        }
    }

    /**
     * 滚动更新图片单元格数据
     * @param {*} event 鼠标滚动事件
     */
    scroll_img_grids = (event) => {
        try {
            // 图片单元格行数
            const col_count = htmlutil.get_col_count(this.img_grids_ref.current);
            // 偏移量，根据单元格行数来计算，如果鼠标向上滚动，
            // 整体向上偏移（单元格要加载前面的图片数据），否则向下偏移（单元格要加载后面的图片数据）
            const offset = event.deltaY < 0 ? -col_count : col_count;

            /** 20230904 控制不允许循环滚动，这里可以增加设置，支持用户设置是否允许滚动 */
            if ((offset < 0 && this.state.img_info_index === 0) // 如果滚动到第一行就不要滚动了
                || this.state.img_infos.length <= MAX_IMGS // 如果图片数量小于单元格数就不要滚动了
                // 如果滚动到底部了就不要再滚动了
                || (offset > 0 && this.state.img_info_index === this.state.img_infos.length - MAX_IMGS))
                return;

            // 计算第一个单元格对应的图片信息数据集的真实合规索引
            const first_real_index = arruitl.get_regular_index(
                this.state.img_infos, this.state.img_info_index + offset
            );

            this.setState({
                // 滚动时记录第一个单元格的数据索引
                img_info_index: first_real_index
            }, () => {
                let index = 0;
                let real_index = 0;
                for (let i = 0; i < MAX_IMGS && this.state.img_funcs.has(i); i++) {
                    // 期望索引（其绝对值可能远超数组大小）
                    index = this.state.img_info_index + i;
                    // 计算真实的图片信息数组的索引
                    real_index = arruitl.get_regular_index(this.state.img_infos, index);
                    // 更新图片单元格数据
                    if (real_index < this.state.img_infos.length) {
                        this.state.img_funcs.get(i).get('updateData')(this.state.img_infos[real_index]);
                    }
                }
            });

        } catch (e) {
            console.log(`### [ERROR]:${e}`);
        }
    }

    /* -------------------------------------------事件监听------------------------------------------- */

    /**
     * 鼠标按键事件监听
     * @param {*} event 键盘监听事件
     */
    press_key = (event) => {
        // debugger
        // console.log('img-press:', event.key);
        switch (event.key) {
            case ' ': // 点击空格，复原图片的显示尺寸
                if (this.state.connect_funcs)
                    this.state.connect_funcs.get('restore')();
                break;
            /* --------------- 图片的放大缩小 --------------- */
            case 'ArrowUp': // 按上建放大
                if (this.state.connect_funcs)
                    this.state.connect_funcs.get('resize')(resize_slow);
                break;
            case 'ArrowDown': // 按下建缩小
                if (this.state.connect_funcs)
                    this.state.connect_funcs.get('resize')(-resize_slow);
                break;

            /* --------------- 图片轮换 --------------- */
            case 'ArrowLeft': // 点左键加载上一张图片
                this.on_open_detail(this.state.detail_index - 1);
                break;
            case 'ArrowRight': // 点右键加载下一张图片
                this.on_open_detail(this.state.detail_index + 1);
                break;
            default: break;
        }
    }

    /**
     * 鼠标滚动事件
     * @param {*} event 鼠标监听事件
     */
    handleScroll = (event) => {
        // 打开弹窗的时候，鼠标滚动时放大缩小图片
        if (this.state.showModal) {
            this.zoom_img_detail(event);
        }
        // 未打开弹窗，鼠标滚动切换图片单元格图片展示
        else {
            // this.scroll_img_grids(event);
        }

        this.checkVisible(event);
    }

    /**
     * 放大或缩小图片
     * @param {*} event 鼠标滚动事件
     */
    zoom_img_detail = (event) => {
        // 不按住 Ctrl 滚动鼠标，上下滚动图片，按住 Shift 再滚动滑轮会加速缩放
        const amount = event.shiftKey ? resize_fast : resize_slow;
        this.state.connect_funcs.get('resize')(event.deltaY >= 0 ? -amount : amount);
    }

    /**
     * 鼠标按下
     */
    handleMouseDown = (event) => {
        // 只有在打开弹窗的时候才监听鼠标事件
        if (!this.state.showModal)
            return;

        // 鼠标按下，需要计算详情图片和鼠标的初始偏移量
        let detail_img_ref = this.state.detail_refs.get('detail_img_ref');
        if (detail_img_ref) {
            this.setState({
                is_draging: true,
                mouse_offset: [
                    event.pageX,
                    event.pageY,
                ],
                img_offset: [
                    detail_img_ref.current.getBoundingClientRect().x,
                    detail_img_ref.current.getBoundingClientRect().y,
                ]
            });
        }
    }

    /**
     * 鼠标移动
     */
    handleMouseMove = (event) => {
        // 只有在打开弹窗的时候才监听鼠标事件
        if (this.state.showModal && this.state.is_draging) {
            this.state.connect_funcs.get('drag')(
                event,
                this.state.mouse_offset,
                this.state.img_offset
            );
        }
    }

    /**
     * 鼠标抬起
     */
    handleMouseUp = (event) => {
        // 只有在打开弹窗的时候才监听鼠标事件
        if (this.state.showModal) {
            this.setState({ is_draging: false });
        }
    }

    /* -------------------------------------------图片详情------------------------------------------- */

    /**
     * 点击图片单元格时打开图片详情页
     * @param {*} event 鼠标点击事件
     */
    on_click_grid = (event) => {
        // 获取所有的子元素
        const childarr = Array.from(event.currentTarget.children);
        // 获取当前点击的子对象所对应的索引
        const click_index = childarr.findIndex(element => element === event.target);
        // 如果未点击到图片单元格，直接返回
        if (click_index < 0) return;
        // 根据点击单元格的索引获取要查看的文件信息的索引
        const real_index = this.state.img_info_index + click_index;

        this.on_open_detail(real_index);
    }

    /**
     * 打开图片详情
     * @param {*} index 当前要查看详情的图片的序号索引
     */
    on_open_detail = (index) => {
        // 获取真实的图片信息的索引
        const real_index = arruitl.get_regular_index(this.state.img_infos, index);
        // 根据合规的索引获取图片信息
        if (real_index >= 0 && real_index < this.state.img_infos.length) {
            this.setState({
                showModal: true, // 弹窗已打开
                detail_info: this.state.img_infos[real_index], // 文件详情信息
                detail_index: real_index, // 当前打开的图片的索引
            }, () => {
                window.state = ENUM.WindowState.popup;
            });
        }
        // 打开详情页，不允许界面滚动
        document.body.style.overflow = 'hidden';
    }

    /**
     * 关闭图片详情页
     */
    on_close_detail = () => {
        this.setState({
            showModal: false, // 弹窗关闭
            detail_info: {}, // 详情图片信息置空
            modal_fullscreen: false, // 关闭弹窗全屏
            connect_funcs: new Map(), // 清空交互函数
            detail_refs: new Map(), // 清空 ref 引用
        }, () => {
            window.state = ENUM.WindowState.normal;
        });

        // 关闭详情页，回到图片单元格界面，允许界面滚动
        document.body.style.overflow = 'auto';
    }

    /**
     * 图片详情页的注册函数
     * @param {*} funcs 详情页图片的沟通函数
     */
    func_connect = (funcs) => {
        // 函数交互
        this.state.connect_funcs.set('resize', funcs.resize);
        this.state.connect_funcs.set('drag', funcs.drag);
        this.state.connect_funcs.set('restore', funcs.restore);

        // ref 交互
        this.state.detail_refs.set('detail_img_ref', funcs.detail_img_ref);
    }

    /**
     * 隐藏或展示本 app
     */
    toggleApp = (isShow) => {
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    /* -------------------------------------------生命周期函数------------------------------------------- */
    componentDidMount() {
        try {
            // 添加窗口调整回调函数，通过窗口的宽度调整每行图片单元格的个数
            window.addEventListener('resize', this.adjustGrids);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { registerFunc } = this.props;
        registerFunc('image', {
            'toggleApp': this.toggleApp
        });

        return (
            <div
                className='img_main app_main'
                onKeyDown={this.press_key}
                onWheel={this.handleScroll}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                ref={this.imgAppRef}
                style={this.state.style_app}
            >
                <div
                    className='grids_btn'
                    style={this.state.showModal ? {} : style_btn_show}
                >
                    <Btn click_func={this.openImageDir} name={'选择图片'} />
                </div>

                <div
                    className='img_grids'
                    ref={this.img_grids_ref}
                    onClick={this.on_click_grid}
                    ratio={this.state.style_grids}
                >
                    {this.state.img_childs}
                </div>

                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.on_close_detail} // 退出弹窗事件
                    shouldCloseOnOverlayClick={false} // 是否允许在鼠标点击之后退出
                    contentLabel="Modal"
                    appElement={document.getElementById('root')}
                    style={customStyles}
                    className={this.state.modal_fullscreen ? 'img_modal_fullscreen' : 'img_modal'}
                >
                    <ImgDetail
                        img_info={this.state.detail_info}
                        func_connect={this.func_connect}
                    />
                </ReactModal>
            </div >
        );
    }
}

export { FakeScrollImgApp };
