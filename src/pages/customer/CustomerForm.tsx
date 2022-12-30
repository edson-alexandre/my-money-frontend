import { Box, Button, Progress, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Input } from '../../components/my-input/Input.styled';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import * as yup from 'yup';
import { TestContext } from 'yup';
import { ICustomer } from '../../interfaces/ICustomer';
import { Row, Col } from 'react-bootstrap';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { useViaCepRequest } from '../../hooks/services/useViaCepRequest';
import { IAddress } from '../../interfaces/IAddress';
import { InputMask } from '../../components/my-input/Input.styled';
import { useToastr } from '../../hooks-util/useToastr';
import IFormError from '../../interfaces/IFormError';
import { useValidateSchema } from '../../hooks/providers/useValidateSchema';

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
  const validation = useValidateSchema();
  const [errors, setErrors] = useState<IFormError | null>(null);
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

  const submitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = await validation.validate(schema, customer).then(result => {
      return result;
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    } else {
      setErrors(null);
    }

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
        onSubmit={e => submitForm(e)}
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
            <InputMask
              label={`${customer.personType === 'FISICA' ? 'CPF' : 'CNPJ'} `}
              mask={`${customer.personType === 'FISICA' ? '000.000.000-00' : '00.000.000/0000-00'} `}
              placeholder="Informe o CNPJ / CPF do cliente"
              onAccept={value => setCustomer({ ...customer, cgcCpf: value })}
              value={`${customer.cgcCpf}`}
              isLoading={loading}
              isError={Boolean(errors?.cgcCpf)}
              errorMessage={`${errors?.cgcCpf}`}
              p={5}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              label="Nome do cliente"
              placeholder="Informe o nome do cliente"
              p={5}
              value={`${customer.name}`}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              isError={Boolean(errors?.name)}
              errorMessage={`${errors?.name}`}
              isLoading={loading}
            />
          </Col>
          <Col cols={12} md={12}>
            <Box className="mt-2">
              <Input
                label="E-mail do cliente"
                placeholder="Informe o e-mail do cliente"
                p={5}
                value={`${customer.email}`}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                isError={Boolean(errors?.email)}
                errorMessage={`${errors?.email}`}
                isLoading={loading}
              />
            </Box>
          </Col>

          <Col cols={12} md={12}>
            <Box className="mt-2">
              <label style={{ marginTop: '10px' }}>Contato do Cliente</label>
              <Input
                label="Contato do Cliente"
                placeholder="Informe o contato do cliente"
                value={`${customer.contact || ''}`}
                onChange={e => setCustomer({ ...customer, contact: e.target.value })}
                isLoading={loading}
                p={5}
              />
            </Box>
          </Col>

          <Col cols={12} md={12}>
            <InputMask
              label="CEP"
              placeholder="Informe o CEP"
              mask={`00000-000`}
              onAccept={value => setCustomer({ ...customer, zip: value })}
              value={`${customer.zip}`}
              onBlur={async e => await getAddress(e.target.value)}
              isLoading={loading}
              isError={Boolean(errors?.zip)}
              p={5}
            />
          </Col>

          <Col cols={12} md={8}>
            <Input
              label="Logradouro"
              placeholder="Informe o logradouro"
              value={`${customer.street}`}
              onChange={e => setCustomer({ ...customer, street: e.target.value })}
              p={5}
              isError={Boolean(errors?.street)}
              errorMessage={`${errors?.street}`}
              isLoading={loading}
            />
          </Col>
          <Col cols={12} md={4}>
            <label style={{ marginTop: '10px' }}>Número</label>
            <Input
              label="Número do Endereço"
              placeholder="Informe o Número do endereço"
              value={`${customer.number}`}
              isError={Boolean(errors?.number)}
              errorMessage={`${errors?.number}`}
              isLoading={loading}
              onChange={e => setCustomer({ ...customer, number: e.target.value })}
              p={5}
            />
          </Col>
          <Col cols={12} md={6}>
            <Input
              label="Bairro"
              placeholder="Informe o bairro"
              isLoading={loading}
              isError={Boolean(errors?.district)}
              errorMessage={`${errors?.district}`}
              value={customer.district}
              onChange={e => setCustomer({ ...customer, district: e.target.value })}
              p={5}
            />
          </Col>
          <Col cols={12} md={6}>
            <label style={{ marginTop: '10px' }}>Complemento</label>
            <Input
              label="Complemento"
              placeholder="Informe o complemento"
              value={`${customer.details}`}
              isLoading={loading}
              isError={Boolean(errors?.details)}
              errorMessage={`${errors?.details}`}
              onChange={e => setCustomer({ ...customer, details: e.target.value })}
              p={5}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              label="Cidade"
              placeholder="Informe o cidade"
              value={`${customer.city}`}
              isLoading={loading}
              isError={Boolean(errors?.city)}
              errorMessage={`${errors?.city}`}
              onChange={e => setCustomer({ ...customer, city: e.target.value })}
              p={5}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              label="Estado"
              placeholder="Informe o estado"
              value={`${customer.state}`}
              isLoading={loading}
              isError={Boolean(errors?.state)}
              errorMessage={`${errors?.state}`}
              onChange={e => setCustomer({ ...customer, state: e.target.value })}
              p={5}
            />
          </Col>
          <Col cols={12} md={4}>
            <label style={{ marginTop: '10px' }}>País</label>
            <Input
              label="País"
              placeholder="Informe o país"
              isLoading={loading}
              isError={Boolean(errors?.country)}
              errorMessage={`${errors?.country}`}
              value={customer.country}
              onChange={e => setCustomer({ ...customer, country: e.target.value })}
              p={5}
            />
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
