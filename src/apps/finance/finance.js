import React from 'react'
import TableApp from '../components/table'

const dataSource = [
    {
        key: '1',
        name: 'hello',
        age: 32,
        address: '西湖区湖底公园1号',
    },
    {
        key: '2',
        name: 'world',
        age: 42,
        address: '西湖区湖底公园1号',
},
];

class FinanceApp extends React.Component {

    render() {
        return (
            <div>
                <TableApp dataSource={dataSource} />
            </div>
        );
    }
}

export default FinanceApp;