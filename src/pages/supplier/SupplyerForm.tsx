import { Box, Button, Progress, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle/PageTitle';
import * as yup from 'yup';
import { TestContext } from 'yup';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { ISupplyer } from '../../interfaces/ISupplyer';

import { Col, Row } from 'react-bootstrap';
import { Input, InputMask } from '../../components/my-input/Input.styled';
import { ErrorMessage } from '../../components/my-input/ErrorMessage.styled';
import { useSupplyerRequests } from '../../hooks/services/useSupplyerRequests';
import { useToastr } from '../../hooks-util/useToastr';
import IFormError from '../../interfaces/IFormError';
import { useValidateSchema } from '../../hooks/providers/useValidateSchema';

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

interface Dic {}

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

  const schema = yup
    .object({
      name: yup.string().required('É necessário informar o nome'),
      email: yup.string().required('Campo obrigatório').email('Favor informar um e-mail válido'),
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
      zip: yup.string().required('Campo obrigatório'),
      street: yup.string().required('Campo obrigatório'),
      number: yup.string().required('Campo obrigatório'),
      city: yup.string().required('Campo obrigatório'),
      state: yup.string().required('Campo obrigatório'),
      district: yup.string().required('Campo obrigatório'),
      country: yup.string().required('Campo obrigatório'),
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

  useEffect(() => {
    if (supplyerId !== '0') {
      loadSupplyer();
    }
  }, []);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const errors = await validation.validate(schema, supplyer).then(result => {
      return result;
    });
    if (errors) {
      setErrors(errors);
    } else {
      setErrors(null);
    }
  };
  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE FORNECEDOR">
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
              value={supplyer.personType}
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
            <label style={{ marginTop: '10px' }}>Nome do cliente</label>
            <Input
              placeholder="Informe o nome do fornecedor"
              p={5}
              value={supplyer.name}
              onChange={e => {
                setSupplyer(state => {
                  return {
                    ...state,
                    name: e.target.value,
                  };
                });
              }}
            />
            {loading ? <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} /> : null}
            {Boolean(errors?.name) ? <ErrorMessage>{errors?.name}</ErrorMessage> : null}
          </Col>
        </Row>
        <div>
          <Button type="submit" colorScheme="blue" className="mt-4">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SupplyerForm;
