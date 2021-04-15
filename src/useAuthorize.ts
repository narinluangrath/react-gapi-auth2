import { useState, useEffect } from "react";

import { useGoogleAuthContext } from "./GoogleAuthProvider";

export const useAuthorize = (authorizeConfig: gapi.auth2.AuthorizeConfig) => {
  const context = useGoogleAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [
    authorizeResponse,
    setAuthroizeResponse,
  ] = useState<gapi.auth2.AuthorizeResponse | null>(null);

  if (context?.googleAuth) {
    throw Error(
      "react-gapi-auth2: You must pass `disableInit` prop to `<GoogleAuthProvider  />`, when using with `useAuthorize`. Did you mean to use `useAuthentication`?"
    );
  }

  useEffect(() => {
    gapi.auth2.authorize(authorizeConfig, (res) => {
      if (res.error) {
        setError(
          new Error(`react-gapi-auth2: ${res.error_subtype}, ${res.error}`)
        );
      }
      setAuthroizeResponse(res);
    });
  }, [authorizeConfig]);

  return {
    errors: context?.errors ? [...context.errors, error] : [error],
    authorizeResponse,
  };
};
