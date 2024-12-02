import { Terminal } from 'lucide-react';

// Renders the section header with a terminal icon and a decorative line
// Uses a hidden h2 for accessibility while maintaining visual design
export const ContactHeader = () => (
  <div className="flex items-center gap-2 text-purple-500 font-bold mb-4">
    <Terminal className="h-5 w-5" aria-hidden="true" />
    <h2 id="contact-heading" className="sr-only">
      Contact Information
    </h2>
    <div aria-hidden="true">
      ━━━ Contact Information ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </div>
  </div>
);
