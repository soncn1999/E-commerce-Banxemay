import React, { useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import './style.scss';
import './css/styles.css';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, Register, Cart, Detail } from './pages/public';
import { Private } from './pages/private';
import { AddNewProduct, AddSysUserByAdmin, HandleProductInfo, HandleUserInfo } from './components';
import path from './utils/path';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.CART} element={<Cart />} />
          <Route path={`${path.PRODUCTS}/:pid`} element={<Detail />} />
        </Route>
        <Route path={path.PRIVATE} element={<Private />}>
          <Route path={path.LIST_USERS} element={<HandleUserInfo />} />
          <Route path={path.LIST_PRODUCTS} element={<HandleProductInfo />} />
          <Route path={path.PRODUCT_ADD} element={<AddNewProduct />} />
          <Route path={path.ADD_SYS_USER} element={<AddSysUserByAdmin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
