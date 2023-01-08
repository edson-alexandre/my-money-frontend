import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

import UserContext from '../../context/user/UserContext';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../hooks/services/useAuth';
import { useNavigate } from 'react-router-dom';
import MenuContext from '../../context/menu/MenuContext';
import { useLocalStorage } from '../../hooks/providers/useLocalStorage';

interface IFormInputs {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required('Favor informar o email').email('Favor informar um e-mail válido'),
    password: yup.string().required('Favor informar a senha'),
  })
  .required();

const Login = () => {
  const [loading, setLoaging] = useState(false);

  const navigate = useNavigate();
  const authRequest = useAuth();
  const localStorage = useLocalStorage();
  const toast = useToast();

  const { state, setState } = useContext(UserContext);
  const { state: menuState, setState: setMenuState } = useContext(MenuContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const colorMode = useColorModeValue('light', 'dark');
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = async (data: IFormInputs) => {
    setLoaging(true);
    await authRequest
      .signin(data.email, data.password)
      .then(user => {
        setMenuState({ ...menuState, isVisible: true });
        localStorage.setItem('auth', {
          user: {
            logged: true,
            name: user.name,
            email: user.email,
            token: user.token,
          },
        });
        localStorage.setItem('logged', true);
        setState({
          ...state,
          logged: true,
          name: user.name,
          email: user.email,
          token: user.token,
        });
        setLoaging(false);
        navigate('/home');
      })
      .catch(error => {
        setLoaging(false);
        console.log(error);
        toast({
          title: 'Problema ao logar.',
          description: error.message,
          status: 'error',
          variant: 'solid',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };

  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="500px"
        height="300px"
        borderRadius={10}
        backgroundImage={'linear-gradient(to right top, #56CCF2, #1d4e89)'}
        p={5}
      >
        <Box display="flex" justifyContent="center" fontSize="1.3em" fontWeight={600}>
          Acessar o Sistema
        </Box>
        <div
          style={{
            width: '97%',
            minHeight: 0.07,
            backgroundColor: colorMode === 'dark' ? '#fff' : '#fff',
          }}
        ></div>

        <form style={{ width: '100%' }} onSubmit={handleSubmit(submitForm)}>
          <Stack>
            <FormControl isInvalid={Boolean(errors?.email?.message)} mt={7}>
              <InputGroup>
                <InputLeftElement>
                  <i className="bi bi-person" />
                </InputLeftElement>
                <Input
                  {...register('email')}
                  type="text"
                  placeholder="E-mail"
                  size="sm"
                  backgroundColor={colorMode === 'dark' ? '#222' : '#fff'}
                />
              </InputGroup>
              <Box minHeight="1em">
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isInvalid={Boolean(errors?.password?.message)}>
              <InputGroup mt={5}>
                <InputLeftElement>
                  <i className="bi bi-lock"></i>
                </InputLeftElement>
                <InputRightElement>
                  <i
                    style={{ cursor: 'pointer' }}
                    className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </InputRightElement>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  size="sm"
                  backgroundColor={colorMode === 'dark' ? '#222' : '#fff'}
                />
              </InputGroup>
              <Box minHeight="1em">
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </Box>
            </FormControl>
            <Box>
              <Button
                backgroundColor={colorMode === 'dark' ? '#fff' : '#fff'}
                color={colorMode === 'dark' ? '#000' : '#000'}
                py={2}
                type="submit"
                size="sm"
                isLoading={loading}
              >
                Acessar
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
