import React, { useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import './style.scss';
import './css/styles.css';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, Register, Cart, Detail } from './pages/public';
import { Private } from './pages/private';
import { AddNewBrand, AddNewCategory, AddNewProduct, AddSysUserByAdmin, HandleBrandInfo, HandleCategoryInfo, HandleProductInfo, HandleUserAdminInfo, HandleUserBlocked, HandleUserInfo } from './components';
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
          <Route path={`/${path.PRODUCTS}/:pid`} element={<Detail />} />
        </Route>
        <Route path={path.PRIVATE} element={<Private />}>
          <Route path={path.LIST_USERS} element={<HandleUserInfo />} />
          <Route path={path.LIST_USERS_ADMIN} element={<HandleUserAdminInfo />} />
          <Route path={path.LIST_USERS_BLOCK} element={<HandleUserBlocked />} />
          <Route path={path.LIST_BRAND} element={<HandleBrandInfo />} />
          <Route path={path.LIST_PRODUCTS} element={<HandleProductInfo />} />
          <Route path={path.PRODUCT_ADD} element={<AddNewProduct />} />
          <Route path={path.ADD_SYS_USER} element={<AddSysUserByAdmin />} />
          <Route path={path.ADD_BRAND} element={<AddNewBrand />} />
          <Route path={path.ADD_CATEGORY} element={<AddNewCategory />} />
          <Route path={path.LIST_CATEGORY} element={<HandleCategoryInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
