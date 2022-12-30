import { Table, Th, Thead, Tr, Tbody, Td, Button, Progress } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/AlertDialog/CustomAlertDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Pagination } from '../../components/pagination/Pagination';
import { useToastr } from '../../hooks-util/useToastr';
import { useSupplyerRequests } from '../../hooks/services/useSupplyerRequests';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
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

interface IOrder {
  order: Boolean;
  field: string;
}

const Supplier = () => {
  const [orderSupplyer, setOrderSupplyer] = useState<IOrder>({
    order: false,
    field: '',
  });
  const alertRef = useRef<ICustomAlertRef>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [supplyers, setSupplyers] = useState<ISupplyer[]>([{ ...initialSupplyer }]);
  const supplyerRequest = useSupplyerRequests();
  const navigate = useNavigate();
  const toast = useToastr();
  const [loading, setLoading] = useState(false);
  const [supplyer, setSupplyer] = useState<ISupplyer>({ ...initialSupplyer });
  const [supplyerId, setSupplyerId] = useState<string>('');

  const remove = async () => {
    setLoading(true);
    await supplyerRequest
      .remove?.(`${supplyerId}`, supplyer)
      .then(async () => {
        await listSupplyers();
        setLoading(false);
        toast.toastr('success', 'SUCESSO', 'Fornecedor excluído com sucesso');
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'ERRO', error.message);
      });
  };

  const listSupplyers = async () => {
    setLoading(true);
    await supplyerRequest
      .list?.(currentPage, perPage)
      .then(async result => {
        await setSupplyers([...result.data]);
        setTotalRecords(result.total);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast.toastr('error', 'Erro ao carregar dados', error.message);
      });
  };

  const confirmRemove = (id: string, supplyer: ISupplyer) => {
    setSupplyerId(id);
    setSupplyer({ ...supplyer });
    alertRef?.current?.open && alertRef.current.open();
  };

  useEffect(() => {
    listSupplyers();
  }, [currentPage, perPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeCurrent = (current: number) => {
    setCurrentPage(current);
  };

  const handleChangePerpage = (current: number) => {
    setPerPage(current);
  };

  useEffect(() => {
    setSupplyers(state => {
      return [
        ...state.sort((a: ISupplyer, b: ISupplyer) => {
          if (a[`${orderSupplyer.field}`] > b[`${orderSupplyer.field}`]) {
            return orderSupplyer.order ? -1 : 1;
          } else {
            return orderSupplyer.order ? 1 : -1;
          }
        }),
      ];
    });
  }, [orderSupplyer]);

  const getOrderIcon = (name: string) => {
    return (
      <i
        style={{ marginLeft: '10px' }}
        className={`bi bi-arrow-${name === orderSupplyer.field && orderSupplyer.order ? 'up' : 'down'}-short`}
      ></i>
    );
  };

  const orderTable = (event: React.MouseEvent<HTMLElement>) => {
    setOrderSupplyer({
      ...orderSupplyer,
      order: !orderSupplyer.order,
      field: event?.currentTarget.id,
    });
  };

  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE FORNECEDORES" />
      <Button className="my-4" colorScheme="blue" onClick={() => navigate(`/supplyer/0/new`)}>
        Novo Fornecedor
      </Button>
      <CustomAlertDialog
        confirm={() => remove()}
        ref={alertRef}
        title="Confirmar Exclusão"
        message="Confirma a exclusão do fornecedor?"
      />
      {loading ? <Progress isIndeterminate size="xs" /> : null}
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
          {supplyers.map(supplyer => {
            return (
              <Tr key={`${supplyer.id}`}>
                <Td>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/supplyer/${supplyer.id}/edit`)}
                  />
                  <i
                    className="bi bi-trash3 "
                    style={{ cursor: 'pointer', marginLeft: 15 }}
                    onClick={() => confirmRemove(`${supplyer?.id}`, supplyer)}
                  />
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

export default Supplier;
