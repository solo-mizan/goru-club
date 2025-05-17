import Link from 'next/link';
import { MembersList } from '@/components/MembersList';
import { CowPurchasesList } from '@/components/CowPurchasesList';
import { Stats } from '@/components/Stats';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Hamba Village Union</h1>
        <p className="text-gray-600 mb-4">Community funding for cow purchases and meat distribution</p>
        <div className="mt-6">
          <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
            Admin Dashboard
          </Link>
        </div>
      </header>

      <Stats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Members</h2>
          <MembersList />
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cow Purchases</h2>
          <CowPurchasesList />
        </section>
      </div>

      <footer className="mt-16 text-center text-gray-600 pb-8">
        <p>&copy; {new Date().getFullYear()} Hamba Village Union. All rights reserved.</p>
      </footer>
    </div>
  );
}
