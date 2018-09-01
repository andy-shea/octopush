function action(fetch, reset) {
  return async (payload, {setSubmitting, resetForm, setErrors}) => {
    try {
      const response = await fetch(payload);
      if (reset === true) resetForm();
      else if (reset === false) setSubmitting(false);
      return response;
    }
    catch (error) {
      setErrors(error.response.data);
    }
  };
}

export default action;
