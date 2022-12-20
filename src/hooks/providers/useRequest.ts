import axios, { AxiosRequestHeaders } from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../../context/user/UserContext';
import AppError from '../../errors/AppError';

interface IRequest {
  path?: string;
  body?: any;
  headers?: AxiosRequestHeaders;
  sendAuthorization?: boolean;
}

export const useRequest = () => {
  const [baseUrl] = useState('http://localhost:3000');
  const { state: userState } = useContext(UserContext);

  const post = async (request: IRequest): Promise<void> => {
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

  const get = async (request: IRequest): Promise<void> => {
    const headers = { ...request.headers };
    if (request.sendAuthorization) {
      headers.Authorization = `Bearer ${userState.token}`;
    }
    return await axios({
      url: `${baseUrl}/${request.path}`,
      method: 'GET',
      headers,
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

  return { post, get };
};
