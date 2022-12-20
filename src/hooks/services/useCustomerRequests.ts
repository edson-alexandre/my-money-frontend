import AppError from '../../errors/AppError';
import { useRequest } from '../providers/useRequest';

export const useCustomerRequests = () => {
  const path = 'customers';
  const request = useRequest();

  const listCustomers = async (): Promise<any> => {
    return await request
      .get({
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

  const listCustomerById = async (id: string): Promise<any> => {
    return await request
      .get({
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

  return { listCustomers, listCustomerById };
};
