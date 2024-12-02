import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { ContactItemConfig } from "../../../types";

// Factory function to create contact items configuration
// Centralizes the creation of contact item data with proper URLs and formatting
export const createContactItems = (
  email: string,
  linkedIn: string,
  github: string,
  location: string,
): ContactItemConfig[] => [
  {
    icon: Mail,
    label: "Email",
    value: email,
    href: `mailto:${email}`,
    isLink: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: linkedIn,
    href: `https://www.linkedin.com/in/${linkedIn}`,
    isLink: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: github,
    href: `https://github.com/${github}`,
    isLink: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: location,
    isLink: false,
  },
];
