import { createValidator, required, maxLength, minLength, email } from '../../utils/validation';

const formValidation = createValidator({
  header: [required, minLength(3)],
});

export default formValidation;
