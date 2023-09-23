import React from 'react';

import './audio.css'

/**
 * 音频单元格
 * liuzhen
 * 20230812
 */
class AuGrid extends React.Component {

    render() {
        const { auInfo } = this.props;

        return (
            <div className='audio'>
                <audio className='audio_src' controls preload="auto">
                    <source src={auInfo.src} type="audio/mpeg" />
                    <source src={auInfo.src} type="audio/wav" />
                    <source src={auInfo.src} type="audio/ogg" />
                </audio>
                <div className='audio_name audio_text'>{auInfo.name}</div>
                <div className='audio_size audio_text'>{auInfo.size_M}</div>
                <div className='audio_type audio_text'>{auInfo.type}</div>
                <div className='audio_time audio_text'>{auInfo.lastModifiedDate}</div>
            </div>
        );
    }
}

export { AuGrid };

/**
 * 音频组件
 * liuzhen
 * 20230826
 */
class AudioElement extends React.Component {

    render() {
        const { auInfo } = this.props;

        return (
            <audio className='audio_src' controls preload="auto">
                <source src={auInfo.src} type="audio/mpeg" />
                <source src={auInfo.src} type="audio/wav" />
                <source src={auInfo.src} type="audio/ogg" />
            </audio>
        );
    }
}

export { AudioElement };

/**
 * 音频播放条
 * liuzhen
 * 20230904
 */
class AudioPlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.mref = React.createRef();
        this.state = {
            name: '', // 音频文件名
            src: null, // 音频源
        }
    }

    /**
     * 切换音源
     */
    changeAudio = (row) => {
        this.setState({
            src: row ? row.get('src') : '',
            name: row ? row.get('name') : '',
        }, () => {
            this.mref.current.load();
        });
    }

    /**
     * 按键监听
     * @param {*} event 按键事件
     */
    pressKey = (event) => {
        console.log(event.key);
    }

    render() {
        const { auInfo, register_func } = this.props;
        const src = auInfo ? auInfo.get('src') : null;
        const name = auInfo ? auInfo.get('name') : '';

        if (register_func) {
            register_func('changeAudio', this.changeAudio);
        }

        return (
            <div
                className='audio_player'
                onKeyDown={this.pressKey}
            >
                <div className='audio_player_text'>
                    {this.state.name || name}
                </div>
                <audio
                    className='audio_bar'
                    controls
                    preload="auto"
                    ref={this.mref}
                >

                    <source src={this.state.src || src} type="audio/mpeg" />
                    <source src={this.state.src || src} type="audio/wav" />
                    <source src={this.state.src || src} type="audio/ogg" />
                </audio>
                <div>

                </div>
            </div>
        );
    }
}

export { AudioPlayBar };
