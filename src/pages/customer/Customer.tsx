import { Button, Progress, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { useCustomerRequests } from '../../hooks/services/useCustomerRequests';
import { ICustomer } from '../../interfaces/ICustomer';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const customerRequest = useCustomerRequests();

  const navigate = useNavigate();

  const loadCustomers = async () => {
    setLoading(true);
    await customerRequest
      .listCustomers()
      .then(customers => {
        setLoading(false);
        setCustomers(customers);
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
    loadCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE CLIENTES" />
      {!loading || <Progress size="xs" isIndeterminate />}
      <Button className="my-4" colorScheme="blue" onClick={() => navigate(`/customer/0/new`)}>
        Novo Cliente
      </Button>
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
              <Tr key={customer.id}>
                <Td>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/customer/${customer.id}/edit`)}
                  />
                  <i className="bi bi-trash3 " style={{ cursor: 'pointer', marginLeft: 10 }} />
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
