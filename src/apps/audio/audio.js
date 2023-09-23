import React from 'react'

import { Btn } from '../../components/btn/btn'
import { AudioPlayBar } from './audioDetail'
import { TableApp } from '../../components/table/table'
import { Data } from '../../datastruct/data'
import { Row } from '../../datastruct/row'

import * as ENUM from '../const/const'
import * as AuConst from './audioConst'
import * as filehandler from '../../utility/file/filehandler'

import './audio.css'
import '../../css/base.css'

/** 最大加载音频个数 */
const MAX_AUDIO = 200;

/**
 * 音频应用
 * liuzhen
 * 20230812
 */
class AudioApp extends React.Component {
    constructor(props) {
        super(props);
        this.gridsContainerRef = React.createRef(); // 音频单元格容器引用
        this.state = {
            style_app: ENUM.Style_Hide, // 音频 app 的样式
            grids: [], // 音频单元格子元素对象
            files: [], // 音频文件们
            fileinfos: [], // 音频文件信息们
            data: new Data(), // 音频列表总数据集
            render: false, // 重新绘制
            audio_bar_func: new Map(), // 音频播放反注册函数们

            /** 播放器 */
            curAudioInfo: null, // 当前播放器播放的音频信息
        }
    }

    /**
     * 打开图片文件夹，选择图片
     */
    openDir = async () => {
        // 清空图片文件
        this.setState({
            grids: [],
            files: [],
            data: new Data(),
        });

        // 获取文件夹下所有的音频文件
        const files = await filehandler.fetchFiles(true, filehandler.FILE_TYPE.audio, MAX_AUDIO);
        if (!files) {
            console.log('no files');
            return;
        }

        // 加载音频文件信息
        const fileinfos = filehandler.getFileinfos(files);

        this.setState({
            files: files,
            fileinfos: fileinfos,
        });

        for (const fileinfo of fileinfos) {
            const row = new Row();
            row.set('src', fileinfo.src);
            row.set('name', fileinfo.name);
            row.set('size', `${fileinfo.size_M}`);
            row.set('type', fileinfo.type);
            row.set('time', fileinfo.lastModifiedDate);
            this.state.data.add(row);
            this.setState({
                render: true,
            });
        }
    }

    /**
     * 音频点击函数
     */
    play_audio = (audio_row) => {
        // console.log('# play:', audio_row.get('name'));

        if (this.state.audio_bar_func.get('changeAudio')) {
            this.state.audio_bar_func.get('changeAudio')(audio_row)
        }
    }

    /**
     * 反注册函数
     * @param {*} func 
     */
    register_func = (key, func) => {
        this.state.audio_bar_func.set(key, func);
    }

    /**
     * 隐藏或展示本 app
     */
    toggleApp = (isShow) => {
        // console.log('audio:', isShow);
        this.setState({
            style_app: isShow ? ENUM.Style_Show : ENUM.Style_Hide,
        });
    }

    render() {
        const { registerFunc } = this.props;

        const funcs = new Map();
        funcs.set('toggle', this.toggleApp);
        funcs.set('adjust', this.adjustGrids);
        registerFunc('audio', funcs);

        return (
            <div className='audio_main app_main' style={this.state.style_app}>
                <div className='grids_btn'>
                    <Btn click_func={this.openDir} name={'选择音频'} />
                </div>

                <TableApp
                    data={this.state.data}
                    title={AuConst.title}
                    row_click={this.play_audio}
                    gap={'calc(var(--default_gap) * 2)'}
                />

                <AudioPlayBar
                    register_func={this.register_func}
                />
            </div>
        )
    };
}

export { AudioApp };
