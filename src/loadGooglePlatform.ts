const GOOGLE_API_PLATFORM_LIBRARY = "https://apis.google.com/js/platform.js";

export const loadGooglePlatform = (
  // eslint-disable-next-line no-undef
  onLoad: (this: HTMLScriptElement, ev: HTMLElementEventMap["load"]) => any,
  // eslint-disable-next-line no-undef
  onError: (this: HTMLScriptElement, ev: HTMLElementEventMap["error"]) => any
) => {
  const script = document.createElement("script");
  script.src = GOOGLE_API_PLATFORM_LIBRARY;
  script.async = true;
  script.defer = true;

  script.addEventListener("load", onLoad);
  script.addEventListener("error", onError);
  document.body.appendChild(script);

  return () => {
    script.removeEventListener("load", onLoad);
    script.removeEventListener("error", onError);
  };
};
