import { Button, IconButton, Progress } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/alert-dialog/CustomAlertDialog';
import { CustomPagination, CustomTable, CustomTd, CustomTr } from '../../components/custom-table';
import PageTitle from '../../components/page-title/PageTitle';
import { EAccountNature } from '../../enums/EAccountNature';
import { useToastr } from '../../hooks-util/useToastr';
import { useAccountRequests } from '../../hooks/services/useAccountRequests';
import { IAccount } from '../../interfaces/IAccount';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
import ICustomHead from '../../interfaces/ICustomHead';
import { IOrderData } from '../../interfaces/IOrderData';

const initialAccount: IAccount = {
  shortCode: '',
  classification: '',
  isAnalytical: false,
  nature: 'D',
  level: 0,
  description: '',
  superiorId: '',
};
const Account = () => {
  const alertRef = useRef<ICustomAlertRef>(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([{ ...initialAccount }]);
  const [order, setOrder] = useState<IOrderData>({ field: 'classification', order: 'ASC' });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const toast = useToastr();
  const navigate = useNavigate();
  const [tableHeads] = useState<ICustomHead[]>([
    { label: 'Ações', field: 'action' },
    { label: 'Reduzida', field: 'shortCode', orderAble: true },
    { label: 'Analítica / Sintética', field: 'isAnalytical', orderAble: true },
    { label: 'Classificação', field: 'classification', orderAble: true },
    { label: 'Nível', field: 'level', orderAble: true },
    { label: 'Natureza', field: 'nature', orderAble: true },
    { label: 'Descrição', field: 'description', orderAble: true },
  ]);

  const accountRequest = useAccountRequests();

  const loadAccounts = async () => {
    setLoading(true);
    await accountRequest
      .list?.(1, 999, order.field, order.order)
      .then(res => {
        setLoading(false);
        setAccounts([...res.data]);
        setTotalRecords(res.total);
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'ERRO', error.message);
      });
  };

  const remove = async (id: string, account: IAccount) => {
    setLoading(true);
    await accountRequest
      .remove?.(id, account)
      .then(async () => {
        await loadAccounts();
        setLoading(false);
        toast.toastr('success', 'SUCESSO', 'Conta excluída com sucesso');
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'ERRO', error.message);
      });
  };

  useEffect(() => {
    loadAccounts();
  }, [order]);

  return (
    <div className="p-2" style={{ width: '100%' }}>
      <PageTitle title="CADASTRO DE PLANO DE CONTAS" />
      {loading ? <Progress isIndeterminate size="xs" /> : null}
      <Button size="sm" className="my-4" colorScheme="blue" onClick={() => navigate(`/account/0/new`)}>
        Nova Conta
      </Button>
      <CustomAlertDialog
        confirm={obj => remove(obj.id, { ...obj?.account })}
        ref={alertRef}
        title="Confirmar Exclusão"
        message="Confirma a exclusão do cliente?"
      />
      <CustomTable heads={tableHeads} getOrder={order => setOrder({ ...order })} initialOrder={order}>
        {accounts.map((account, i) => {
          return (
            <CustomTr key={i}>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>
                <IconButton
                  mr={1}
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  icon={<i className="bi bi-pencil-square" />}
                  onClick={() => navigate(`/account/${account.id}/edit`)}
                />
                <IconButton
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  icon={<i className="bi bi-trash3" />}
                  onClick={() => alertRef.current?.open?.({ id: account.id, account })}
                />
              </CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{account.shortCode}</CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{account.isAnalytical ? 'Analítica' : 'Sintética'}</CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{account.classification} </CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{account.level}</CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{EAccountNature[account.nature]}</CustomTd>
              <CustomTd style={{ whiteSpace: 'nowrap' }}>{account.description}</CustomTd>
            </CustomTr>
          );
        })}
      </CustomTable>
      <CustomPagination
        current={currentPage}
        defaultPerPage={perPage}
        total={totalRecords}
        getCurrentPage={value => setCurrentPage(value)}
        getPerPage={value => setPerPage(value)}
      />
    </div>
  );
};

export default Account;
