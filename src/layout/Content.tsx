import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import UserContext from '../context/user/UserContext';
import Home from '../pages/Home/Home';
import Login from '../pages/login/Login';

const Content = () => {
  const { state } = useContext(UserContext);

  return (
    <Box
      style={{
        height: 'calc(100vh - 45px - 30px)', // view height - header - footer
        overflow: 'auto',
        width: '100%',
        flex: 1,
      }}
    >
      <BrowserRouter>
        <Routes>
          {state.logged ? (
            <>
              <Route path="/home" element={state.logged ? <Home /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </Box>
  );
};

export default Content;
