import {
    AiFillAppstore,
    AiFillPicture,
    AiFillCustomerService,
    AiFillQuestionCircle,
    AiFillCode,
    AiFillCloud,
    AiFillSnippets,
    AiFillSignal,
    AiFillSetting,
    AiFillExperiment
} from "react-icons/ai";

export const items = [
    {
        label: 'Image', // 图片
        key: 'image',
        icon: <AiFillPicture />,
        disabled: false,
    },
    {
        label: 'Audio', // 音频
        key: 'audio',
        icon: <AiFillCustomerService />,
        disabled: false,
    },
    {
        label: 'DataAnalysis', // 数据分析
        key: 'dataanalysis',
        icon: <AiFillSignal />,
        disabled: false,
    },
    {
        label: 'Life', // 生活
        key: 'life',
        icon: <AiFillCloud />,
        disabled: false,
    },
    {
        label: 'Plan', // 计划
        key: 'plan',
        icon: <AiFillSnippets />,
        disabled: false,
    },
    {
        label: 'Collection', // 收藏夹
        key: 'collection',
        icon: <AiFillAppstore />,
        disabled: false,
    },
    {
        label: 'Experiment', // 实验项目
        key: 'experiment',
        icon: <AiFillExperiment />,
        disabled: false,
    },
]

/**
 * 预设菜单条目
 */
export const items_preset = [
    {
        label: 'Console', // 控制台
        key: 'console',
        icon: <AiFillCode />,
        disabled: false,
    },
    {
        label: 'Help', // 帮助
        key: 'help',
        icon: <AiFillQuestionCircle />,
        disabled: false,
    },
    {
        label: 'Setting', // 设置
        key: 'setting',
        icon: <AiFillSetting />,
        disabled: false,
    },
]

// 样式类型
export const StyleType = {
    normal: 'normal',
    collapsed: 'collapsed',
    fullscreen: 'fullscreen',
}

/**
 * 样式类型与左边容器的宽度
 */
export const StyleWidth = new Map();
StyleWidth.set(StyleType.normal, 208);
StyleWidth.set(StyleType.collapsed, 56);
StyleWidth.set(StyleType.fullscreen, 0);

