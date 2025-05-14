import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Home, Search } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center">
          <div className="relative">
            <PawPrint size={80} className="text-purple-200" />
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-purple-600">
              404
            </div>
          </div>
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-3 text-lg text-gray-600">
          Oops! The page you're looking for seems to have wandered off.
        </p>
        
        <div className="mt-8 space-y-4">
          <Button to="/" variant="primary" size="lg" icon={<Home size={18} />}>
            Go Home
          </Button>
          <Button to="/pets" variant="outline" size="lg" icon={<Search size={18} />}>
            Find Pets
          </Button>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500">
            Lost? Try <Link to="/about" className="text-purple-600 hover:text-purple-700">About Us</Link> or <Link to="/contact" className="text-purple-600 hover:text-purple-700">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;