import AppError from '../../errors/AppError';
import { useRequest } from '../providers/useRequest';

export const useViaCepRequest = () => {
  const path = 'cep';
  const request = useRequest();

  const getAddresByCep = async (cep: string): Promise<any> => {
    return await request
      .get({
        path: `${path}/${cep}`,
        sendAuthorization: true,
      })
      .then(cep => {
        return cep;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  return { getAddresByCep };
};
