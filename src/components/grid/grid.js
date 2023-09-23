import React from 'react'

import '../css/grid.css'

class GridApp extends React.Component {

    render() {
        const { width, height } = this.props;

        let style = {
            width: width || '100vw',
            height: height || '100vh',
        }

        return (
            <div style={style} className='grid'></div>
        );
    }
}

export { GridApp };