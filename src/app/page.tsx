import { FileIcon, PlusIcon, Truck } from "lucide-react";
import Link from "next/link";
import AdBanner from "@/components/Ads";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex flex-col justify-between">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-7">
            {/* Welcome Banner */}
            <div className="pb-6 lg:pb-8">
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-600 rounded-full opacity-20 transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-slate-950 rounded-full opacity-20 transform -translate-x-10 sm:-translate-x-12 translate-y-10 sm:translate-y-12"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
                    Welcome
                  </h2>
                  <p className="text-blue-200 text-base sm:text-lg lg:text-xl leading-relaxed">
                    Manage your quotes, track updates, and streamline your workflow all in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Tracking Updates */}
              <Link href="/tracking-updates" className="group">
                <div className="bg-white rounded-xl transition-all duration-300 p-4 sm:p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-1">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-800" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-800 transition-colors mb-2">
                    Tracking Updates
                  </h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                    Monitor real-time project progress and deliverables.
                  </p>
                  <div className="flex items-center text-blue-800 font-medium group-hover:text-blue-600 text-sm sm:text-base">
                    <span>View Updates</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Get a Quote */}
              <Link href="/get-a-quote" className="group">
                <div className="bg-white rounded-xl transition-all duration-300 p-4 sm:p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-1">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                    <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-800" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-800 transition-colors mb-2">
                    Fast Quote
                  </h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                    Request custom quotes with competitive pricing.
                  </p>
                  <div className="flex items-center text-blue-800 font-medium group-hover:text-blue-600 text-sm sm:text-base">
                    <span>Request Quote</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* My Quotes - Full width on mobile, spans both columns */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Link href="/my-quotes" className="group">
                  <div className="bg-white rounded-xl transition-all duration-300 p-4 sm:p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg mb-3 sm:mb-4 group-hover:bg-blue-100 transition-colors">
                      <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-800" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-800 transition-colors mb-2">
                      My Quotes
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                      Access and manage your saved quotes and proposals.
                    </p>
                    <div className="flex items-center text-blue-800 font-medium group-hover:text-blue-600 text-sm sm:text-base">
                      <span>View Quotes</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Add an empty div to maintain grid alignment on larger screens */}
              <div className="hidden lg:block"></div>
            </div>
          </div>

          {/* Ad Banner - Responsive positioning */}
          <div className="xl:col-span-5 mt-6 xl:mt-0">
            <div className="sticky top-24">
              <AdBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-blue-100 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            Powered by Ociuz Infotech Pvt Ltd
          </p>
        </div>
      </footer>
    </div>
  );
}