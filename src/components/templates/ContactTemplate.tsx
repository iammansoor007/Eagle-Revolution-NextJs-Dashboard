"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import Link from "next/link";

const HolographicInput = ({ icon: IconName, label, type = "text", ...props }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="relative group">
            <div className={`relative flex items-center bg-card rounded-xl border transition-all ${isFocused ? 'border-primary shadow-lg' : 'border-border'}`}>
                <div className="absolute left-4 text-muted-foreground"><Icon name={IconName} className="w-5 h-5" /></div>
                <input type={type} placeholder={label} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none" {...props} />
            </div>
        </div>
    );
};

export default function ContactTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { contactPage: contactData } = useContent();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'Contact Form' })
            });
            if (response.ok) setShowSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative bg-background py-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <h1 className="text-4xl sm:text-7xl font-light mb-6">{contactData?.header?.headline}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{contactData?.header?.description}</p>
            </div>
            <div className="max-w-4xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <HolographicInput icon="User" label="Name" name="name" onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
                        <HolographicInput icon="Mail" label="Email" type="email" name="email" onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <textarea placeholder="Message" rows={6} className="w-full p-4 bg-card border rounded-xl focus:outline-none focus:border-primary" onChange={(e: any) => setFormData({ ...formData, message: e.target.value })} required />
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary text-white rounded-full font-bold transition-all disabled:opacity-50">
                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>
                </form>
            </div>
            {showSuccess && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"><div className="bg-white p-8 rounded-2xl text-center"><h2>Sent Successfully!</h2><button onClick={() => setShowSuccess(false)} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">Close</button></div></div>}
        </main>
    );
}
