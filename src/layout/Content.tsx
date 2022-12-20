import { Box, useColorModeValue } from '@chakra-ui/react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserContext from '../context/user/UserContext';
import Account from '../pages/account/Account';
import AccountsPayable from '../pages/accountsPayable/AccountsPayable';
import AccountsReceivable from '../pages/accountsReceivable/AccountsReceivable';
import Customer from '../pages/customer/Customer';
import CustomerForm from '../pages/customer/CustomerForm';
import Home from '../pages/Home/Home';
import Login from '../pages/login/Login';
import Supplier from '../pages/supplier/Supplier';

const Content = () => {
  const { state } = useContext(UserContext);
  const colorMode = useColorModeValue('light', 'dark');

  return (
    <Box
      style={{
        height: 'calc(100vh - 45px - 30px)', // view height - header - footer
        overflow: 'auto',
        width: '100%',
        flex: 1,
        backgroundColor: colorMode === 'dark' ? '#222' : '#dfdfdf',
      }}
    >
      <Routes>
        {state.logged ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customer/:id/edit" element={<CustomerForm />} />
            <Route path="/customer/:id/new" element={<CustomerForm />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/accounts-receivable" element={<AccountsReceivable />} />
            <Route path="/accounts-payable" element={<AccountsPayable />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Box>
  );
};

export default Content;
