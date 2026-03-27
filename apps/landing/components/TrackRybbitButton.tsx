"use client";
import React from "react";
import { Button } from "./Button";

type Props = {
  children: React.ReactNode;
  eventName: string;
  eventData?: Record<string, any>;
};

const TrackRybbitButton = ({ children, eventName, eventData }: Props) => {
  return (
    <button
      onClick={() => {
        if (
          typeof window !== "undefined" &&
          window.rybbit &&
          typeof window.rybbit.event === "function"
        ) {
          window.rybbit.event(eventName, eventData);
        } else {
          console.warn("Rybbit tracking not available.");
        }
      }}
    >
      {children}
    </button>
  );
};

export default TrackRybbitButton;
