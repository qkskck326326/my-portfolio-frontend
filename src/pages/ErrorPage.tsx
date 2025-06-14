import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} - ${error.statusText}`
    : '예상치 못한 오류가 발생했습니다.';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-600 text-center p-4">
      <h1 className="text-4xl font-bold mb-4">에러</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default ErrorPage;
