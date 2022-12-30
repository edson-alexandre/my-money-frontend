import { Button, Progress, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/AlertDialog/CustomAlertDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Pagination } from '../../components/pagination/Pagination';
import { useToastr } from '../../hooks-util/useToastr';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
import { ICustomer } from '../../interfaces/ICustomer';
import './Customer.css';

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

interface IOrder {
  order: Boolean;
  field: string;
}

const Customer = () => {
  const [orderCustomers, setOrderCustomers] = useState<IOrder>({
    order: false,
    field: '',
  });
  const colorMode = useColorModeValue('light', 'dark');
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
      .list?.(currentPage, perPage)
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
  }, [currentPage, perPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeCurrent = (current: number) => {
    setCurrentPage(current);
  };

  const handleChangePerpage = (current: number) => {
    setPerPage(current);
  };

  useEffect(() => {
    setCustomers(state => {
      return [
        ...state.sort((a: ICustomer, b: ICustomer) => {
          if (a[`${orderCustomers.field}`] > b[`${orderCustomers.field}`]) {
            return orderCustomers.order ? -1 : 1;
          } else {
            return orderCustomers.order ? 1 : -1;
          }
        }),
      ];
    });
  }, [orderCustomers]);

  const getOrderIcon = (name: string) => {
    return (
      <i
        style={{ marginLeft: '10px' }}
        className={`bi bi-arrow-${name === orderCustomers.field && orderCustomers.order ? 'up' : 'down'}-short`}
      ></i>
    );
  };

  const orderTable = (event: React.MouseEvent<HTMLElement>) => {
    setOrderCustomers({
      ...orderCustomers,
      order: !orderCustomers.order,
      field: event?.currentTarget.id,
    });
  };

  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE CLIENTES" />
      {!loading || <Progress size="xs" isIndeterminate />}
      <Button className="my-4" colorScheme="blue" onClick={() => navigate(`/customer/0/new`)}>
        Novo Cliente
      </Button>
      <CustomAlertDialog
        confirm={() => removeCustomer()}
        ref={alertRef}
        title="Confirmar Exclusão"
        message="Confirma a exclusão do cliente?"
      />
      <Table>
        <Thead>
          <Tr>
            <Th>Ações</Th>
            <Th cursor="pointer" id="name" onClick={e => orderTable(e)}>
              Nome
              {getOrderIcon('name')}
            </Th>
            <Th cursor="pointer" id="email" onClick={e => orderTable(e)}>
              Email
              {getOrderIcon('email')}
            </Th>
            <Th cursor="pointer" id="cgcCpf" onClick={e => orderTable(e)}>
              CNPJ / CPF
              {getOrderIcon('cgcCpf')}
            </Th>
            <Th cursor="pointer" id="city" onClick={e => orderTable(e)}>
              Cidade
              {getOrderIcon('city')}
            </Th>
            <Th cursor="pointer" id="state" onClick={e => orderTable(e)}>
              Estado
              {getOrderIcon('state')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {customers.map((customer: ICustomer) => {
            return (
              <Tr key={`${customer.id}`} className={`${colorMode}-table-row`}>
                <Td>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/customer/${customer.id}/edit`)}
                  />
                  <i
                    className="bi bi-trash3 "
                    style={{ cursor: 'pointer', marginLeft: 15 }}
                    onClick={() => confirmRemove(`${customer.id}`, customer)}
                  />
                </Td>
                <Td>{customer.name}</Td>
                <Td>{customer.email}</Td>
                <Td>{customer.cgcCpf}</Td>
                <Td>{customer.city}</Td>
                <Td>{customer.state}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Pagination
        current={currentPage}
        defaultPerPage={5}
        total={totalRecords}
        getCurrentPage={handleChangeCurrent}
        getPerPage={handleChangePerpage}
      />
    </div>
  );
};

export default Customer;
