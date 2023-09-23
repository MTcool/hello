
/**
 * 音频应用的标题
 */
export const title = [
    // {
    //     col: 'audio', // 字段列ID
    //     label: '音频', // 标题名
    //     width: '30vw', // 宽度
    //     align: 'center', // 排列
    //     allowSort: false, // 是否允许排序（是否展示排序按钮）
    // visible: true, // 是否可视
    // },
    {
        col: 'src',
        label: '音频资源',
        width: '0vw',
        align: 'center',
        allowSort: false,
        visible: false,
    },
    {
        col: 'name',
        label: '文件名称',
        width: '30vw',
        align: 'left',
        allowSort: true,
        visible: true,
    },
    {
        col: 'size',
        label: '文件大小/M',
        width: '10vw',
        align: 'right',
        allowSort: true,
        visible: true,
    },
    {
        col: 'type',
        label: '文件类型',
        width: '10vw',
        align: 'center',
        allowSort: true,
        visible: true,
    },
    {
        col: 'time',
        label: '修改时间',
        width: '20vw',
        align: 'center',
        allowSort: true,
        visible: true,
    },


];