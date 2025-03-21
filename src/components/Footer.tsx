import React from 'react';
export function Footer() {
  return <footer className="w-full bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-purple-600 font-bold text-2xl mb-4">
              Her<span className="text-teal-500">mony</span>
            </div>
            <p className="text-gray-600">
              Empowering women in tech to harmonize their professional and
              personal lives.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Smart Scheduler
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Mentoring Hub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Networking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Well-Being Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Career Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2023 Hermony. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>;
}