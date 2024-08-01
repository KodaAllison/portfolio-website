'use client';

import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const calculateTimeLeft = () => {
  const marathonDate = new Date("2025-03-16T08:30:00");
  const currentTime = new Date();
  const difference = marathonDate - currentTime;

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      totalSeconds: Math.floor(difference / 1000),
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;
};

const TimerComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  const { totalSeconds, days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="timer-container">
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds}
          colors={[["#4CAF50", 0.33], ["#FFC107", 0.33], ["#F44336", 0.33]]}
          size={100}
          strokeWidth={8}
          trailColor="#d6d6d6"
        >
          {() => <span className="timer-text">{days}d</span>}
        </CountdownCircleTimer>
        <div className="timer-label">Days</div>
      </div>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={24 * 60 * 60}
          initialRemainingTime={hours * 60 * 60 + minutes * 60 + seconds}
          colors={[["#4CAF50", 0.33], ["#FFC107", 0.33], ["#F44336", 0.33]]}
          size={100}
          strokeWidth={8}
          trailColor="#d6d6d6"
          onComplete={() => ({ shouldRepeat: true })}
        >
          {() => <span className="timer-text">{hours}h</span>}
        </CountdownCircleTimer>
        <div className="timer-label">Hours</div>
      </div>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={60 * 60}
          initialRemainingTime={minutes * 60 + seconds}
          colors={[["#4CAF50", 0.33], ["#FFC107", 0.33], ["#F44336", 0.33]]}
          size={100}
          strokeWidth={8}
          trailColor="#d6d6d6"
          onComplete={() => ({ shouldRepeat: true })}
        >
          {() => <span className="timer-text">{minutes}m</span>}
        </CountdownCircleTimer>
        <div className="timer-label">Minutes</div>
      </div>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={60}
          initialRemainingTime={seconds}
          colors={[["#4CAF50", 0.33], ["#FFC107", 0.33], ["#F44336", 0.33]]}
          size={100}
          strokeWidth={8}
          trailColor="#d6d6d6"
          onComplete={() => ({ shouldRepeat: true })}
        >
          {() => <span className="timer-text">{seconds}s</span>}
        </CountdownCircleTimer>
        <div className="timer-label">Seconds</div>
      </div>
    </div>
  );
};

export default TimerComponent;
