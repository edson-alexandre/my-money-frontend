import { Box, Button, Progress, Radio, RadioGroup, Stack } from '@chakra-ui/react';

import { Input } from '../../components/my-input/Input.styled';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TestContext } from 'yup';
import { ICustomer } from '../../interfaces/ICustomer';
import { ErrorMessage } from '../../components/my-input/ErrorMessage.styled';
import { Row, Col } from 'react-bootstrap';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useViaCepRequest } from '../../hooks/services/useViaCepRequest';
import { IAddress } from '../../interfaces/IAddress';
import { InputMask } from '../../components/my-input/Input.styled';
import { useToastr } from '../../hooks-util/useToastr';

const initialCustomer = {
  name: '',
  email: '',
  personType: 'JURIDICA',
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
  const cepRequest = useViaCepRequest();
  const toastr = useToastr();
  const navigate = useNavigate();

  const schema = yup
    .object({
      name: yup.string().required('Campo obrigatório'),
      email: yup.string().required('Campo obrigatório').email('Favor informar um e-mail válido'),
      cgcCpf: yup
        .string()
        .required('CNPJ / CPF Não informado')
        .test((cgcCpf: string = '', schema: TestContext) => {
          const value = cgcCpf?.replaceAll('.', '')?.replaceAll('-', '');
          if (customer.personType === 'FISICA' && !cpf.isValid(value)) {
            return schema.createError({ message: 'CPF inválido' });
          } else if (schema?.parent?.personType === 'JURIDICA' && !cnpj.isValid(value)) {
            return schema.createError({ message: 'CPF inválido' });
          } else {
            return true;
          }
        }),
      zip: yup.string().required('Campo obrigatório'),
      street: yup.string().required('Campo obrigatório'),
      number: yup.string().required('Campo obrigatório'),
      city: yup.string().required('Campo obrigatório'),
      state: yup.string().required('Campo obrigatório'),
      district: yup.string().required('Campo obrigatório'),
      country: yup.string().required('Campo obrigatório'),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICustomer>({
    resolver: yupResolver(schema),
  });

  const getAddress = async (zip: string) => {
    setLoading(true);
    const cep = `${zip}`.replaceAll('-', '').replaceAll('.', '');
    await cepRequest
      .getAddresByCep(cep)
      .then((address: IAddress) => {
        setLoading(false);
        setCustomer(state => {
          return {
            ...state,
            city: address.localidade,
            state: address.uf,
            street: address.logradouro,
            details: address.complemento,
            district: address.bairro,
            country: 'Brasil',
          };
        });
        reset({
          ...customer,
          city: address.localidade,
          state: address.uf,
          street: address.logradouro,
          details: address.complemento,
          district: address.bairro,
          country: 'Brasil',
        });
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao obter os dados do CEP', error.message);
      });
  };

  const loadCustomer = async () => {
    setLoading(true);
    await customerRequest
      .listById?.(customerId)
      .then(customer => {
        setCustomer({ ...customer });
        reset({ ...customer });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const updateCustomer = async () => {
    await setLoading(true);
    const zip = `${customer?.zip}`.replaceAll('-', '');
    await setCustomer(state => {
      return {
        ...state,
        zip,
      };
    });
    customerRequest
      .update?.(customerId, { ...customer, zip })
      .then(() => {
        setLoading(false);
        toastr.toastr('success', 'SUCESSO', 'Os dados foram salvos com sucesso');
        navigate('/customer');
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const createCustomer = async () => {
    await setLoading(true);
    const zip = `${customer?.zip}`.replaceAll('-', '');
    await setCustomer(state => {
      return {
        ...state,
        zip,
      };
    });
    customerRequest
      .create?.({ ...customer, zip })
      .then(() => {
        setLoading(false);
        toastr.toastr('success', 'SUCESSO', 'Os dados foram salvos com sucesso');
        navigate('/customer');
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  useEffect(() => {
    if (customerId !== '0') {
      loadCustomer();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitForm = async (data: ICustomer) => {
    if (customerId === '0') {
      await createCustomer();
    } else {
      await updateCustomer();
    }
  };

  return (
    <div className="p-2">
      <PageTitle title={action === 'new' ? ' INCLUSÃO DE CLIENTE' : 'EDIÇÃO DE CLIENTE'}>
        <Button variant="outline" onClick={() => navigate('/customer')}>
          Voltar
        </Button>
      </PageTitle>
      {!loading || <Progress size="xs" isIndeterminate />}
      <form
        onSubmit={handleSubmit(submitForm)}
        style={{ display: 'flex', flexDirection: 'column', padding: '0px 40px 0px 40px' }}
      >
        <Row columns={[1]}>
          <Col cols={12} md={12}>
            <label style={{ marginTop: '10px' }}>Tipo de Pessoa</label>
            <RadioGroup
              size="md"
              value={customer.personType}
              onChange={personType =>
                setCustomer(state => {
                  return { ...state, personType };
                })
              }
            >
              <Stack direction="row">
                <Radio value="JURIDICA">Jurídica</Radio>
                <Radio value="FISICA">Física</Radio>
              </Stack>
            </RadioGroup>
          </Col>
          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>{`${customer.personType === 'FISICA' ? 'CPF' : 'CNPJ'} `}</label>
              <Controller
                control={control}
                name="cgcCpf"
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputMask
                      placeholder="Informe o CNPJ / CPF do cliente"
                      mask={`${customer.personType === 'FISICA' ? '000.000.000-00' : '00.000.000/0000-00'} `}
                      onAccept={value => {
                        onChange(value);
                        setCustomer(state => {
                          return {
                            ...state,
                            cgcCpf: value,
                          };
                        });
                      }}
                      value={customer.cgcCpf}
                      p={5}
                    />
                  );
                }}
              />

              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.cgcCpf?.message) ? <ErrorMessage>{errors?.cgcCpf?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Nome do cliente</label>
              <Input
                {...register('name')}
                type="text"
                placeholder="Informe o nome do cliente"
                p={5}
                value={`${customer.name}`}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, name: e.target.value };
                  })
                }
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.name?.message) ? <ErrorMessage>{errors?.name?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>E-mail do cliente</label>
              <Input
                {...register('email')}
                type="text"
                placeholder="Informe o e-mail do cliente"
                p={5}
                value={customer.email}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, email: e.target.value };
                  })
                }
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.email?.message) ? <ErrorMessage>{errors?.email?.message} </ErrorMessage> : null}
            </Box>
          </Col>

          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Contato do Cliente</label>
              <Input
                type="text"
                placeholder="Informe o contato do cliente"
                value={customer.contact}
                onChange={e =>
                  setCustomer(state => {
                    return {
                      ...state,
                      contact: e.target.value,
                    };
                  })
                }
                p={5}
              />
            </Box>
          </Col>

          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>{`CEP `}</label>
              <Controller
                control={control}
                name="zip"
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputMask
                      placeholder="Informe o CEP"
                      mask={`00000-000`}
                      onAccept={async currentValue => {
                        onChange(currentValue);
                        setCustomer(state => {
                          return { ...state, zip: currentValue };
                        });
                      }}
                      value={`${customer.zip}`}
                      onBlur={async e => await getAddress(e.target.value)}
                      p={5}
                    />
                  );
                }}
              />

              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.zip?.message) ? <ErrorMessage>{errors?.zip?.message} </ErrorMessage> : null}
            </Box>
          </Col>

          <Col cols={12} md={8}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Logradouro</label>
              <Input
                {...register('street')}
                type="text"
                placeholder="Informe o logradouro"
                value={customer.street}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, street: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.street?.message) ? <ErrorMessage>{errors?.street?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={4}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Número</label>
              <Input
                {...register('number')}
                type="text"
                placeholder="Informe o Número"
                value={customer.number}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, number: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.number?.message) ? <ErrorMessage>{errors?.number?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={6}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Bairro</label>
              <Input
                {...register('district')}
                type="text"
                placeholder="Informe o bairro"
                value={customer.district}
                onChange={e =>
                  setCustomer(state => {
                    return {
                      ...state,
                      district: e.target.value,
                    };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.district?.message) ? <ErrorMessage>{errors?.district?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={6}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Complemento</label>
              <Input
                type="text"
                placeholder="Informe o complemento"
                value={customer.details}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, details: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.details?.message) ? <ErrorMessage>{errors?.details?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={4}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Cidade</label>
              <Input
                {...register('city')}
                type="text"
                placeholder="Informe o cidade"
                value={customer.city}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, city: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.city?.message) ? <ErrorMessage>{errors?.city?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={4}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Estado</label>
              <Input
                {...register('state')}
                type="text"
                placeholder="Informe o estado"
                value={customer.state}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, state: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.state?.message) ? <ErrorMessage>{errors?.state?.message} </ErrorMessage> : null}
            </Box>
          </Col>
          <Col cols={12} md={4}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>País</label>
              <Input
                {...register('country')}
                type="text"
                placeholder="Informe o país"
                value={customer.country}
                onChange={e =>
                  setCustomer(state => {
                    return { ...state, country: e.target.value };
                  })
                }
                p={5}
              />
              {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}

              {Boolean(errors?.country?.message) ? <ErrorMessage>{errors?.country?.message} </ErrorMessage> : null}
            </Box>
          </Col>
        </Row>

        <hr style={{ marginTop: '10px' }} />
        <Box marginTop={3}>
          <Button colorScheme={'blue'} type="submit" size={'sm'} isLoading={loading}>
            Salvar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default CustomerForm;
