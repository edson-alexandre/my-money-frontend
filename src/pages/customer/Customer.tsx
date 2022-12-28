import { Button, Progress, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/AlertDialog/CustomAlertDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useToastr } from '../../hooks-util/useToastr';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
import { ICustomer } from '../../interfaces/ICustomer';

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
  const [customers, setCustomers] = useState<ICustomer[]>([{ ...initialCustomer }]);
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
      .list?.()
      .then(customers => {
        setLoading(false);
        setCustomers(customers);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>CNPJ / CPF</Th>
            <Th>Cidade</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {customers.map((customer: ICustomer) => {
            return (
              <Tr key={`${customer.id}`}>
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
    </div>
  );
};

export default Customer;
