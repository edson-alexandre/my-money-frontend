import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import UserContext from '../../context/user/UserContext';

const Home = () => {
  const { state: userState } = useContext(UserContext);

  return (
    <Box className="p-4">
      <i
        className="bi bi-emoji-smile-fill"
        style={{
          color: 'yellow',
          fontSize: '2em',
        }}
      />
      <span style={{ fontWeight: 900, fontSize: '1.6em', marginLeft: 20 }}>Olá {userState.name}!</span>{' '}
    </Box>
  );
};

export default Home;
