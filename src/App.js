import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import './App.css';
import { Outlet } from 'react-router-dom';
// new node
function App() {
    return (_jsx(_Fragment, { children: _jsx(Outlet, {}) }));
}
export default App;
