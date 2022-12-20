import {
  Box,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Progress,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICustomer } from '../../interfaces/ICustomer';

const initialCustomer = {
  name: '',
  email: '',
  cgcCpf: '',
  contact: '',
  city: '',
  state: '',
  street: '',
  number: '',
  details: '',
  district: '',
  zip: '',
  country: '',
};

const CustomerForm = () => {
  const params = useParams();
  const path = useLocation();
  const [action] = useState(path.pathname.split('/').indexOf('new') === -1 ? 'edit' : 'new');
  const [customerId] = useState(params.id || '');
  const [customer, setCustomer] = useState<ICustomer>(initialCustomer);
  const [loading, setLoading] = useState(false);
  const customerRequest = useCustomerRequests();
  const toast = useToast();
  const colorMode = useColorModeValue('light', 'dark');

  const schema = yup
    .object({
      name: yup.string().required('Campo obrigatório'),
      email: yup.string().required('Campo obrigatório').email('Favor informar um e-mail válido'),
      cgcCpf: yup.string().required('Campo obrigatório').email('Favor informar um e-mail válido'),
      city: yup.string().required('Campo obrigatório'),
      state: yup.string().required('Campo obrigatório'),
      street: yup.string().required('Campo obrigatório'),
      number: yup.string().required('Campo obrigatório'),
      details: yup.string().required('Campo obrigatório'),
      district: yup.string().required('Campo obrigatório'),
      zip: yup.string().required('Campo obrigatório'),
      country: yup.string().required('Campo obrigatório'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICustomer>({
    resolver: yupResolver(schema),
  });

  const loadCustomer = async () => {
    setLoading(true);
    await customerRequest
      .listCustomerById(customerId)
      .then(customer => {
        setCustomer(customer);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast({
          title: 'Ocorreu um erro ao carregar os dados',
          description: error.message,
          status: 'error',
          variant: 'solid',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };

  useEffect(() => {
    loadCustomer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitForm = async (data: ICustomer) => {};

  return (
    <div className="p-2">
      <PageTitle title={action === 'new' ? ' INCLUSÃO DE CLIENTE' : 'EDIÇÃO DE CLIENTE'} />
      {!loading || <Progress size="xs" isIndeterminate />}
      <form onSubmit={handleSubmit(submitForm)}>
        <FormControl isInvalid={Boolean(errors?.name?.message)} mt={7}>
          <InputGroup>
            <Input
              {...register('name')}
              type="text"
              placeholder="Nome"
              size="sm"
              value={customer?.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              backgroundColor={colorMode === 'dark' ? '#222' : '#fff'}
            />
          </InputGroup>
          <Box minHeight="1em">
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </Box>
        </FormControl>
        <FormControl isInvalid={Boolean(errors?.name?.message)}>
          <InputGroup>
            <Input
              {...register('email')}
              type="text"
              placeholder="E-mail"
              size="sm"
              value={customer?.email}
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
              backgroundColor={colorMode === 'dark' ? '#222' : '#fff'}
            />
          </InputGroup>
          <Box minHeight="1em">
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </Box>
        </FormControl>
      </form>
    </div>
  );
};

export default CustomerForm;
