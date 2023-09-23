import React from 'react'

import './btn.css'

class Btn extends React.Component {

    render() {
        let { click_func, name, width, height } = this.props;

        let style = {
            width: width || '6em',
            height: height || '2em',
        }

        return (
            <div style={style} className='btn' onClick={click_func}>
                {name}
            </div>
        );
    }
}

export { Btn };