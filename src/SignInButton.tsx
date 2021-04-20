/* eslint-disable react/prop-types */
// https://github.com/typescript-eslint/typescript-eslint/issues/2540
// eslint-disable-next-line no-use-before-define
import React, { useEffect, FC } from "react";

import { useGApiContext } from "./GApiProvider";
import { useGoogleAuth } from "./useGoogleAuth";

export type SignInButtonProps = {
  /**
   * The ID of the element in which to render the sign-in button.
   */
  id?: string;
  /**
   * An object containing the settings to use to render the button.
   */
  options?: {
    /**
     * The scopes to request when the user signs in (default: `profile`).
     */
    scope?: string;
    /**
     * The width of the button in pixels (default: 120).
     */
    width?: number;
    /**
     * The height of the button in pixels (default: 36).
     */
    height?: number;
    /**
     * Display long labels such as "Sign in with Google" rather than "Sign in" (default: `false`). When you use long titles, you should increase the width of the button from its default.
     */
    longtitle?: boolean;
    /**
     * The color theme of the button: either `light` or `dark` (default: `light`).
     */
    theme?: "light" | "dark";
    /**
     * The callback function to call when a user successfully signs in. This function must take one argument: an instance of `gapi.auth2.GoogleUser` (default: none).
     */
    onsuccess?(googleUser: gapi.auth2.GoogleUser): void;
    /**
     * The callback function to call when sign-in fails. This function takes no arguments (default: none).
     */
    onfailure?(reason: { error: string }): void;
  };
};

const defaultOptions = {};

/**
 * Render the default sign in button provided by `gapi.signin2.render`
 */
export const SignInButton: FC<SignInButtonProps> = ({
  id = "react-gapi-auth2-sign-in-button",
  options = defaultOptions,
}) => {
  const context = useGApiContext();
  const { googleAuth } = useGoogleAuth();

  if (!context) {
    throw Error("Must use `SignInButton` inside of `GoogleAuthProvider`");
  }

  const { isAuth2Loaded } = context;

  useEffect(() => {
    if (isAuth2Loaded && googleAuth) {
      gapi.signin2.render(id, options);
    }
  }, [id, options, isAuth2Loaded, googleAuth]);

  return <div id={id} />;
};
