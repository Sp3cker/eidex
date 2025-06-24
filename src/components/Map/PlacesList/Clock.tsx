import {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
  useRef,
  RefObject,
} from "react";

// Static styles to avoid re-creating objects
const visibleStyle = { visibility: "visible" as const };
const hiddenStyle = { visibility: "hidden" as const };

const Colon = memo(function Colon({ show }: { show: boolean }) {
  return <p style={show ? visibleStyle : hiddenStyle}>:</p>;
});

function useIntersectionObserver(): [
  RefObject<HTMLDivElement | null>,
  boolean,
] {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "100px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [elementRef, isVisible];
}

// Pre-calculated period symbols to avoid repeated array creation
const PERIOD_SYMBOLS = {
  CLOUDY: "⛅", // 6 AM to 12:59 PM (morning/midday)
  SUN: "☼", // 1 PM to 5:59 PM (afternoon)
  WANING: "☾", // 7 PM to 12:59 AM (early night)
  WAXING: "☽", // 1 AM to 5:59 AM (late night)
} as const;

// React.memo with areEqual comparison to prevent all unnecessary re-renders
const Clock = memo(function Clock() {
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [periodSymbol, setPeriodSymbol] = useState<string>("");
  const [showColon, setShowColon] = useState<boolean>(true);
  const [clockRef, isVisible] = useIntersectionObserver();

  // Static formatter - never changes
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tokyo",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    [],
  );

  const getPeriodSymbol = useCallback((hour24: number): string => {
    if (hour24 >= 6 && hour24 < 13) {
      return PERIOD_SYMBOLS.CLOUDY;
    } else if (hour24 >= 13 && hour24 < 18) {
      return PERIOD_SYMBOLS.SUN;
    } else if (hour24 >= 19 || hour24 < 1) {
      return PERIOD_SYMBOLS.WANING;
    } else {
      return PERIOD_SYMBOLS.WAXING;
    }
  }, []);

  // Use refs to avoid state setter dependencies in useEffect
  const updateTime = useCallback(() => {
    const now = new Date();

    // Get 24-hour format for period symbol calculation
    const hour24 = parseInt(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
        hour: "numeric",
        hour12: false,
      }),
    );

    // Get formatted time string
    const formattedTime = formatter
      .format(now)
      .replace("AM", "A.M.")
      .replace("PM", "P.M.");

    const [timePart, periodPart] = formattedTime.split(" ");
    const [h, m] = timePart.split(":");

    setHour(h);
    setMinute(m);
    setPeriod(periodPart);
    setPeriodSymbol(getPeriodSymbol(hour24));
  }, [formatter, getPeriodSymbol]);

  const toggleColon = useCallback(() => {
    setShowColon((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Don't run when off screen.

    updateTime(); // Initial call
    const timeInterval = setInterval(updateTime, 60000);
    const colonInterval = setInterval(toggleColon, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(colonInterval);
    };
  }, [updateTime, toggleColon, isVisible]);

  return (
    <div ref={clockRef} className="pr-1 pt-1 content-visibility font-pkmnem pkmn-types flex items-center text-lg/4 text-neutral-600">
      <p>{periodSymbol}</p>
      {"\u2006"}
      <span className="tracking-wider">{hour}</span>
      {"\u202a"}
      <Colon show={showColon} />
      {"\u202a"}
      <span className="tracking-wider">
        {minute}
        {"\u200a"}
        {period}
      </span>
    </div>
  );
});

export default Clock;
