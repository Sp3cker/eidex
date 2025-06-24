import {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";

const Colon = memo(function Colon() {

  const [show, setShow] = useState<boolean>(true);
  const handleShow = () => {
    setShow(!show);
  };
  useEffect(() => {
    // handleShow(); // Initial call to set visibility
    const timeInterval = setInterval(handleShow, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [handleShow]);
  return <p className={show ? 'visible' : 'invisible'}>:</p>;
});

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

  useEffect(() => {
    updateTime(); // Initial call
    const timeInterval = setInterval(updateTime, 60000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [updateTime]);

  return (
    <div className="content-visibility font-pkmnem pkmn-types flex items-center pr-1 pt-1 text-lg/4 text-neutral-600">
      <p>{periodSymbol}</p>
      {"\u2006"}
      <span className="tracking-wider">{hour}</span>
      {"\u202a"}
      <Colon />
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
