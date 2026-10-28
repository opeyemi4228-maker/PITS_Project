import React from "react";
import {
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Users,
  Wheat,
  Zap,
} from "lucide-react";

/* lib/agenda.js names its icons as strings so it stays plain data. This is the
   one place those names become components, and the only icons it can name. */
const icons = {
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Users,
  Wheat,
  Zap,
};

export default function AgendaIcon({ name, ...props }) {
  const Icon = icons[name] ?? ShieldCheck;
  return <Icon aria-hidden="true" {...props} />;
}
