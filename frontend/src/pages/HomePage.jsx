import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Users, PawPrint, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import PetCard from '../components/pets/PetCard';
import { fetchPets } from '../services/api';

const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPets = async () => {
      try {
        setLoading(true);
        const response = await fetchPets({ limit: 4, featured: true });
        setFeaturedPets(response.pets || []);
      } catch (error) {
        console.error('Error loading featured pets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPets();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-[700px] bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1600)', 
            backgroundPosition: '50% 40%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/40"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Find Your Perfect <span className="text-purple-300">Furry Companion</span>
                </h1>
                <p className="text-xl text-white mb-8 opacity-90">
                  Connect with pets looking for their forever homes. Your new best friend is just a click away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button to="/pets" variant="primary" size="lg">
                    Find a Pet
                  </Button>
                  <Button to="/foster-program" variant="outline" size="lg" className="bg-white/20 text-white border-white hover:bg-white/30">
                    Learn About Fostering
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Search Box */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your New Best Friend</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">All Animals</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="bird">Birds</option>
                  <option value="other">Others</option>
                </select>
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="col-span-3 md:col-span-1 flex items-end">
                <Button to="/pets" variant="primary" fullWidth>
                  <Search size={18} className="mr-2" />
                  Search Pets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Pets</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These lovable companions are waiting for their forever homes. Could you be their perfect match?
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredPets.length > 0 ? (
                  featuredPets.map(pet => (
                    <PetCard key={pet._id} pet={pet} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No featured pets available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="mt-12 text-center">
                <Button to="/pets" variant="outline" size="lg">
                  View All Pets
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've made the adoption process simple and straightforward so you can focus on finding your perfect pet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-lg p-8 text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Search & Discover</h3>
              <p className="text-gray-600">
                Browse our database of adorable pets waiting for adoption. Use filters to find your perfect match based on species, age, size, and more.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-8 text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apply & Connect</h3>
              <p className="text-gray-600">
                Submit an adoption application for your chosen pet. Our shelter partners will review your application and contact you to discuss the next steps.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-8 text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <PawPrint className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Welcome Home</h3>
              <p className="text-gray-600">
                Meet your new companion, complete the adoption process, and welcome your new family member home. A lifetime of love and memories awaits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Hear from families who found their perfect companions through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Sarah J." 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-xl">Sarah J.</h3>
                  <p className="opacity-80">Adopted Max, Golden Retriever</p>
                </div>
              </div>
              <p className="italic opacity-90">
                "Max has brought so much joy to our family. The adoption process was smooth, and the shelter was incredibly helpful. We couldn't imagine life without him now!"
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="David T." 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-xl">David T.</h3>
                  <p className="opacity-80">Adopted Luna, Tabby Cat</p>
                </div>
              </div>
              <p className="italic opacity-90">
                "The match algorithm really works! Luna fits perfectly with our lifestyle. She's playful but also content to curl up next to me while I work. The best decision ever."
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Emily & Mark" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-xl">Emily & Mark</h3>
                  <p className="opacity-80">Adopted Bella, Shepherd Mix</p>
                </div>
              </div>
              <p className="italic opacity-90">
                "As first-time pet owners, we were nervous. The resources on the platform helped us prepare, and the shelter staff answered all our questions. Bella is now the center of our world!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-100 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Match?</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Whether you're looking to adopt, foster, or volunteer, we have plenty of loving animals waiting for a second chance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button to="/pets" variant="primary" size="lg">
                    Find a Pet
                  </Button>
                  <Button to="/foster-program" variant="outline" size="lg">
                    Become a Foster
                  </Button>
                </div>
              </div>
              <div 
                className="bg-cover bg-center h-96 md:h-auto"
                style={{ backgroundImage: 'url(https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Shelters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Shelter Partners</h2>
            <p className="text-gray-600">
              We work with trusted animal shelters and rescue groups across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <PawPrint size={32} className="text-purple-600 mr-2" />
                    <span className="font-semibold text-gray-800 text-lg">Shelter {i + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link to="#" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
              View All Partners
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;