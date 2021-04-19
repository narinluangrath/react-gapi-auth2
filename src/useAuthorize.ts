import { useState, useEffect } from "react";

import { useGApiContext } from "./GApiProvider";

export type AuthorizeValue = {
  /**
   * Any error from running `gapi.auth2.authorize`
   */
  error: Error | null;
  /**
   * The response returned to the callback of the `gapi.auth2.authorize` method.
   */
  authorizeResponse: gapi.auth2.AuthorizeResponse | null;
};

/**
 * Declarative wrapper around `gapi.auth2.authorize`, read more here {@link https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorizeparams_callback}
 *
 * Performs a one time OAuth 2.0 authorization.
 * Depending on the parameters used, this will open a popup to the Google
 * sign-in flow or try to load the requested response silently, without user interaction.
 */
export const useAuthorize = (
  authorizeConfig: gapi.auth2.AuthorizeConfig
): AuthorizeValue => {
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
    try {
      gapi.auth2.authorize(authorizeConfig, (res) => {
        if (res.error) {
          setError(Error(`${res.error_subtype}, ${res.error}`));
        }
        setAuthroizeResponse(res);
      });
    } catch (e) {
      setError(e);
    }
  }, [authorizeConfig]);

  return {
    error: context.error || error,
    authorizeResponse,
  };
};
