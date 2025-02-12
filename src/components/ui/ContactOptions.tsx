import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ContactOptionsProps {
  translations: any;
}

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-4 h-4 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);


const ContactOptions: React.FC<ContactOptionsProps> = ({ translations }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto font-roboto text-sm font-light">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-500/10 dark:bg-gray-800/20 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5
              ${selected 
                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              <span>Email</span>
            </div>
          </Tab>
          {/* <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5
              ${selected 
                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Meeting</span>
            </div>
          </Tab> */}
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5
              ${selected 
                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <WhatsAppIcon />
              <span>Whatsapp</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <EmailForm translations={translations} />
          </Tab.Panel>
          {/* <Tab.Panel>
            <GoogleCalendarEmbed />
          </Tab.Panel> */}
          <Tab.Panel>
            <WhatsAppPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

const EmailForm: React.FC<{ translations: any }> = ({ translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Send error:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <input
          type="text"
          className="w-full rounded-md border bg-gray-500/10 dark:border-gray-700 
                     bg-white dark:bg-gray-800/20 p-2"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder={translations.contact.name}
          required
        />
      </div>
      <div>
        <input
          type="email"
          className="w-full rounded-md border bg-gray-500/10 dark:border-gray-700 
                     bg-white dark:bg-gray-800/20 p-2"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder={translations.contact.email}
          required
        />
      </div>
      <div>
        <textarea
          className="w-full rounded-md border bg-gray-500/10 dark:border-gray-700 
                     bg-white dark:bg-gray-800/20 p-2 h-32"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          placeholder={translations.contact.message}
          />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className={`w-full px-4 py-2 rounded-md transition-colors ${
          status === 'sending'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {status === 'sending' ? <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mx-auto"/> : translations.contact.send}
      </button>

      {status === 'success' && (
        <div className="text-green-600 text-center">Message sent successfully!</div>
      )}
      {status === 'error' && (
        <div className="text-red-600 text-center">Failed to send message. Please try again.</div>
      )}
    </form>
  );
};

const WhatsAppPanel: React.FC = () => {
  return (
    <div className="text-center p-4 bg-gray-500/10 dark:bg-gray-800/20 rounded-lg">
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-green-600 text-white px-6 py-3 rounded-full transition-colors"
      >
        <WhatsAppIcon className="fill-white" />
      </a>
    </div>
  );
};

const GoogleCalendarEmbed: React.FC = () => {

  const googleCalendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

  if (!googleCalendarId) {
    return <div>No Google Calendar ID found</div>;
  }

  return (
    <iframe
      src={`${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}`}
      style={{ border: 0 }}
      className="w-full h-[600px] rounded-md"
    ></iframe>
  );
};

export default ContactOptions; 