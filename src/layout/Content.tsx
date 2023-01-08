import { useColorModeValue } from '@chakra-ui/react';
import { useContext } from 'react';
import MenuContext from '../context/menu/MenuContext';
import UserContext from '../context/user/UserContext';
import Router from './Router';

const Content = () => {
  const colorMode = useColorModeValue('light', 'dark');
  const { state: menuState } = useContext(MenuContext);
  const { state: userState } = useContext(UserContext);

  return (
    <div
      style={{
        height: 'calc(100vh - 45px - 30px)', // view height - header - footer
        overflow: 'auto',
        width: menuState.isVisible && userState.logged ? 'calc(100vw - 250px)' : '100vw',
        flex: 1,
        backgroundColor: colorMode === 'dark' ? '#222' : '#efefef',
      }}
    >
      <Router />
    </div>
  );
};

export default Content;
