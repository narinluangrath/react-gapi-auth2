// https://github.com/typescript-eslint/typescript-eslint/issues/2540
// eslint-disable-next-line no-use-before-define
import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  ReactNode,
  useContext,
} from "react";

import { loadGooglePlatform } from "./loadGooglePlatform";

type GoogleAuthProps = {
  children: ReactNode;
  clientConfig: gapi.auth2.ClientConfig;
  disableInit?: boolean;
};

type GoogleAuthValue = {
  googleAuth: gapi.auth2.GoogleAuth | null;
  isAuth2Loaded: boolean;
  isPlatformLoaded: boolean;
  errors: Error[] | null;
};

const GoogleAuthContext = createContext<GoogleAuthValue | null>(null);

export const useGoogleAuthContext = () => {
  return useContext(GoogleAuthContext);
};

export const GoogleAuthProvider = ({
  children,
  clientConfig,
  disableInit = false,
}: GoogleAuthProps) => {
  const [isPlatformLoaded, setIsPlatformLoaded] = useState(false);
  const [isAuth2Loaded, setIsAuth2Loaded] = useState(false);
  const [googleAuth, setGoogleAuth] = useState<gapi.auth2.GoogleAuth | null>(
    null
  );
  const [errors, setErrors] = useState<Error[] | null>(null);

  const addError = useCallback((message) => {
    const error = new Error(`react-gapi-auth2: ${message}`);
    setErrors((errs) => (errs ? [...errs, error] : [error]));
  }, []);

  // Load the Google APIs platform library to create the `gapi` object
  useEffect(() => {
    if (window.gapi) {
      setIsPlatformLoaded(true);
    } else {
      const cleanup = loadGooglePlatform(
        () => setIsPlatformLoaded(true),
        (e) => addError(`Error loading Google APIs platform \n${e.message}`)
      );
      setIsPlatformLoaded(true);
      return cleanup;
    }
  }, [addError]);

  // After the platform library loads, load the `auth2` library
  useEffect(() => {
    if (isPlatformLoaded && !isAuth2Loaded) {
      window.gapi.load("auth2", {
        onerror: () => addError("Error loading auth2 library"),
        callback: () => {
          setIsAuth2Loaded(true);
          if (!disableInit) {
            gapi.auth2.init(clientConfig).then(
              (googleAuth) => setGoogleAuth(googleAuth),
              (e) => addError(`${e.error}: ${e.details}`)
            );
          }
        },
      });
    }
  }, [isPlatformLoaded, clientConfig, disableInit, isAuth2Loaded]);

  const value = useMemo(
    () => ({
      googleAuth,
      isPlatformLoaded,
      isAuth2Loaded,
      errors,
    }),
    [googleAuth, isPlatformLoaded, isAuth2Loaded, errors]
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
