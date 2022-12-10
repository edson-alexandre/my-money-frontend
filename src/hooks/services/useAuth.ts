import AppError from '../../errors/AppError';
import { useRequest } from '../providers/useRequest';

export const useAuth = () => {
  const path = 'auth';
  const request = useRequest();
  const login = async (email: string, password: string): Promise<any> => {
    const body = { email, password };
    return await request
      .post({ path, body })
      .then(user => {
        return user;
      })
      .catch(error => {
        throw new AppError(error.message, error.status);
      });
  };

  return { login };
};
