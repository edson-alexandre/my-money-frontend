import { IPaginationReturn } from '../../interfaces/IPaginationReturn';
import { ICrudRequest } from '../../interfaces/ICrudRequest';
import { IAccount } from '../../interfaces/IAccount';
import AppError from '../../errors/AppError';
import { useRequest } from '../providers/useRequest';

export const useAccountRequests = (): ICrudRequest<IAccount> => {
  const path = 'accounts';
  const request = useRequest<IAccount>();

  const list = async (
    currentPage: number,
    perPage: number,
    orderField: string,
    orderDirection: string,
  ): Promise<IPaginationReturn<IAccount[]>> => {
    return await request
      .getManyPaginated({
        path: `${path}?page=${currentPage}&perPage=${perPage}&orderField=${orderField}&orderDirection=${orderDirection}`,
        sendAuthorization: true,
      })
      .then(supplyers => {
        return supplyers;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  const listById = async (id: string): Promise<IAccount> => {
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

  const create = async (supplyer: IAccount): Promise<IAccount> => {
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

  const update = async (id: string, supplyer: IAccount): Promise<IAccount> => {
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

  const remove = async (id: string, supplyer: IAccount): Promise<void> => {
    return await request
      .remove({
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

  return { list, listById, create, remove, update };
};
