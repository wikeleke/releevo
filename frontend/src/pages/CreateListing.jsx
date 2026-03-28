import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle, ChevronRight, ChevronLeft, MapPin, Briefcase, DollarSign, ShieldCheck, FileText } from 'lucide-react';

const steps = [
    { id: 1, name: 'Basic Info', icon: Briefcase },
    { id: 2, name: 'Location & Setup', icon: MapPin },
    { id: 3, name: 'Financials', icon: DollarSign },
    { id: 4, name: 'Confidential Info', icon: ShieldCheck },
    { id: 5, name: 'Review & Submit', icon: CheckCircle }
];

const CreateListing = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user || user.role !== 'seller') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Retail',
        sector: '',
        giro: '',
        size: 'Small',
        city: '',
        state: '',
        askingPrice: '',
        annualRevenue: '',
        annualProfit: '',
        businessName: '',
        exactAddress: '',
        contactPhone: '',
        contactEmail: '',
        website: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                sector: formData.sector,
                giro: formData.giro,
                size: formData.size,
                location: { city: formData.city, state: formData.state },
                financials: {
                    askingPrice: Number(formData.askingPrice),
                    annualRevenue: Number(formData.annualRevenue),
                    annualProfit: Number(formData.annualProfit)
                },
                confidentialData: {
                    businessName: formData.businessName,
                    exactAddress: formData.exactAddress,
                    contactPhone: formData.contactPhone,
                    contactEmail: formData.contactEmail,
                    website: formData.website
                }
            };

            await api.post('/business', payload);
            navigate('/dashboard'); // Go back to dashboard after creating
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch(currentStep) {
            case 1:
                return formData.title && formData.description && formData.category && formData.sector;
            case 2:
                return formData.giro && formData.size && formData.city && formData.state;
            case 3:
                return formData.askingPrice && formData.annualRevenue && formData.annualProfit;
            case 4:
                return formData.businessName && formData.exactAddress && formData.contactPhone && formData.contactEmail;
            default:
                return true;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-oxford">Create Business Profile</h1>
                    <p className="mt-2 text-lg text-gray-600">Complete the details below to list your business on Releevo.</p>
                </div>
                
                {/* Stepper Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            return (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                        isActive ? 'bg-marine text-white shadow-lg ring-4 ring-blue-100' :
                                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`mt-3 text-xs md:text-sm font-bold ${
                                        isActive ? 'text-marine' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Progress Bar Background */}
                    <div className="relative -mt-10 mb-10 mx-6 h-1 bg-gray-200 z-0">
                        <div 
                            className="absolute top-0 left-0 h-1 bg-marine transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 transition-all duration-500">
                    <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Posting Title *</label>
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine transition-colors" placeholder="e.g. Highly Profitable Downtown Cafe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                                    <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine transition-colors" placeholder="Provide a compelling overview of the business, its history, and the opportunity..."></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine bg-white">
                                            <option value="Retail">Retail</option>
                                            <option value="Food & Beverage">Food & Beverage</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Services">Services</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Healthcare">Healthcare</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sector / Industry *</label>
                                        <input type="text" name="sector" required value={formData.sector} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. Specialty Coffee" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location & Setup */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Setup</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Giro (Local Classification) *</label>
                                        <input type="text" name="giro" required value={formData.giro} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. Restaurante-Bar" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Business Size *</label>
                                        <select name="size" value={formData.size} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine bg-white">
                                            <option value="Small">Small (1-10 employees)</option>
                                            <option value="Medium">Medium (11-50 employees)</option>
                                            <option value="Large">Large (50+ employees)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                        <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. San Francisco" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State / Province *</label>
                                        <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. California" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Financials */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
                                <p className="text-gray-500 mb-4">Provide accurate financial metrics to attract serious buyers.</p>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Asking Price (USD) *</label>
                                        <div className="absolute inset-y-0 left-0 pt-7 pl-4 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="number" name="askingPrice" required value={formData.askingPrice} onChange={handleChange} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. 500000" />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Annual Revenue (USD) *</label>
                                        <div className="absolute inset-y-0 left-0 pt-7 pl-4 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="number" name="annualRevenue" required value={formData.annualRevenue} onChange={handleChange} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. 1200000" />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Annual Net Profit / Cash Flow (USD) *</label>
                                        <div className="absolute inset-y-0 left-0 pt-7 pl-4 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="number" name="annualProfit" required value={formData.annualProfit} onChange={handleChange} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. 250000" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confidential Info */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Confidential Details</h2>
                                        <p className="text-gray-500 mt-1">This info is protected and strictly shown ONLY to approved Premium buyers under NDA.</p>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 text-green-500" />
                                </div>
                                
                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Actual Business Legal Name *</label>
                                        <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. Acme Corporation LLC" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Exact Street Address *</label>
                                        <input type="text" name="exactAddress" required value={formData.exactAddress} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="e.g. 123 Main St, Suite 4B" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone *</label>
                                            <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="+1 (555) 000-0000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email *</label>
                                            <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="owner@company.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Website URL (Optional)</label>
                                        <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marine/50 focus:border-marine" placeholder="https://www.example.com" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {currentStep === 5 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
                                <p className="text-gray-500 mb-8">Please review your business profile details before submitting for approval.</p>
                                
                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-marine mb-4 border-b border-gray-200 pb-2">Listing Overview</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Title</span><p className="font-semibold">{formData.title}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Category</span><p className="font-semibold">{formData.category}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Location</span><p className="font-semibold">{formData.city}, {formData.state}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Size</span><p className="font-semibold">{formData.size}</p></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-marine mb-4 border-b border-gray-200 pb-2">Financials</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Asking</span><p className="font-semibold">${Number(formData.askingPrice).toLocaleString()}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Revenue</span><p className="font-semibold">${Number(formData.annualRevenue).toLocaleString()}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Profit</span><p className="font-semibold">${Number(formData.annualProfit).toLocaleString()}</p></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                                        <h3 className="text-lg font-bold text-green-700 mb-4 border-b border-blue-100 pb-2 flex items-center"><ShieldCheck className="w-5 h-5 mr-2" /> Confidential Info</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Legal Name</span><p className="font-semibold">{formData.businessName}</p></div>
                                            <div><span className="text-xs text-gray-500 font-bold uppercase">Email</span><p className="font-semibold">{formData.contactEmail}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 font-bold rounded-xl transition-all ${
                                    currentStep === 1 ? 'opacity-0 cursor-default' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" /> Back
                            </button>

                            {currentStep < steps.length ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid()}
                                    className="flex items-center px-8 py-3 font-bold rounded-xl bg-marine text-white hover:bg-blue-900 transition-all shadow-md disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    Continue <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center px-10 py-3 font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Profile for Approval'} <CheckCircle className="w-5 h-5 ml-2" />
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
