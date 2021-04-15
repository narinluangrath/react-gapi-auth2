// https://github.com/typescript-eslint/typescript-eslint/issues/2540
// eslint-disable-next-line no-use-before-define
import React, { useEffect } from "react";

import { useGoogleAuthContext } from "./GoogleAuthProvider";

export type SignInButtonProps = {
  id?: string;
  options?: {
    scope?: string;
    width?: number;
    height?: number;
    longtitle?: boolean;
    theme?: "light" | "dark";
    onsuccess?(googleUser: gapi.auth2.GoogleUser): void;
    onfailure?(reason: { error: string }): void;
  };
};

export const SignInButton = (props: SignInButtonProps) => {
  const { id = "react-gapi-auth2-sign-in-button", options = {} } = props;
  const context = useGoogleAuthContext();

  if (!context) {
    throw Error("Must use `SignInButton` inside of `GoogleAuthProvider`");
  }

  useEffect(() => {
    gapi.signin2.render(id, options);
  }, [id, options]);

  return <button id={id} />;
};
