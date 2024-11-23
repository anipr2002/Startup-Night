"use client";
import React, { useState, useEffect } from "react";
import { format, startOfMonth, differenceInCalendarWeeks } from "date-fns";

const getWeekOfMonth = (date: Date) => {
  const startWeek = differenceInCalendarWeeks(date, startOfMonth(date));
  return startWeek + 1; // Adding 1 because weeks are 1-indexed
};

const Timings = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const weekOfMonth = getWeekOfMonth(currentDate);

  return (
    <>
      <div className="flex items-center justify-between my-2">
        <div className="text-muted-foreground text-sm px-2">
          {format(currentDate, "MMM d, E")} - Week {weekOfMonth}
        </div>
        <div className="text-muted-foreground text-sm px-2">
          {format(currentDate, "h:mm a")}
        </div>
      </div>
    </>
  );
};

export default Timings;
