import { useContext } from 'react';
import { Box, Grid } from '@chakra-ui/react';

import UserContext from '../context/user/UserContext';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import MenuContext from '../context/menu/MenuContext';

import { useLocalStorage } from '../hooks/providers/useLocalStorage';

const Header = () => {
  const { state, setState } = useContext(UserContext);
  const { state: menuState, setState: setMenuState } = useContext(MenuContext);
  const localStorage = useLocalStorage();

  const signout = () => {
    setState({
      email: '',
      name: '',
      logged: false,
      token: '',
    });
    localStorage.clear();
  };

  return (
    <Grid
      width="100%"
      height="100%"
      px={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      style={{
        backgroundImage: 'linear-gradient(to right top, #56CCF2, #2F80ED)',
      }}
    >
      <Box display="flex" justifyContent="flex-start" alignItems="center" flex={1}>
        {!state.logged || (
          <>
            <i
              className="bi bi-list"
              style={{
                fontSize: '2em',
                cursor: 'pointer',
              }}
              onClick={() => setMenuState({ ...menuState, isVisible: !menuState.isVisible })}
            />
            <i
              className="bi bi-emoji-smile-fill"
              style={{
                color: 'yellow',
                fontSize: '2em',
                marginLeft: '200px',
              }}
            />
            <Box>
              <span style={{ fontWeight: 900, fontSize: '1.2em', marginLeft: 20 }}>Olá {state.name}!</span>{' '}
            </Box>
          </>
        )}
      </Box>
      <Box fontSize="1.7em" fontWeight={900} display="flex">
        My Money
      </Box>
      <Box display="flex" flex={1} justifyContent="flex-end" alignItems="center">
        <ColorModeSwitcher />
        <i className="bi bi-power mx-3 " style={{ fontSize: '1.2em', cursor: 'pointer' }} onClick={() => signout()} />
      </Box>
    </Grid>
  );
};

export default Header;
