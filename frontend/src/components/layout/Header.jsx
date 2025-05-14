import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, MessageCircle, LogOut, PawPrint, Home, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated, isShelter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Find Pets', path: '/pets', icon: <Search size={18} /> },
    { name: 'Foster Program', path: '/foster-program', icon: <PawPrint size={18} /> },
    { name: 'About', path: '/about', icon: null },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <PawPrint size={32} className="text-purple-600" />
            <span className="text-xl font-bold text-gray-900">PetPals</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-purple-600 ${
                  location.pathname === link.path ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 focus:outline-none"
                >
                  <span className="font-medium">{currentUser?.name || 'User'}</span>
                  <ChevronDown size={16} />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    {isShelter ? (
                      <Link to="/shelter-dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <PawPrint size={16} className="mr-2" />
                        Shelter Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/favorites" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Heart size={16} className="mr-2" />
                          Favorites
                        </Link>
                        <Link to="/applications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <PawPrint size={16} className="mr-2" />
                          Applications
                        </Link>
                      </>
                    )}
                    <Link to="/messages" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <MessageCircle size={16} className="mr-2" />
                      Messages
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button to="/login" variant="outline" size="sm">
                  Log In
                </Button>
                <Button to="/register" variant="primary" size="sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Link>
                
                {isShelter ? (
                  <Link
                    to="/shelter-dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                  >
                    <PawPrint size={18} className="mr-2" />
                    Shelter Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/favorites"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <Heart size={18} className="mr-2" />
                      Favorites
                    </Link>
                    <Link
                      to="/applications"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                    >
                      <PawPrint size={18} className="mr-2" />
                      Applications
                    </Link>
                  </>
                )}
                
                <Link
                  to="/messages"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Messages
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                >
                  <LogOut size={18} className="mr-2" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Button to="/login" variant="outline" fullWidth>
                  Log In
                </Button>
                <Button to="/register" variant="primary" fullWidth>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;