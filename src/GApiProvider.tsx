/* eslint-disable react/prop-types */
// https://github.com/typescript-eslint/typescript-eslint/issues/2540
// eslint-disable-next-line no-use-before-define
import React, {
  FC,
  useEffect,
  useState,
  createContext,
  useMemo,
  ReactNode,
  useContext,
} from "react";

import { loadGooglePlatform } from "./loadGooglePlatform";

export type GApiProps = {
  children: ReactNode;
  /**
   * Config passed to `gapi.auth2.init`: {@link https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams}
   */
  clientConfig: gapi.auth2.ClientConfig;
};

export type GApiValue = {
  /**
   * Config passed to `gapi.auth2.init`: {@link https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams}
   */
  clientConfig: gapi.auth2.ClientConfig;
  /**
   * Boolean flag indicating that the `gapi.auth2` library has loaded
   */
  isAuth2Loaded: boolean;
  /**
   * Boolean flag indicating that the `gapi` object has loaded
   */
  isPlatformLoaded: boolean;
  /**
   * Any error from initializing `gapi` libraries
   */
  error: Error | null;
};

const GApiContext = createContext<GApiValue | null>(null);

export const useGApiContext = () => {
  return useContext(GApiContext);
};

/**
 * Loads the necessary `gapi` libraries. This is simply a wrapper for the
 * various `Auth Setup` methods described here: {@link https://developers.google.com/identity/sign-in/web/reference#auth_setup}
 *
 * You must wrap your application with `GApiProvider` to use any of
 * the hooks (`useAuthentication`, `useUsers` and `useAuthroize`).
 */
export const GApiProvider: FC<GApiProps> = ({ children, clientConfig }) => {
  const [isPlatformLoaded, setIsPlatformLoaded] = useState(false);
  const [isAuth2Loaded, setIsAuth2Loaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load the Google APIs platform library to create the `gapi` object
  useEffect(() => {
    if (window.gapi) {
      setIsPlatformLoaded(true);
    } else {
      const cleanup = loadGooglePlatform(
        () => setIsPlatformLoaded(true),
        (e) =>
          setError(Error(`Error loading Google APIs platform \n${e.message}`))
      );
      return cleanup;
    }
  }, []);

  // After the platform library loads, load the `auth2` library
  useEffect(() => {
    if (isPlatformLoaded && !isAuth2Loaded) {
      window.gapi.load("auth2:signin2", {
        onerror: () => setError(Error("Error loading auth2 library")),
        callback: () => setIsAuth2Loaded(true),
      });
    }
  }, [isPlatformLoaded, clientConfig, isAuth2Loaded]);

  const value = useMemo(
    () => ({
      clientConfig,
      isPlatformLoaded,
      isAuth2Loaded,
      error,
    }),
    [clientConfig, isPlatformLoaded, isAuth2Loaded, error]
  );

  return <GApiContext.Provider value={value}>{children}</GApiContext.Provider>;
};
