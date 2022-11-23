import { useState } from "react";
import useInterval from '@use-it/interval';

function Counter(props) {
  const [timeLeft, setTimeLeft] = useState("1:00");

  function calculateTimeLeft() {
    const difference = +new Date() - props.startTime;
    if (difference >= 60000) {
      props.endTest();
    }
    let timeLeft = 60 - Math.floor((difference / 1000) % 60);
    if (timeLeft < 0) return "1:00";
    if (timeLeft < 10) timeLeft = "0" + timeLeft;
    return `0:${timeLeft}`;
  };

  useInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, props.startTime ? 1000 : null)

  if (!props.startTime) return <></>;

  return <h4 style={{ color: "#fff" }}>{timeLeft}</h4>;
}

export default Counter;
