import React from 'react'
import { Btn } from '../../components/btn'
import { GridApp } from '../../components/grid'

import * as filehandler from '../../utility/file/filehandler'

import '../../css/grid.css'

function clickBtn() {
    filehandler.fetchFiles();
}

function diskInfo() {
    filehandler.getFileinfo();
}

class TestFileApp extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <div className='grid'>
                <Btn click_func={clickBtn} name={'fetchFiles'} />
                <Btn click_func={diskInfo} name={'DiskInfo'} />
            </div>
        );
    }
}

export default TestFileApp;