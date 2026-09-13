import Link from 'next/link';
import { Home } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 border-t border-slate-800">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Delala Rentals</span>
          </div>
          <p className="text-sm text-slate-400">
            Ethiopia&apos;s trusted property marketplace for rental apartments, family villas, and commercial real estate.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/properties" className="hover:text-emerald-400 transition-colors">Properties</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Platform</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Portals</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/renter/dashboard" className="hover:text-emerald-400 transition-colors">Renter Portal</Link></li>
            <li><Link href="/owner/dashboard" className="hover:text-emerald-400 transition-colors">Owner Portal</Link></li>
            <li><Link href="/agent/dashboard" className="hover:text-emerald-400 transition-colors">Agent Workspace</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">Admin Panel</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Headquarters</h4>
          <p className="text-sm text-slate-400">Bole Medhaniallem, Addis Ababa, Ethiopia</p>
          <p className="text-sm text-slate-400 mt-1">support@ethiodelala.com</p>
          <p className="text-sm text-slate-400">+251 911 000 000</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Delala Property Platform. All rights reserved.</p>
        <p>Built for the Ethiopian Real Estate Ecosystem</p>
      </div>
    </footer>
  );
}

export default Footer;
