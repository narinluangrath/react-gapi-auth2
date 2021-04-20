# React Gapi Auth2

React bindings for `gapi.auth2` (Google's OAuth 2.0 JavaScript client)

## Motivation

[`gapi.auth2`](https://developers.google.com/identity/sign-in/web/reference) is Google's OAuth2.0 client side library. It's great for implementing "Sign in with Google" in a non-framework "vanilla" JS app. However, using it in a React app is has some rough edges,

- It involves loading `<script />` tags [manually](https://developers.google.com/identity/sign-in/web/sign-in)
- The `gapi.auth2` api has _some_ imperative code, which is awkward to integrate with declarative code

There are already other React libraries that attempt solve these problems, however, they tend to create unnecessary abstractions on top of an already simple api. The entire `gapi.auth2` libarary only exposes two javascript classes 

- `GoogleAuth`: a "singleton class that provides methods to allow the user to sign in with a Google account"
- `GoogleUser`: an "object represents one user account"

This library provides two hooks `useGoogleAuth` and `useGoogleUser` that provide easier access to those objects. The majority of the api provided by `gapi.auth2` is intentionally left unchanged. Anything you can do with the existing `gapi.auth2` library, you can do with `react-gapi-auth2`.

## Getting Started

### Install

```bash
npm install --save react-gapi-auth2

# Or yarn
# yarn add react-gapi-auth2
```

### Basic Usage

Wrap your application with the provider, which manages loading the `gapi.auth2` library

```jsx
// App.jsx
import React from 'react';
import { GApiProvider } from 'react-gapi-auth2';

// Same config object passed to `gapi.auth2.init`
// https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
const clientConfig = {
  client_id: '<APP>.apps.googleusercontent.com'
  cookie_policy: 'single_host_origin' 
  scope: 'https://www.googleapis.com/auth/<POLICY>'
  // etc...
};

const App = ({ children }) => (
  <GApiProvider clientConfig={clientConfig}>
    {children}
  </GApiProvider>
);

export default App;
```

Then you can use the provided hooks

```jsx
// SignIn.jsx
import React from 'react';
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

const SignIn = ({ children }) => {
  // The `GoogleAuth` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#authentication 
  const { googleAuth } = useGoogleAuth();
  // The `GoogleUser` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#users
  const { currentUser } = useGoogleUser();

  if (googleAuth.isSignedIn) {
    return (
      <>
        <p>Welcome user {currentUser.getBasicProfile().getName()}</p>
        <button onClick={() => googleAuth.signOut()}>Sign Out</button>
      </>
    )
  }
  
  return (
    <>
      <p>Click here to sign in:</p>
      <button onClick={() => googleAuth.signIn()}>Sign In</button>
    </>
  )
};

export default SignIn;
```

Or use the built in `SignInButton` provided by this library, which is simply a wrapper around `gapi.signin2.render`


```jsx
import React from 'react';
import { SignInButton } from 'react-auth2-gapi';

// The same options object in the signature of `gapi.signin2.render`
// https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
const options = {
  width: 200,
  height: 50,
  theme: 'dark',
  onsuccess: () => console.log('Successfully logged in'),
  onfailure: () => console.error('Error logging in'),
};

const MySignInButton = () => (
  <SignInButton options={options} />
);

export default MySignInButton;
```

### Advanced Usage

This library also provides a hook called `useAuthorize`, which is a wrapper around `gapi.auth2.authroize`.  This method should only be used in advanced use cases, such as those described by GApi's documentation

```
- Your application only needs to requests a Google API endpoint once, for instance to load the user's favorite YouTube videos the first time they sign in.
- Your application has its own session management infrastructure, and it only requires the ID Token once to identify the user in your backend.
- Several Client IDs are used within the same page.
```

**You cannot use `useAuthroize` while using `useGoogleAuth` or `useGoogleUser` because of conflicts that arise when using both `gapi.auth2.authorize` and `gapi.auth2.init/signIn`.**
