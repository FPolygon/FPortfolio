import React from 'react';
import { ContactHeader } from './ContactHeader';
import { ContactItem } from './ContactItem';
import { ContactFooter } from './ContactFooter';
import { createContactItems } from './config';
import type { ContactSectionProps } from '../../../types';

// Main contact section component that assembles all sub-components
// Provides default values for all contact information
export const ContactSection: React.FC<ContactSectionProps> = ({
  email = 'example@google.com',
  linkedIn = 'francis-pagulayan-924796222',
  github = 'FPolygon',
  location = 'Chicago, IL',
}) => {
  const contactItems = createContactItems(email, linkedIn, github, location);

  return (
    <section
      className="whitespace-pre-wrap bg-gray-900/50 p-6 rounded-lg"
      aria-labelledby="contact-heading"
    >
      <ContactHeader />
      <div className="grid grid-cols-1 gap-3">
        {contactItems.map(item => (
          <ContactItem key={item.label} {...item} />
        ))}
        <ContactFooter />
      </div>
    </section>
  );
};

export default ContactSection;
