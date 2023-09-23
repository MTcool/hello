import React from 'react'
import { Btn } from '../../components/btn'

function clickBtn() {
    console.log("click btn");

    const request = new Request('http://127.0.0.1:3001/data', {
        method: 'GET',

        headers: new Headers({
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        })
    });

    fetch(request)
        .then(response => response.text())
        .then(text => console.log("# [DEBUG]:", text))
        .catch(error => console.error("# [ERROR]:", error));
}

class TestPortApp extends React.Component {

    render() {
        return (
            <div>
                <Btn func={clickBtn}>hello</Btn>
            </div>
        );
    }
}

export default TestPortApp;