import { ChakraProvider, Grid, GridItem, theme } from '@chakra-ui/react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Content from './layout/Content';
import Nav from './layout/Nav';

import MenuContext from './context/menu/MenuContext';
import { useContext } from 'react';
import UserContext from './context/user/UserContext';

export const App = () => {
  const { state: menuState, setState: setMenuState } = useContext(MenuContext);
  const { state: userState } = useContext(UserContext);

  return (
    <ChakraProvider theme={theme}>
      <Grid
        templateAreas={
          menuState.isVisible && userState.logged
            ? `"header header"
            "nav main"
            "footer footer"`
            : `"header header"
        "main main"
        "footer footer"`
        }
        gridTemplateRows={'45px 1fr 30px'}
        gridTemplateColumns={'250px 1fr'}
        h="100vh"
        padding="0px"
        overflow="hidden"
      >
        <GridItem area={'header'}>
          <Header />
        </GridItem>
        {menuState.isVisible && userState.logged ? (
          <GridItem area={'nav'}>
            <Nav />
          </GridItem>
        ) : null}
        <GridItem area={'main'}>
          <Content />
        </GridItem>
        <GridItem area={'footer'}>
          <Footer />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
};
