import { useState, useEffect } from "react";
import { useGApiContext } from "./GApiProvider";

import { useGoogleAuth } from "./useGoogleAuth";

export type GoogleUserValue = {
  /**
   * Any error from loading the `GoogleUser` object
   */
  error: Error | null;
  /**
   * A `GoogleUser` object represents one user account.
   */
  currentUser: gapi.auth2.GoogleUser | null;
};

/**
 * A declarative wrapper around the `GoogleUser` object described here {@link https://developers.google.com/identity/sign-in/web/reference#users}. This automatically listens for changes to the `currentUser`
 * and updates the return value.
 *
 */
export const useGoogleUser = (): GoogleUserValue => {
  const { error: gApiError } = useGApiContext() || {};
  const { googleAuth, error: googleAuthError } = useGoogleAuth();
  const [currentUser, setCurrentUser] = useState(
    googleAuth?.currentUser?.get() || null
  );
  const [error, setError] = useState<Error | null>(null);

  // Listen for changes in `currentUser`.
  useEffect(() => {
    if (googleAuth) {
      try {
        googleAuth.currentUser.listen((user) => setCurrentUser(user));
      } catch (e) {
        setError(e);
      }
    }
  }, [googleAuth]);

  return {
    error: gApiError || googleAuthError || error,
    currentUser,
  };
};
