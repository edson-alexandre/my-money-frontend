import { Button, IconButton, Progress } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAlertDialog } from '../../components/alert-dialog/CustomAlertDialog';
import { CustomTable, CustomTd, CustomTr, CustomPagination } from '../../components/custom-table';
import PageTitle from '../../components/page-title/PageTitle';
import { useToastr } from '../../hooks-util/useToastr';
import { useSupplyerRequests } from '../../hooks/services/useSupplyerRequests';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';
import { IOrderData } from '../../interfaces/IOrderData';
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
  const [orderSupplyer, setOrderSupplyer] = useState<IOrderData>({
    order: 'ASC',
    field: 'name',
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
  const [tableHeads] = useState([
    { label: 'Ações', field: 'action' },
    { label: 'Nome', field: 'name', orderAble: true },
    { label: 'E-mail', field: 'email', orderAble: true },
    { label: 'CNPJ / CPF', field: 'cgcCpf', orderAble: true },
    { label: 'Cidade', field: 'city', orderAble: true },
    { label: 'Estado', field: 'state', orderAble: true },
  ]);

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
      .list?.(currentPage, perPage, orderSupplyer.field, orderSupplyer.order)
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
  }, [currentPage, perPage, orderSupplyer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-2">
      <PageTitle title="CADASTRO DE FORNECEDORES" />
      <Button size="sm" className="my-4" colorScheme="blue" onClick={() => navigate(`/supplyer/0/new`)}>
        Novo Fornecedor
      </Button>
      <CustomAlertDialog
        confirm={() => remove()}
        ref={alertRef}
        title="Confirmar Exclusão"
        message="Confirma a exclusão do fornecedor?"
      />
      {loading ? <Progress isIndeterminate size="xs" /> : null}
      <CustomTable
        initialOrder={{ ...orderSupplyer }}
        heads={tableHeads}
        getOrder={({ order, field }) => setOrderSupplyer({ order, field })}
      >
        {supplyers.map(supplyer => {
          return (
            <CustomTr key={`${supplyer.id}`} hoverAble={true}>
              <CustomTd>
                <IconButton
                  mr={1}
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  onClick={() => navigate(`/supplyer/${supplyer.id}/edit`)}
                  icon={<i className="bi bi-pencil-square" />}
                />
                <IconButton
                  variant="ghost"
                  aria-label="Editar"
                  size="sm"
                  isRound
                  onClick={() => confirmRemove(`${supplyer?.id}`, supplyer)}
                  icon={<i className="bi bi-trash3 " />}
                />
              </CustomTd>
              <CustomTd>{supplyer.name}</CustomTd>
              <CustomTd>{supplyer.email}</CustomTd>
              <CustomTd>{supplyer.cgcCpf}</CustomTd>
              <CustomTd>{supplyer.city}</CustomTd>
              <CustomTd>{supplyer.state}</CustomTd>
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

export default Supplier;
