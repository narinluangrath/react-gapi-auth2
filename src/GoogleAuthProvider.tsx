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

const GOOGLE_API_PLATFORM_LIBRARY = "https://apis.google.com/js/platform.js";

type GoogleAuthProps = {
  children: ReactNode;
  clientConfig: gapi.auth2.ClientConfig;
};

type GoogleAuthValue = {
  googleAuth: gapi.auth2.GoogleAuth | null;
  errors: Error[] | null;
};

const GoogleAuthContext = createContext<GoogleAuthValue | null>(null);

export const useGoogleAuthContext = () => {
  return useContext(GoogleAuthContext);
};

export const GoogleAuthProvider = ({
  children,
  clientConfig,
}: GoogleAuthProps) => {
  const [isPlatformLoaded, setIsPlatformLoaded] = useState(false);
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
      const script = document.createElement("script");
      script.src = GOOGLE_API_PLATFORM_LIBRARY;
      script.async = true;
      script.defer = true;

      const handleLoad = () => setIsPlatformLoaded(true);
      const handleError = (e: ErrorEvent) => {
        addError(`Error loading Google APIs platform \n${e.message}`);
      };

      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);
      document.body.appendChild(script);
      setIsPlatformLoaded(true);

      return () => {
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      };
    }
  }, []);

  // After the platform library loads, load the `auth2` library
  useEffect(() => {
    if (isPlatformLoaded) {
      window.gapi.load("auth2", {
        onerror: () => addError("Error loading auth2 library"),
        callback: () => {
          gapi.auth2.init(clientConfig).then(
            (googleAuth) => setGoogleAuth(googleAuth),
            (e) => addError(`${e.error}: ${e.details}`)
          );
        },
      });
    }
  }, [isPlatformLoaded, clientConfig]);

  const value = useMemo(
    () => ({
      googleAuth,
      errors,
    }),
    [googleAuth, errors]
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
