import { useState, useEffect } from "react";

import { useGApiContext } from "./GApiProvider";

export const useAuthorize = (authorizeConfig: gapi.auth2.AuthorizeConfig) => {
  const context = useGApiContext();
  const [error, setError] = useState<Error | null>(null);
  const [
    authorizeResponse,
    setAuthroizeResponse,
  ] = useState<gapi.auth2.AuthorizeResponse | null>(null);

  if (!context) {
    throw Error("Must use `useAuthorize` inside of `GoogleAuthProvider`");
  }

  useEffect(() => {
    gapi.auth2.authorize(authorizeConfig, (res) => {
      if (res.error) {
        setError(Error(`${res.error_subtype}, ${res.error}`));
      }
      setAuthroizeResponse(res);
    });
  }, [authorizeConfig]);

  return {
    error: context.error || error,
    authorizeResponse,
  };
};
