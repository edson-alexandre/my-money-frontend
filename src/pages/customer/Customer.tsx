import { Button, IconButton, Progress } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/alert-dialog/CustomAlertDialog';
import { CustomTable, CustomTr, CustomTd, CustomPagination } from '../../components/custom-table';
import PageTitle from '../../components/page-title/PageTitle';

import { useToastr } from '../../hooks-util/useToastr';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
import { ICustomer } from '../../interfaces/ICustomer';
import ICustomHead from '../../interfaces/ICustomHead';
import { IOrderData } from '../../interfaces/IOrderData';

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

const Customer = () => {
  const [orderCustomers, setOrderCustomers] = useState<IOrderData>({
    order: 'ASC',
    field: 'name',
  });

  const [tableHeads] = useState<ICustomHead[]>([
    { label: 'Ações', field: 'action' },
    { label: 'Nome', field: 'name', orderAble: true },
    { label: 'E-mail', field: 'email', orderAble: true },
    { label: 'CNPJ / CPF', field: 'cgcCpf', orderAble: true },
    { label: 'Cidade', field: 'city', orderAble: true },
    { label: 'Estado', field: 'state', orderAble: true },
  ]);

  const [customers, setCustomers] = useState<ICustomer[]>([{ ...initialCustomer }]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [customerId, setCustomerId] = useState<string>('');
  const [customer, setCustomer] = useState<ICustomer>({ ...initialCustomer });
  const [loading, setLoading] = useState(false);
  const customerRequest = useCustomerRequests();
  const alertRef = useRef<ICustomAlertRef>(null);
  const navigate = useNavigate();
  const toastr = useToastr();

  const loadCustomers = async () => {
    setLoading(true);
    await customerRequest
      .list?.(currentPage, perPage, orderCustomers.field, orderCustomers.order)
      .then(result => {
        setLoading(false);
        setCustomers(result.data);
        setTotalRecords(result.total);
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };

  const confirmRemove = (id: string, customer: ICustomer) => {
    setCustomerId(id);
    setCustomer({ ...customer });
    alertRef?.current?.open && alertRef.current.open();
  };

  const removeCustomer = async () => {
    setLoading(true);
    await customerRequest
      .remove?.(customerId, customer)
      .then(async () => {
        await loadCustomers();
        setLoading(false);
        toastr.toastr('success', 'Cliente excluído com sucesso', '');
      })
      .catch(error => {
        setLoading(false);
        toastr.toastr('error', 'Ocorreu um erro ao carregar os dados', error.message);
      });
  };
  useEffect(() => {
    loadCustomers();
  }, [currentPage, perPage, orderCustomers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE CLIENTES" />
      {!loading || <Progress size="xs" isIndeterminate />}
      <Button size="sm" className="my-4" colorScheme="blue" onClick={() => navigate(`/customer/0/new`)}>
        Novo Cliente
      </Button>
      <CustomAlertDialog
        confirm={() => removeCustomer()}
        ref={alertRef}
        title="Confirmar Exclusão"
        message="Confirma a exclusão do cliente?"
      />
      <CustomTable
        initialOrder={{ ...orderCustomers }}
        heads={tableHeads}
        getOrder={({ order, field }) => setOrderCustomers({ order, field })}
        isEmpty={customers.length === 0}
      >
        {customers.map((customer: ICustomer) => {
          return (
            <CustomTr key={`${customer.id}`} hoverAble={true}>
              <CustomTd>
                <IconButton
                  mr={1}
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  onClick={() => navigate(`/customer/${customer.id}/edit`)}
                  icon={<i className="bi bi-pencil-square" />}
                />
                <IconButton
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  onClick={() => confirmRemove(`${customer.id}`, customer)}
                  icon={<i className="bi bi-trash3" />}
                />
              </CustomTd>
              <CustomTd>{customer.name}</CustomTd>
              <CustomTd>{customer.email}</CustomTd>
              <CustomTd>{customer.cgcCpf}</CustomTd>
              <CustomTd>{customer.city}</CustomTd>
              <CustomTd>{customer.state}</CustomTd>
            </CustomTr>
          );
        })}
      </CustomTable>
      <CustomPagination
        current={currentPage}
        defaultPerPage={5}
        total={totalRecords}
        getCurrentPage={value => setCurrentPage(value)}
        getPerPage={value => setPerPage(value)}
      />
    </div>
  );
};

export default Customer;
