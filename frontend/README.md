# Pet Adoption Platform

A full-featured web application connecting pet shelters with potential adopters, built with React and modern web technologies.

## 🌟 Features

### For Adopters
- Browse and search available pets with advanced filtering
- Submit adoption applications
- Save favorite pets
- Message shelters directly
- Track application status
- Leave reviews for shelters
- Apply to become a foster parent

### For Shelters
- Manage pet listings with detailed profiles
- Process adoption applications
- Coordinate with foster parents
- Respond to user messages
- Manage shelter profile and reviews
- Track adoption statistics

## 🛠 Tech Stack

- **Frontend**: React, TailwindCSS
- **State Management**: React Context API
- **UI Components**: Custom components with TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **API Communication**: Axios
- **Form Handling**: Custom form components
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pet-adoption-platform.git
cd pet-adoption-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
pet-adoption-platform/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── applications/   # Application-related components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   └── pets/          # Pet-related components
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── public/                # Static assets
└── package.json          # Project dependencies
```

## 🔐 Authentication

The platform uses JWT-based authentication. Protected routes require users to be logged in, and certain features are restricted based on user roles (adopter/shelter).

## 🎨 UI Components

### Common Components
- Button
- Input
- Select
- Modal
- TextArea

### Pet Components
- PetCard
- PetFilters
- ApplicationForm

### Layout Components
- Header
- Footer
- Protected Routes

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🔍 Search & Filtering

Users can search pets based on:
- Type (dogs, cats, etc.)
- Breed
- Age
- Size
- Location
- Adoption status
- Good with (kids, other pets)

## 💬 Messaging System

- Real-time messaging between adopters and shelters
- Conversation management
- Notification system for new messages

## 📝 Forms

### Adoption Application
- Personal information
- Living situation
- Experience with pets
- References
- Additional questions

### Foster Application
- Availability
- Experience
- Home environment
- Schedule flexibility

## 🌐 API Integration

The frontend communicates with a RESTful API for:
- User authentication
- Pet management
- Application processing
- Messaging
- Reviews and ratings

## 🚀 Deployment

The application is deployed on Netlify:
- Frontend: [Website](https://pet-adoption-platform-kp.netlify.app)

## 🔄 State Management

- User authentication state
- Application forms
- Search filters
- Messaging
- Favorites

## 🎯 Future Enhancements

- Real-time notifications
- Virtual meet and greets
- Pet health records
- Donation system
- Social sharing
- Mobile app version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🤝 Support

For support, email kubendiranpalani289@gmail.com
