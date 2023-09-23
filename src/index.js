import React from 'react'
import ReactDOM from 'react-dom/client'
import EntranceApp from './apps/entrance/entrance'
import { ClearCacheProvider, useClearCacheCtx } from 'react-clear-cache';

import './css/base.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
// 使用严格模式
// root.render(
//     <React.StrictMode>
//         <EntranceApp />
//     </React.StrictMode>
// );

// 不使用严格模式
root.render(
    // <ClearCacheProvider duration={5000}>
        <EntranceApp />
    // </ClearCacheProvider>
);

