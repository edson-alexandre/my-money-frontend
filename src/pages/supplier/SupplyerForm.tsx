import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/page-title/PageTitle';
import * as yup from 'yup';
import { TestContext } from 'yup';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { ISupplyer } from '../../interfaces/ISupplyer';

import { Col, Row } from 'react-bootstrap';
import { Input, InputMask } from '../../components/my-input/Input.styled';
import { useSupplyerRequests } from '../../hooks/services/useSupplyerRequests';
import { useToastr } from '../../hooks-util/useToastr';
import IFormError from '../../interfaces/IFormError';
import { useValidateSchema } from '../../hooks/providers/useValidateSchema';
import { useViaCepRequest } from '../../hooks/services/useViaCepRequest';
import { IAddress } from '../../interfaces/IAddress';

const initialSupplyer = {
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

const SupplyerForm = () => {
  const path = useLocation();
  const params = useParams();
  const toastr = useToastr();
  const validation = useValidateSchema();
  const [errors, setErrors] = useState<IFormError | null>(null);
  const [action] = useState(path.pathname.split('/').indexOf('new') !== -1 ? 'new' : 'edit');
  const [supplyer, setSupplyer] = useState<ISupplyer>({ ...initialSupplyer });
  const [loading, setLoading] = useState(false);
  const [supplyerId] = useState(params.id || '');
  const navigate = useNavigate();
  const supplyerRequest = useSupplyerRequests();
  const cepRequest = useViaCepRequest();

  const schema = yup
    .object({
      name: yup.string().required('Nome não informado'),
      email: yup.string().required('E-mail não informado').email('Favor informar um e-mail válido'),
      cgcCpf: yup
        .string()
        .required('CNPJ / CPF Não informado')
        .test((cgcCpf: string = '', schema: TestContext) => {
          const value = cgcCpf?.replaceAll('.', '')?.replaceAll('-', '');
          if (supplyer.personType === 'FISICA' && !cpf.isValid(value)) {
            return schema.createError({ message: 'CPF inválido' });
          } else if (schema?.parent?.personType === 'JURIDICA' && !cnpj.isValid(value)) {
            return schema.createError({ message: 'CPF inválido' });
          } else {
            return true;
          }
        }),
      zip: yup.string().required('CEP não informado'),
      street: yup.string().required('Rua não informada'),
      number: yup.string().required('Número do endereço não informado'),
      city: yup.string().required('Cidade não informada'),
      state: yup.string().required('Estado não informado'),
      district: yup.string().required('Bairro não informado'),
      country: yup.string().required('País não informado'),
    })
    .required();

  const loadSupplyer = async () => {
    setLoading(true);
    await supplyerRequest
      .listById?.(supplyerId)
      .then(supplyer => {
        setSupplyer({ ...supplyer });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const getAddress = async (zip: string) => {
    setLoading(true);
    const cep = `${zip}`.replaceAll('-', '').replaceAll('.', '');
    await cepRequest
      .getAddresByCep(cep)
      .then((address: IAddress) => {
        setLoading(false);
        setSupplyer(state => {
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
      .catch(() => {
        setLoading(false);
      });
  };

  const create = async () => {
    setLoading(true);
    const zip = `${supplyer?.zip}`.replaceAll('-', '');
    await setSupplyer(state => {
      return {
        ...state,
        zip,
      };
    });
    await supplyerRequest
      .create?.({ ...supplyer, zip })
      .then(() => {
        setLoading(false);
        toastr.toastr('success', 'SUCESSO', 'Fornecedor cadastrado com sucesso!');
        navigate('/supplier');
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'ERRO', error.message);
      });
  };

  const update = async () => {
    setLoading(true);
    const zip = `${supplyer?.zip}`.replaceAll('-', '');
    await setSupplyer(state => {
      return {
        ...state,
        zip,
      };
    });
    await supplyerRequest
      .update?.(`${supplyer?.id}`, { ...supplyer, zip })
      .then(() => {
        setLoading(false);
        toastr.toastr('success', 'SUCESSO', 'Fornecedor alterado com sucesso!');
        navigate('/supplier');
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'ERRO', error.message);
      });
  };

  useEffect(() => {
    if (supplyerId !== '0') {
      loadSupplyer();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = await validation.validate(schema, supplyer).then(result => {
      return result;
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors(null);
    if (action === 'new') {
      await create();
    } else {
      await update();
    }
  };
  return (
    <div className="p-2">
      <PageTitle title={`${action === 'new' ? 'INCLSUÃO' : 'ALTERAÇÃO'} DE FORNECEDOR`}>
        <Button variant="outline" onClick={() => navigate('/supplier')}>
          Voltar
        </Button>
      </PageTitle>
      <form
        style={{ display: 'flex', flexDirection: 'column', padding: '0px 40px 0px 40px' }}
        onSubmit={e => submitForm(e)}
      >
        <Row>
          <Col cols={12} md={12}>
            <label style={{ marginTop: '10px' }}>Tipo de Pessoa</label>
            <RadioGroup
              size="md"
              value={`${supplyer.personType}`}
              onChange={personType =>
                setSupplyer(state => {
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
              mb={10}
              mask="00.000.000/0000-00"
              label="CNPJ / CPF do Fornecedor"
              isLoading={loading}
              isError={Boolean(errors?.cgcCpf)}
              errorMessage={errors?.cgcCpf}
              placeholder="Informe CNPJ / CPF nome do fornecedor"
              p={5}
              value={`${supplyer.cgcCpf}`}
              onAccept={value => setSupplyer({ ...supplyer, cgcCpf: `${value}` })}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              mb={10}
              label="Nome do Fornecedor"
              isLoading={loading}
              isError={Boolean(errors?.name)}
              errorMessage={errors?.name}
              placeholder="Informe o nome do fornecedor"
              p={5}
              value={`${supplyer.name}`}
              onChange={e => setSupplyer({ ...supplyer, name: e.target.value })}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              mb={10}
              label="E-mail do Fornecedor"
              placeholder="Informe o e-mail do fornecedor"
              isLoading={loading}
              isError={Boolean(errors?.email)}
              errorMessage={errors?.email}
              p={5}
              value={`${supplyer.email}`}
              onChange={e => setSupplyer({ ...supplyer, email: e.target.value })}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              mb={10}
              label="Contado do Fornecedor"
              placeholder="Informe o contato do fornecedor"
              isLoading={loading}
              p={5}
              value={`${supplyer.contact || ''}`}
              onChange={e => setSupplyer({ ...supplyer, contact: e.target.value })}
            />
          </Col>
          <Col cols={12} md={12}>
            <InputMask
              mb={10}
              mask="00000-000"
              label="CEP do Forneceor"
              placeholder="Informe o CEP do fornecedor"
              isLoading={loading}
              isError={Boolean(errors?.zip)}
              errorMessage={errors?.zip}
              p={5}
              value={`${supplyer.zip}`}
              onAccept={value => setSupplyer({ ...supplyer, zip: value })}
              onBlur={async e => await getAddress(e.target.value)}
            />
          </Col>
          <Col cols={12} md={8}>
            <Input
              mb={10}
              label="Logradouro"
              placeholder="Informe o logradouro"
              isLoading={loading}
              isError={Boolean(errors?.street)}
              errorMessage={errors?.street}
              p={5}
              value={`${supplyer.street}`}
              onChange={e => setSupplyer({ ...supplyer, street: e.target.value })}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              mb={10}
              label="Número do Endereço"
              placeholder="Informe o número do endereço"
              isLoading={loading}
              isError={Boolean(errors?.number)}
              errorMessage={errors?.number}
              p={5}
              value={`${supplyer.number}`}
              onChange={e => setSupplyer({ ...supplyer, number: e.target.value })}
            />
          </Col>
          <Col cols={12} md={6}>
            <Input
              mb={10}
              label="Bairro"
              placeholder="Informe o bairro"
              isLoading={loading}
              isError={Boolean(errors?.district)}
              errorMessage={errors?.district}
              p={5}
              value={`${supplyer.district}`}
              onChange={e => setSupplyer({ ...supplyer, district: e.target.value })}
            />
          </Col>
          <Col cols={12} md={6}>
            <Input
              mb={10}
              label="Complemento do Endereço"
              placeholder="Informe o complemento"
              isLoading={loading}
              p={5}
              value={`${supplyer.details}`}
              onChange={e => setSupplyer({ ...supplyer, details: e.target.value })}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              mb={10}
              label="Cidade"
              placeholder="Informe a cidade"
              isError={Boolean(errors?.city)}
              errorMessage={errors?.city}
              isLoading={loading}
              p={5}
              value={`${supplyer.city}`}
              onChange={e => setSupplyer({ ...supplyer, city: e.target.value })}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              mb={10}
              label="Estado"
              placeholder="Informe o estado"
              isError={Boolean(errors?.state)}
              errorMessage={errors?.state}
              isLoading={loading}
              p={5}
              value={`${supplyer.state}`}
              onChange={e => setSupplyer({ ...supplyer, state: e.target.value })}
            />
          </Col>
          <Col cols={12} md={4}>
            <Input
              mb={10}
              label="País"
              placeholder="Informe o país"
              isError={Boolean(errors?.country)}
              errorMessage={errors?.country}
              isLoading={loading}
              p={5}
              value={`${supplyer.country}`}
              onChange={e => setSupplyer({ ...supplyer, country: e.target.value })}
            />
          </Col>
        </Row>
        <div>
          <Button type="submit" colorScheme="blue" className="mt-4" isLoading={loading} loadingText="Aguarde">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SupplyerForm;
