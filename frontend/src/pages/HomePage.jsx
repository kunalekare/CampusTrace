import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Search, Sparkles, ShieldCheck, ArrowRight, Cloud, CheckCircle } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-blue-50/60 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100/80 text-blue-800 border border-blue-200 mb-6">
              <Cloud className="w-4 h-4 text-blue-600" /> Powered by Microsoft Azure Cloud Architecture
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto">
              Lost Something on Campus? <br className="hidden sm:inline" />
              <span className="text-blue-600">Trace, Match & Recover in Minutes.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              CampusTrace is the university network connecting students and campus security. Powered by rule-based algorithmic matching, image verification, and audited handovers.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/browse"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" /> Browse Lost & Found
              </Link>
              <Link
                to="/report-lost"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                Report Lost Belonging <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Correlation Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates weighted matching scores (Category 25%, Keywords 25%, Brand 20%, Location 10%, Date 10%) to pair lost reports with newly found items automatically.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Ownership Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Private serial numbers, secret questions, and receipt proofs prevent false claims. Campus security verifies identity before releasing any recovered belongings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Azure Cloud Enterprise</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Encrypted image storage on Azure Blob Storage, relational transaction consistency in Azure SQL, and live health telemetry via Application Insights.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}