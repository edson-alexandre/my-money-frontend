import { Table, Th, Thead, Tr, Tbody, Td, Button, Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useToastr } from '../../hooks-util/useToastr';
import { useSupplyerRequests } from '../../hooks/services/useSupplyerRequests';
import { ISupplyer } from '../../interfaces/ISupplyer';

const initialSupplyer: ISupplyer = {
  name: '',
  email: '',
  cgcCpf: '',
  city: '',
  state: '',
  street: '',
  number: '',
  details: '',
  district: '',
  zip: '',
  country: '',
};

const Supplier = () => {
  const [supplyers, setSupplyers] = useState<ISupplyer[]>([{ ...initialSupplyer }]);
  const supplyerRequest = useSupplyerRequests();
  const navigate = useNavigate();
  const toast = useToastr();
  const [loading, setLoading] = useState(false);

  const listSupplyers = async () => {
    setLoading(true);
    await supplyerRequest
      .list?.(5, 5)
      .then(async result => {
        await setSupplyers([...result.data]);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'Erro ao carregar dados', error.message);
      });
  };

  useEffect(() => {
    listSupplyers();
  }, []);
  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE FORNECEDORES" />
      <Button className="my-4" colorScheme="blue" onClick={() => navigate(`/supplyer/0/new`)}>
        Novo Fornecedor
      </Button>
      {loading ? <Progress isIndeterminate size="xs" /> : null}
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
          {supplyers.map(supplyer => {
            return (
              <Tr key={`${supplyer.id}`}>
                <Td>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/supplyer/${supplyer.id}/edit`)}
                  />
                  <i className="bi bi-trash3 " style={{ cursor: 'pointer', marginLeft: 15 }} />
                </Td>
                <Td>{supplyer.name}</Td>
                <Td>{supplyer.email}</Td>
                <Td>{supplyer.cgcCpf}</Td>
                <Td>{supplyer.city}</Td>
                <Td>{supplyer.state}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};

export default Supplier;
