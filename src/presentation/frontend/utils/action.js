function action(fetch) {
  return async (payload, {onSuccess, setErrors}) => {
    try {
      const response = await fetch(payload);
      if (onSuccess) onSuccess(response);
      return response;
    }
    catch (error) {
      setErrors(error.response.data);
    }
  };
}

export default action;
