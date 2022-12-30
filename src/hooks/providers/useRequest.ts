import { IPaginationReturn } from './../../interfaces/IPaginationReturn';
import axios, { AxiosRequestHeaders } from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../../context/user/UserContext';
import AppError from '../../errors/AppError';

interface IRequestParams<T> {
  path?: string;
  body?: T;
  headers?: AxiosRequestHeaders;
  sendAuthorization?: boolean;
}

interface IRequest<T> {
  post(request: IRequestParams<T>): Promise<T>;
  put(request: IRequestParams<T>): Promise<T>;
  getOne(request: IRequestParams<T>): Promise<T>;
  getMany(request: IRequestParams<T>): Promise<T[]>;
  getManyPaginated(request: IRequestParams<T>): Promise<IPaginationReturn<T[]>>;
  remove(request: IRequestParams<T>): Promise<void>;
}

export const useRequest = <T>(): IRequest<T> => {
  const [baseUrl] = useState('http://localhost:3000');
  const { state: userState } = useContext(UserContext);

  const post = async (request: IRequestParams<T>): Promise<T> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'POST',
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  const put = async (request: IRequestParams<T>): Promise<any> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'PUT',
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  const remove = async (request: IRequestParams<T>): Promise<void> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'DELETE',
      headers,
      data: { ...request.body },
    })
      .then((res: any) => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  const getOne = async (request: IRequestParams<T>): Promise<T> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'GET',
      headers,
    })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  const getMany = async (request: IRequestParams<T>): Promise<T[]> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'GET',
      headers,
    })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  const getManyPaginated = async (request: IRequestParams<T>): Promise<IPaginationReturn<T[]>> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'GET',
      headers,
    })
      .then(res => {
        return res.data;
      })
      .catch(error => {
        throw new AppError(
          error?.response?.data?.validation?.params?.message ||
            error?.response?.data?.validation?.body?.message ||
            error?.response?.data?.validation?.query?.message ||
            error?.response?.data?.message ||
            'Ocorreu um erro ao executar o procedimento',
          error?.response.status || 400,
        );
      });
  };

  return { post, getOne, getMany, put, remove, getManyPaginated };
};
