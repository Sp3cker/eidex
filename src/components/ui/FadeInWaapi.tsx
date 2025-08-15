import { useEffect, ReactNode, useState } from "react";

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
  const [ready, setReady] = useState(false);

  return (
    <div className="fade-in" data-ready={ready ? "true" : undefined}>
      <SuspendedChildProbe onReady={() => setReady(true)}>
        {children}
      </SuspendedChildProbe>
    </div>
  );
}
