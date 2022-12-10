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
} from "@chakra-ui/react";
import { useContext, useState } from "react";

import UserContext from "../../context/user/UserContext";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocalStorage } from "../../hooks/providers/useLocalStorage";

interface IFormInputs {
  email: string;
  password: number;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required("Favor informar o email")
      .email("Favor informar um e-mail válido"),
    password: yup.string().required("Favor informar a senha"),
  })
  .required();

function Login() {
  const localStorage = useLocalStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const colorMode = useColorModeValue("dark", "light");
  const [showPassword, setShowPassword] = useState(false);
  const { state, setState } = useContext(UserContext);

  const submitForm = (data: IFormInputs) => {
    localStorage.setItem("auth", {
      user: {
        name: data.email,
        email: data.email,
      },
    });
    localStorage.setItem("logged", true);
    setState({
      ...state,
      logged: true,
      name: data.email,
      email: data.email,
      token: "",
    });
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="500px"
        height="300px"
        borderRadius={10}
        backgroundColor={colorMode === "light" ? "#222" : "#33acdd"}
        position="relative"
        p={10}
      >
        <Box
          display="flex"
          justifyContent="center"
          fontSize="1.3em"
          position="absolute"
          top="5"
          fontWeight={600}
          // color={colorMode === "light" ? "#222" : "#fff"}
        >
          Acessar o Sistema
        </Box>
        <div
          style={{
            width: "97%",
            minHeight: 0.07,
            backgroundColor: colorMode === "light" ? "#fff" : "#fff",
            marginBottom: 30,
            position: "absolute",
            top: 60,
          }}
        ></div>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(submitForm)}>
          <FormControl isInvalid={Boolean(errors?.email?.message)} mt={7}>
            <InputGroup>
              <InputLeftElement>
                <i className="bi bi-person" />
              </InputLeftElement>
              <Input
                {...register("email")}
                type="text"
                placeholder="E-mail"
                size="sm"
                backgroundColor={colorMode === "light" ? "#222" : "#fff"}
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
                  style={{ cursor: "pointer" }}
                  className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </InputRightElement>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                size="sm"
                backgroundColor={colorMode === "light" ? "#222" : "#fff"}
              />
            </InputGroup>
            <Box minHeight="1em">
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </Box>
          </FormControl>
          <Button
            backgroundColor={colorMode === "light" ? "#fff" : "#fff"}
            color={colorMode === "light" ? "#000" : "#000"}
            py={2}
            type="submit"
            position="absolute"
            bottom={5}
            size="sm"
          >
            Acessar
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
