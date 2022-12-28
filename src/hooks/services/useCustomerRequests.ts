import { ICrudRequest } from './../../interfaces/ICrudRequest';
import { ICustomer } from './../../interfaces/ICustomer';
import AppError from '../../errors/AppError';
import { useRequest } from '../providers/useRequest';

export const useCustomerRequests = (): ICrudRequest<ICustomer> => {
  const path = 'customers';
  const request = useRequest<ICustomer>();

  const list = async (): Promise<ICustomer[]> => {
    return await request
      .getMany({
        path,
        sendAuthorization: true,
      })
      .then(customers => {
        return customers;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const listById = async (id: string): Promise<ICustomer> => {
    return await request
      .getOne({
        path: `${path}/${id}`,
        sendAuthorization: true,
      })
      .then(customer => {
        return customer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const create = async (customer: ICustomer): Promise<ICustomer> => {
    return await request
      .post({
        path: `${path}`,
        sendAuthorization: true,
        body: customer,
      })
      .then(customer => {
        return customer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const update = async (customerId: string, customer: ICustomer): Promise<ICustomer> => {
    return await request
      .put({
        path: `${path}/${customerId}`,
        sendAuthorization: true,
        body: customer,
      })
      .then(customer => {
        return customer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const remove = async (customerId: string, customer: ICustomer): Promise<void> => {
    return await request
      .remove({
        path: `${path}/${customerId}`,
        sendAuthorization: true,
        body: customer,
      })
      .then(customer => {
        return customer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  return { list, listById, create, update, remove };
};
