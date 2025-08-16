import { useEffect, ReactNode, useState, useReducer } from "react";

const SuspendedChildProbe = ({
  onReady,
  children,
}: {
  onReady: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return children;
};
export function FadeInWAAPI({ children }: { children: ReactNode }) {
  const [ready, setReady] = useReducer((state: boolean) => !state, false);

  return (
    <div className="fade-in" data-ready={ready ? "true" : undefined}>
      <SuspendedChildProbe onReady={setReady}>{children}</SuspendedChildProbe>
    </div>
  );
}
