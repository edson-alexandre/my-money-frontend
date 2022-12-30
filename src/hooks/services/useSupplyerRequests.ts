import { IPaginationReturn } from './../../interfaces/IPaginationReturn';
import { ICrudRequest } from './../../interfaces/ICrudRequest';
import { ISupplyer } from './../../interfaces/ISupplyer';
import AppError from '../../errors/AppError';
import { useRequest } from './../providers/useRequest';

export const useSupplyerRequests = (): ICrudRequest<ISupplyer> => {
  const path = 'supplyers';
  const request = useRequest<ISupplyer>();

  const list = async (currentPage: number, perPage: number): Promise<IPaginationReturn<ISupplyer[]>> => {
    return await request
      .getManyPaginated({
        path,
        sendAuthorization: true,
      })
      .then(supplyers => {
        return supplyers;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const listById = async (id: string): Promise<ISupplyer> => {
    return await request
      .getOne({
        path: `${path}/${id}`,
        sendAuthorization: true,
      })
      .then(supplyer => {
        return supplyer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const create = async (supplyer: ISupplyer): Promise<ISupplyer> => {
    return await request
      .post({
        path: `${path}`,
        sendAuthorization: true,
        body: supplyer,
      })
      .then(supplyer => {
        return supplyer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const update = async (id: string, supplyer: ISupplyer): Promise<ISupplyer> => {
    return await request
      .put({
        path: `${path}/${id}`,
        sendAuthorization: true,
        body: supplyer,
      })
      .then(supplyer => {
        return supplyer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const remove = async (id: string, supplyer: ISupplyer): Promise<void> => {
    return await request
      .remove({
        path: `${path}/${remove}`,
        sendAuthorization: true,
        body: supplyer,
      })
      .then(supplyer => {
        return supplyer;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  return { list, listById, create, remove, update };
};
