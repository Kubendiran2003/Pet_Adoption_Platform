import React from 'react';
import { PawPrint, Heart, Home, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

const FosterProgramPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-purple-700 py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/1350593/pexels-photo-1350593.jpeg?auto=compress&cs=tinysrgb&w=1600)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Become a Foster Parent
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Open your heart and home to pets in need. Foster parents provide temporary care and love until permanent homes are found.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-50"
          >
            Apply to Foster
          </Button>
        </div>
      </div>

      {/* Why Foster Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Foster?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fostering saves lives and provides crucial support to our shelter network. Here's how you can make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
              <p className="text-gray-600">
                Each foster home opens up space in shelters for more animals to be rescued.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Provide Care</h3>
              <p className="text-gray-600">
                Give pets the individual attention and love they need to thrive.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Commitment</h3>
              <p className="text-gray-600">
                Choose fostering opportunities that fit your schedule and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Fostering Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our fostering process is designed to be straightforward and supportive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">
                  Fill out our foster application form and complete a brief interview.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Home Check</h3>
                <p className="text-gray-600">
                  We'll verify your living space is safe and suitable for fostering.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Match</h3>
                <p className="text-gray-600">
                  Get matched with pets that fit your experience and availability.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-purple-200 transform -translate-y-1/2"></div>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Foster</h3>
              <p className="text-gray-600">
                Provide temporary care with our full support and resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Foster Requirements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Basic requirements to become a foster parent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CheckCircle className="text-green-500 w-6 h-6 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Age Requirement</h3>
                  <p className="text-gray-600">Must be at least 21 years old</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CheckCircle className="text-green-500 w-6 h-6 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Residence</h3>
                  <p className="text-gray-600">Stable housing situation with landlord approval if renting</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CheckCircle className="text-green-500 w-6 h-6 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Time Commitment</h3>
                  <p className="text-gray-600">Ability to provide daily care and attention</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CheckCircle className="text-green-500 w-6 h-6 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Transportation</h3>
                  <p className="text-gray-600">Reliable transportation for vet visits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Provided */}
      <div className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">We Support Our Fosters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You're never alone in your fostering journey. We provide comprehensive support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Medical Care</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>All veterinary care covered</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>24/7 emergency support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Regular check-ups included</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Supplies</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Food and nutrition</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Beds and equipment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Toys and enrichment items</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Training & Support</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Foster orientation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Behavior guidance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span>Community support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our foster program.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">How long do I need to foster?</h3>
              <p className="text-gray-600">
                Foster periods vary depending on the pet's needs, typically ranging from a few weeks to a few months. We work with your schedule and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Can I foster if I have pets?</h3>
              <p className="text-gray-600">
                Yes! Many of our foster parents have resident pets. We'll match you with compatible foster pets and provide guidance on introductions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What if I want to adopt my foster pet?</h3>
              <p className="text-gray-600">
                Foster parents often have the first opportunity to adopt their foster pets. We call this "foster failing" - and it's perfectly okay!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join our network of foster parents and help save lives, one pet at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary"
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50"
            >
              Apply Now
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-purple-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FosterProgramPage;