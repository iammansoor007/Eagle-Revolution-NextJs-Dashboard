import React from 'react';
import HomeTemplate from './HomeTemplate';
import AboutTemplate from './AboutTemplate';
import ServiceDetailTemplate from './ServiceDetailTemplate';
import TeamTemplate from './TeamTemplate';
import CareersTemplate from './CareersTemplate';
import ReviewsTemplate from './ReviewsTemplate';
import FAQTemplate from './FAQTemplate';
import ContactTemplate from './ContactTemplate';
import GalleryTemplate from './GalleryTemplate';
import ServicesTemplate from './ServicesTemplate';

export const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  'home': HomeTemplate,
  'about': AboutTemplate,
  'service-detail': ServiceDetailTemplate,
  'team': TeamTemplate,
  'careers': CareersTemplate,
  'reviews': ReviewsTemplate,
  'faq': FAQTemplate,
  'contact': ContactTemplate,
  'gallery': GalleryTemplate,
  'services': ServicesTemplate,
};

export const getTemplate = (name: string) => {
  return TEMPLATE_MAP[name] || HomeTemplate;
};
