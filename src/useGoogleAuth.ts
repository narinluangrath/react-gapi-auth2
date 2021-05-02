import { useState, useEffect } from "react";

import { useGApiContext } from "./GApiProvider";

export type GoogleAuthValue = {
  /**
   * Returns whether the current user is currently signed in.
   */
  isSignedIn: boolean;
  /**
   * `GoogleAuth` is a singleton class that provides methods to allow the user
   * to sign in with a Google account, get the user's current sign-in status,
   * get specific data from the user's Google profile, request additional scopes,
   * and sign out from the current account.
   */
  googleAuth: gapi.auth2.GoogleAuth | null;
  /**
   * Any error from loading the `GoogleAuth` object
   */
  error: Error | null;
};

/**
 * A declarative wrapper around the `GoogleAuth` object described here {@link https://developers.google.com/identity/sign-in/web/reference#authentication}.
 *
 * This hook manages loading the `GoogleAuth` object (by calling `gapi.auth2.init`).
 * This hook also listens for changes to the signedIn state and updates the return value.
 */
export const useGoogleAuth = (): GoogleAuthValue => {
  const context = useGApiContext();
  const [googleAuth, setGoogleAuth] = useState<gapi.auth2.GoogleAuth | null>(
    null
  );
  const [isSignedIn, setIsSignedIn] = useState(
    googleAuth?.isSignedIn.get() ?? false
  );
  const [error, setError] = useState<Error | null>(null);

  if (!context) {
    throw Error("Must use `useGoogleAuth` inside of `GoogleAuthProvider`");
  }

  const { clientConfig, isAuth2Loaded } = context;

  // Initialize `GoogleAuth` object
  useEffect(() => {
    if (isAuth2Loaded && !googleAuth) {
      gapi.auth2.init(clientConfig).then(
        (googleAuth) => setGoogleAuth(googleAuth),
        (e) => setError(Error(`${e.error}: ${e.details}`))
      );
    }
  }, [isAuth2Loaded, clientConfig, googleAuth]);

  // Listen for changes in the current user's sign-in state.
  useEffect(() => {
    if (isAuth2Loaded && googleAuth) {
      try {
        googleAuth.isSignedIn.listen((signedIn) => setIsSignedIn(signedIn));
      } catch (e) {
        setError(e);
      }
    }
  }, [isAuth2Loaded, googleAuth]);

  return {
    isSignedIn,
    googleAuth,
    error: context.error || error,
  };
};
