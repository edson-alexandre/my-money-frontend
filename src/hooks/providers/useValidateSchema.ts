import * as yup from 'yup';
import IFormError from '../../interfaces/IFormError';

export const useValidateSchema = <T>() => {
  const validate = async (schema: yup.AnySchema, object: T): Promise<IFormError | null> => {
    const validationResult = await schema.validate(object, { abortEarly: false }).catch(error => {
      return error;
    });
    let errors: IFormError | null = null;
    validationResult.inner.forEach((result: any) => {
      errors = {
        ...errors,
        [result.path]: result.message,
      };
    });
    return errors;
  };
  return { validate };
};
