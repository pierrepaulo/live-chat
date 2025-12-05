import { useCallback } from 'react';

const useErrors = () => {
  const getErrorMessage = useCallback((error: unknown, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (error instanceof Error && error.message) return error.message;
    if (typeof (error as { message?: string })?.message === 'string') {
      return (error as { message: string }).message;
    }
    return fallback;
  }, []);

  return { getErrorMessage };
};

export { useErrors };
