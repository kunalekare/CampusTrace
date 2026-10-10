import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ItemImage } from '../components/common/ItemImage';
import { reportService } from '../services/reportService';
import { formatDate } from '../utils/dateUtils';
import { 
  Search, Sparkles, ShieldCheck, ArrowRight, Cloud, CheckCircle, 
  MapPin, Calendar, PlusCircle, Laptop, Key, CreditCard, Lock, Users, Zap
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    async function loadSample() {
      try {
        const data = await reportService.getReports({ limit: 3 });
        setRecentReports(data.reports || []);
      } catch (err) {
        console.error('Failed to load home sample reports:', err);
      } finally {
        setLoadingReports(false);
      }
    }
    loadSample();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-slate-50 to-slate-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Azure Architecture Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 mb-6 shadow-sm">
              <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Microsoft Azure Enterprise Cloud Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse hidden sm:inline" />
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Lost Something on Campus? <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Trace, Match & Recover
              </span> in Minutes.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              CampusTrace pairs lost belongings with newly discovered items using automated algorithmic correlation, encrypted Azure Blob photographs, and audited security desk handovers.
            </p>

            {/* Live Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto px-2">
              <div className="relative flex items-center shadow-lg shadow-blue-500/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for MacBook, TI-84 calculator, keys, wallet..."
                  className="w-full py-3.5 pl-3 pr-28 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/browse"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Browse Full Directory</span>
              </Link>
              <Link
                to="/report-lost"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-amber-500" />
                <span>Report Lost Belonging</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Real-Time Campus Metrics Strip */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block tracking-tight">1,200+</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Items Recovered</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 block tracking-tight">&lt; 2 Hours</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Avg. Match Speed</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 block tracking-tight">98.4%</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Verified Claim Accuracy</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block tracking-tight">3 Desks</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Active Campus Custody</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Directory Preview with Photographs */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                Live Directory Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Recently Registered Belongings
              </h2>
            </div>
            <Link
              to="/browse"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 w-fit"
            >
              <span>Explore all items in directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.length > 0 ? (
              recentReports.map(report => {
                const isLost = report.reportType === 'LOST';
                const blobName = report.imageBlobName || report.ImageBlobName;
                return (
                  <Link
                    key={report.reportId || report.ReportId}
                    to={`/browse?selected=${report.reportId || report.ReportId}`}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative">
                        <ItemImage
                          blobName={blobName}
                          category={report.category}
                          alt={report.title}
                          className="h-48 w-full"
                          showBadge={true}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg backdrop-blur-md shadow-sm ${
                              isLost
                                ? 'bg-amber-500/90 text-white border border-amber-400/40'
                                : 'bg-blue-600/90 text-white border border-blue-400/40'
                            }`}
                          >
                            {isLost ? 'Lost Item' : 'Found Item'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                          {report.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-400 dark:text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{report.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDate(report.eventDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 mt-1">
                      <span className="text-[11px] text-slate-400">Inspected by Security</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                        <span>Inspect Item</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              /* Fallback static cards if database is empty */
              <>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Electronics & Laptops</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    MacBooks, Dell XPS, iPads, and graphing calculators verified with protected serial numbers.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Dorm Keys & Lanyards</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Apartment fobs and brass dorm keys cataloged with specific key tags and ring decorations.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Student IDs & Wallets</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct automatic student directory matching with university email notifications.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* How It Works Workflow */}
        <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How CampusTrace Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              Built to eradicate manual lost & found logs with modern automation and Azure cloud security.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Step 1 */}
              <div className="relative bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Report Item with Photo
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload an item photo via drag-and-drop directly into encrypted Azure Blob Storage. Provide location, brand, date, and secret private verification details.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-indigo-500/20">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Algorithmic Smart Match
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our matching engine scores category (25%), keywords (25%), brand (20%), location (10%), and event date (10%) to instantly surface candidate matches with side-by-side photos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/20">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Security Handover
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Claim ownership with protected answers. Campus security checks verification credentials before physically handing over items, keeping full audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Azure Architecture Highlights */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Algorithmic Correlation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated similarity detection identifies potential correlations as soon as a matching item is filed anywhere across campus.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero-Knowledge Verification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Secret serial numbers, lock screen pins, and private engravings are hidden from public browse to prevent fraudulent claims.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Azure Cloud Enterprise</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Persistent Azure SQL database, Azure Blob image containers, and App Service Linux hosting with zero downtime.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Found an Unattended Item Today?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Take a quick photo and report it now. You could reunite a fellow classmate with their laptop, notes, or keys in minutes.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/report-found"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-2xl shadow-md transition"
                >
                  Report Found Item Now
                </Link>
                <Link
                  to="/browse"
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl border border-white/20 transition"
                >
                  Browse Campus Directory
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}