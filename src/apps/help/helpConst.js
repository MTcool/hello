/** 帮助们 */
export const helps = {
    'image': [
        {
            C_ID: 'F',
            C_NAME: '全屏'
        },
        {
            C_ID: 'Space',
            C_NAME: '恢复图片 (包括旋转角度，大小尺寸)'
        },
        {
            C_ID: '←',
            C_NAME: '上一张图片 (左侧)'
        },
        {
            C_ID: '→',
            C_NAME: '下一张图片 (右侧)'
        },
        {
            C_ID: '↑',
            C_NAME: '上一张图片 (上方)'
        },
        {
            C_ID: '↓',
            C_NAME: '下一张图片 (下方)'
        },
        {
            C_ID: 'Ctrl + ←',
            C_NAME: '图片向左旋转 15°'
        },
        {
            C_ID: 'Ctrl + ↑',
            C_NAME: '图片向右旋转 15°'
        },
        {
            C_ID: 'Shift + ←',
            C_NAME: '图片向左旋转 90°'
        },
        {
            C_ID: 'Shift + →',
            C_NAME: '图片向右旋转 90°'
        },
        {
            C_ID: 'Ctrl + ↑',
            C_NAME: '图片放大 (speed = 0.1)'
        },
        {
            C_ID: 'Ctrl + ↓',
            C_NAME: '图片缩小 (speed = 0.1)'
        },
        {
            C_ID: 'Shift + ↑',
            C_NAME: '图片放大 (speed = 0.5)'
        },
        {
            C_ID: 'Shift + ↓',
            C_NAME: '图片缩小 (speed = 0.5)'
        },
    ],

}

// 将对象转换为JSON字符串
// const jsonString = JSON.stringify(obj);

// JSON字符串转换为JavaScript对象
// const obj = JSON.parse(jsonString);

/** 帮助标题 */
export const title = [
    {
        col: 'C_ID',
        label: '按键',
        width: '10vw',
        align: 'right',
        allowSort: false,
        visible: true,
    },
    {
        col: 'C_NAME',
        label: '描述',
        width: '20vw',
        align: 'left',
        allowSort: false,
        visible: true,
    },

];