type FetchHandler = (payload: object) => Promise<any>;
interface Handlers {
  onSuccess(): void;
  setErrors(errors: object): void;
}

function action(fetch: FetchHandler) {
  return async (payload: object, {onSuccess, setErrors}: Handlers) => {
    try {
      const response = await fetch(payload);
      if (onSuccess) onSuccess();
      return response;
    }
    catch (error) {
      setErrors(error.response.data);
    }
  };
}

export default action;
