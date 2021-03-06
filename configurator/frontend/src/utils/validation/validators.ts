import { isValidFullIsoDate } from '@util/validation/date';

const isoDateValidator = (errorMessage: string) => ({
  validator: (rule, value) => !value
    ? Promise.reject(errorMessage)
    : isValidFullIsoDate(value)
      ? Promise.resolve()
      : Promise.reject('Please, fill in correct ISO 8601 date, YYYY-MM-DDThh:mm:ss[.SSS]')
});

export { isoDateValidator };
