import { Button, Checkbox } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/page-title/PageTitle';
import { Row, Col } from 'react-bootstrap';
import { Input } from '../../components/my-input/Input.styled';
import { IAccount } from '../../interfaces/IAccount';
import CustomSelect from '../../components/select/CustomSelect';
import { useAccountRequests } from '../../hooks/services/useAccountRequests';
import { useToastr } from '../../hooks-util/useToastr';
import IAutocompleteItem from '../../interfaces/IAutocompleteItem';
import AutoCompleteSingle from '../../components/select/AutoCompleteSingle';
import * as yup from 'yup';
import { useValidateSchema } from '../../hooks/providers/useValidateSchema';
import IFormError from '../../interfaces/IFormError';

const initialAccount: IAccount = {
  shortCode: '',
  classification: '',
  isAnalytical: false,
  nature: '',
  level: 0,
  description: '',
  superiorId: '',
};

const AccountForm = () => {
  const toast = useToastr();
  const params = useParams();
  const path = useLocation();
  const validation = useValidateSchema();

  const [action] = useState(path.pathname.split('/').indexOf('new') === -1 ? 'edit' : 'new');
  const [accountId] = useState(params.id || '');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<IAccount>({ ...initialAccount });
  const [superiorAccounts, setSuperiorAccounts] = useState<IAutocompleteItem[]>([]);
  const [errors, setErrors] = useState<IFormError | null>(null);

  const natures = [
    { value: 'D', text: 'Débito' },
    { value: 'C', text: 'Crédito' },
  ];
  const accountRequest = useAccountRequests();

  const schema = yup.object({
    shortCode: yup.string().required('Obrigatório informar a conta reduzida'),
    description: yup.string().required('Obrigatório informar a descrição'),
    nature: yup.string().required('Obrigatório informar a natureza'),
  });

  const loadSuperiorAccounts = async () => {
    await accountRequest
      .list?.(1, 99999, 'classification', 'asc')
      .then(res => {
        const superiorAccounts = res.data
          .filter(c => !c.isAnalytical)
          .map(c => {
            return {
              value: `${c.id}`,
              text: c.description,
            };
          });
        setSuperiorAccounts([...superiorAccounts]);
      })
      .catch(error => {
        toast.toastr('error', 'ERRO', error.message);
      });
  };

  const loadAccount = async () => {
    setLoading(true);
    await accountRequest
      .listById?.(accountId)
      .then(res => {
        setLoading(false);
        setAccount({ ...res });
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'ERRO', error.message);
      });
  };

  useEffect(() => {
    loadSuperiorAccounts();
    if (action === 'edit') {
      loadAccount();
    }
  }, []);

  const updateAccount = async () => {
    await setLoading(true);
    accountRequest
      .update?.(accountId, { ...account })
      .then(() => {
        setLoading(false);
        toast.toastr('success', 'SUCESSO', 'Os dados foram salvos com sucesso');
        navigate('/account');
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const createAccount = async () => {
    await setLoading(true);

    accountRequest
      .create?.({ ...account })
      .then(() => {
        setLoading(false);
        toast.toastr('success', 'SUCESSO', 'Os dados foram salvos com sucesso');
        navigate('/account');
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await validation.validate(schema, account).then(result => {
      return result;
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    } else {
      setErrors(null);
    }

    if (action === 'edit') {
      await updateAccount();
    } else {
      await createAccount();
    }
  };

  return (
    <div className="p-2">
      <PageTitle title={action === 'new' ? 'INCLUSÃO DE CONTA' : 'EDIÇÃO DE CONTA'}>
        <Button onClick={() => navigate('/account')}>Voltar</Button>
      </PageTitle>
      <form onSubmit={e => submitForm(e)} style={{ padding: '0px 40px 0px 40px' }}>
        <Row columns={[1]}>
          <Col cols={12} md={12}>
            <Input
              label="Conta Reduzida"
              placeholder="Informe a conta reduzida"
              p={5}
              value={account.shortCode}
              onChange={e => setAccount({ ...account, shortCode: e.target.value || '' })}
              isLoading={loading}
              isError={Boolean(errors?.shortCode)}
              errorMessage={errors?.shortCode}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              label="Descrição"
              placeholder="Informe a descrição"
              p={5}
              value={account.description}
              onChange={e => setAccount({ ...account, description: e.target.value || '' })}
              isLoading={loading}
              isError={Boolean(errors?.description)}
              errorMessage={errors?.description}
            />
          </Col>

          <Col className="" md={12}>
            <CustomSelect
              label="Natureza"
              placeholder="Selecione a natureza"
              value={account.nature}
              items={natures}
              onChange={item => setAccount({ ...account, nature: `${item}` })}
              isError={Boolean(errors?.nature)}
              errorMessage={errors?.nature}
            />
          </Col>
          <Col className="" md={12}>
            <AutoCompleteSingle
              label="Conta superior"
              placeholder="Selecione a conta superior (campo facultativo)"
              value={account.superiorId}
              items={superiorAccounts}
              onChange={item => setAccount({ ...account, superiorId: `${item}` })}
            />
          </Col>
          <Col cols={12} md={12}>
            <Input
              label="Classificação"
              placeholder="Classificação (gerada automaticamente)"
              p={5}
              value={account.classification}
              onChange={e => setAccount({ ...account, classification: e.target.value || '' })}
              isLoading={loading}
              readonly
            />
          </Col>
          <Col className="p-3" md={12}>
            <Checkbox
              colorScheme="blue"
              isChecked={account.isAnalytical}
              onChange={e => setAccount({ ...account, isAnalytical: e.target.checked })}
              readOnly={true}
            >
              Conta Analítica
            </Checkbox>
          </Col>
          <Col className="p-3" md={12}>
            <Button type="submit" colorScheme="blue" size="sm">
              Salvar
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default AccountForm;
