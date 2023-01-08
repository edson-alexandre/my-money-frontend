import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserContext from '../context/user/UserContext';

// Componentes
import Account from '../pages/account/Account';
import AccountForm from '../pages/account/AccountForm';
import AccountsPayable from '../pages/accountsPayable/AccountsPayable';
import AccountsReceivable from '../pages/accountsReceivable/AccountsReceivable';
import Customer from '../pages/customer/Customer';
import CustomerForm from '../pages/customer/CustomerForm';
import Home from '../pages/Home/Home';
import Login from '../pages/login/Login';
import Supplier from '../pages/supplier/Supplier';
import SupplyerForm from '../pages/supplier/SupplyerForm';

const Router = () => {
  const { state } = useContext(UserContext);
  return (
    <>
      <Routes>
        {state.logged ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customer/:id/edit" element={<CustomerForm />} />
            <Route path="/customer/:id/new" element={<CustomerForm />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/supplyer/:id/edit" element={<SupplyerForm />} />
            <Route path="/supplyer/:id/new" element={<SupplyerForm />} />
            <Route path="/accounts-receivable" element={<AccountsReceivable />} />
            <Route path="/accounts-payable" element={<AccountsPayable />} />
            <Route path="/account/:id/edit" element={<AccountForm />} />
            <Route path="/account/:id/new" element={<AccountForm />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Router;
