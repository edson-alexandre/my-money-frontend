import { SlideFade, ChakraProvider, Grid, GridItem, theme } from '@chakra-ui/react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Content from './layout/Content';
import Nav from './layout/Nav';

import MenuContext from './context/menu/MenuContext';
import { useContext } from 'react';
import UserContext from './context/user/UserContext';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {
  const { state: menuState } = useContext(MenuContext);
  const { state: userState } = useContext(UserContext);

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Grid
          overflow="hidden"
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
        >
          <GridItem area={'header'}>
            <Header />
          </GridItem>
          {menuState.isVisible && userState.logged ? (
            <GridItem area={'nav'}>
              <SlideFade in={true} style={{ height: '100%', zIndex: 10 }}>
                <Nav />
              </SlideFade>
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
    </BrowserRouter>
  );
};
