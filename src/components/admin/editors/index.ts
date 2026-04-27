import dynamic from 'next/dynamic';

export const TemplateEditors: Record<string, any> = {
  home: dynamic(() => import('./HomeEditor')),
  about: dynamic(() => import('./AboutEditor')),
  services: dynamic(() => import('./ServicesEditor')),
};
