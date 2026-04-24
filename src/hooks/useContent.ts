// Fix the import path - adjust based on your actual file structure
import completeData from "../src/data/completeData.json";

export const useContent = () => {
    return {
        navbar: completeData.navbar || {},
        hero: completeData.hero || {},
        about: completeData.about || {},
        services: completeData.services || {},
        leadership: completeData.leadership || {},
        portfolio: completeData.portfolio || {},
        testimonials: completeData.testimonials || {},
        whyChooseUs: completeData.whyChooseUs || {},
        faq: completeData.faq || {},
        quote: completeData.quote || {},
        footer: completeData.footer || {},
        team: completeData.team || {},
        careers: completeData.careers || {},
        aboutPage: completeData.aboutPage || {},
        images: completeData.images || {},
        loader: completeData.loader || {},
        quickQuote: completeData.quickQuote || {},
        hours: completeData.hours || {},
        contactPage: completeData.contactPage || {},
        galleryPage: completeData.galleryPage || {},
        brandStore: (completeData as any).brandStore || {},
        serviceDetailPage: (completeData as any).serviceDetailPage || {},
    };
};