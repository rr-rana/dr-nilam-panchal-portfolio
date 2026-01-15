"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

type DelayedLoadingSpinnerProps = {
  delayMs?: number;
  wrapperClassName?: string;
};

const DelayedLoadingSpinner = ({
  delayMs = 300,
  wrapperClassName,
}: DelayedLoadingSpinnerProps) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSpinner(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs]);

  if (!showSpinner) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <LoadingSpinner />
    </div>
  );
};

export default DelayedLoadingSpinner;
