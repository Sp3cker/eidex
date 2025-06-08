import * as amplitude from "@amplitude/analytics-browser";

amplitude.init(import.meta.env.VITE_AMPLITUTE_KEY, { autocapture: true });
amplitude.track("Sign Up");

export const logEvent = (
  eventName: string,
  eventProperties?: Record<string, any>,
) => {
  amplitude.track(eventName, eventProperties);
};
