/** 可视化检查器 */
let visibleOb = null;

/**
 * 视窗高度
 */
const screenHeight = window.innerHeight;

/**
 * 检查元素们的可视化
 * @param {doms} elements 需要检查是否可视的元素们
 * @param {number} maxDistance 与视窗的最远距离
 * @returns 
 */
export const checkVisible = (elements, maxDistance) => {
    if (!elements) return;

    visibleOb = new IntersectionObserver((entries) => {
        for (let entry of entries) {
            // 当前元素上边缘与视窗上边缘距离
            const top = entry.boundingClientRect.top;
            // 当前元素下边缘与视窗上边缘距离
            const bottom = entry.boundingClientRect.bottom;
            // 是否可视
            let visibility = 'visible';

            // 如果元素不与视窗交叉(即视窗内不可见)，则执行可视化校验
            if (!entry.isIntersecting) {
                // 与视窗的距离（如果 top < 0 说明元素在视窗之上，与）
                const disFromWindow = top < 0
                    ? Math.min(Math.abs(bottom), Math.abs(top))
                    : Math.abs(top - screenHeight);

                /*  如果元素与视窗的距离超过最大限制，则不可视，反之可视
                    这样做的好处是防止视窗内出现部分单元格空白  */
                visibility = disFromWindow < maxDistance ? 'visible' : 'hidden';
            }

            if (entry.target) {
                entry.target.style.visibility = `${visibility}`;
            }
        }
    });

    for (const element of elements) {
        visibleOb.observe(element);
    }
}

/**
 * 检查当前元素下的子元素是否可视
 * @param {dom} parentNode 要检查子元素可视化的dom元素
 * @param {*} maxDistance 距离视窗的最远距离
 */
export const checkChildVisible = (parentNode, maxDistance) => {
    if (parentNode) {
        checkVisible(parentNode.children, maxDistance);
    }
}
