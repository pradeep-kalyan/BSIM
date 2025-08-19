import { Step } from "react-joyride";

export const steps: Step[] = [
    {
      target: ".details",
      content:
        "Customize your dashboard  by dragging and arranging the sections.",
      disableBeacon: true,
      placement: "top",
    },
    {
      target: ".export-dashboard-btn",
      content: "Click here to download your dashboard as an image.",
      disableBeacon: true,
      placement: "auto",
    },
    {
      target: ".simulate-dashboard-btn",
      content: "Run a simulation to preview how your strategies will perform.",
      disableBeacon: true,
      placement: "auto",
    },
  ];