import { useState, useEffect } from "react";
import { useGApiContext } from "./GApiProvider";

import { useGoogleAuth } from "./useGoogleAuth";

export type GoogleUserValue = {
  error: Error | null;
  currentUser: gapi.auth2.GoogleUser | null;
};

/**
 * A declarative wrapper around the `GoogleUser` object described {@link https://developers.google.com/identity/sign-in/web/reference#users}
 *
 * A `GoogleUser` object represents one user account.
 */
export const useGoogleUser = () => {
  const { error: gApiError } = useGApiContext() || {};
  const { googleAuth, error: googleAuthError } = useGoogleAuth();
  const [currentUser, setCurrentUser] = useState(
    googleAuth?.currentUser?.get() || null
  );
  const [error, setError] = useState<Error | null>(null);

  // Listen for changes in the current user's sign-in state.
  useEffect(() => {
    if (googleAuth) {
      try {
        googleAuth.currentUser.listen(setCurrentUser);
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
