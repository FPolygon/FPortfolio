import { LucideIcon } from "lucide-react";

export interface ContactSectionProps {
  email?: string;
  linkedIn?: string;
  github?: string;
  location?: string;
}

export interface ContactItemConfig {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  isLink?: boolean;
}
