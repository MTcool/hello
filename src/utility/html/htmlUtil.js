/** +--------------------------------------------------------------------------------+----
    +   html 相关工具方法
    +   liuzhen
    +   20230907
----+--------------------------------------------------------------------------------+  */


/*  ------------------------------------ unit 单位相关 -------------------------------- */

/**
 * 获取字体单位
 * @returns 字体单位
 */
export const EM
    = () => parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);


/*  ------------------------------------ window 系统相关 -------------------------------- */
/** 窗口可用宽度 */
export const screenWidth = () => window.innerWidth;

/** 窗口可用高度 */
export const screenHeight = () => window.innerHeight;


/*  ------------------------------------ 滚动条 相关 -------------------------------- */
/**
 * 获取滚动条的宽度
 * @param {dom} element 带有滚动条的元素
 * @returns 当前元素容器内滚动条的宽度
 */
export const getScrollWidth = (element) => element.offsetWidth - element.clientWidth;


/*  ------------------------------------ dom 元素相关 -------------------------------- */

/**
 * 获取 dom 元素的样式
 * @param {dom} element dom 元素
 * @returns dom 元素的样式
 */
export const get_style
    = (element) => element ? window.getComputedStyle(element) : '';

/**
 * 获取 dom 元素的一个属性值
 * @param {dom} element dom 元素
 * @returns dom 元素样式的属性值
 */
export const get_style_property = (element, property) => {
    const style = get_style(element);
    return (style !== '') ? style.getPropertyValue(property) : '';
}

/**
 * 获取元素的宽高尺寸
 * @param {dom} element dom 元素
 */
export const getElementSize
    = (element) => element ? [element.offsetWidth, element.offsetHeight] : [0, 0]

/**
 * 获取元素的宽
 * @param {dom} element dom 元素
 */
export const getElementWidth
    = (element) => element ? element.offsetWidth : 0;

/**
 * 获取元素的高
 * @param {dom} element dom 元素
 */
export const getElementHeight
    = (element) => element ? element.offsetHeight : 0;

/**
 * 获取子元素在父元素内的索引顺序
 * @param {dom} child 子元素
 * @param {dom} parent 父元素
 */
export const getIndex
    = (child, parent) => parent ? Array.from(parent.children).indexOf(child) : -1;


/* ------------------------------------ grid 单元格相关 ---------------------------------------------  */

/**
 * 获取单元格数
 * @param {dom} element grid布局的 dom 元素
 * @returns gird 布局的单元格数: 行数 x 列数
 */
export const get_grids_count
    = (element) => get_row_count(element) * get_col_count(element);

/**
 * 获取行列数
 * @param {dom} element grid布局的 dom 元素
 * @returns gird 布局的行数和列数: [行数, 列数]
 */
export const get_row_col_count
    = (element) => [get_row_count(element), get_col_count(element)]

/**
 * 获取行数
 * @param {dom} element grid布局的 dom 元素
 * @returns gird 布局的行数
 */
export const get_row_count
    = (element) => get_style_property(element, 'grid-template-rows').split(' ').length;

/**
 * 获取列数
 * @param {dom} element grid布局的 dom 元素
 * @returns gird 布局的列数
 */
export const get_col_count
    = (element) => get_style_property(element, 'grid-template-columns').split(' ').length;

