# HR Dashboard

A modern BANKING CRM   built with React, Vite, Tailwind CSS, and shadcn/ui components.

## Features

- 🔐 Authentication with OTP verification
- 👥 Employee management
- 📊 Dashboard with analytics and activity tracking
- 📱 Responsive design for mobile and desktop
- 🎨 Modern UI with Tailwind CSS
- 🧩 Reusable component structure

## Tech Stack

- **React**: Frontend library
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **React Router**: For navigation
- **Recharts**: For data visualization
- **Lucide React**: For icons

## Project Structure

The project follows a component-based architecture with a clear separation of concerns:

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── employee/          # Employee-related components
│   ├── layout/            # Layout components
│   └── ui/                # Base UI components
├── pages/                 # Page components
├── lib/                   # Utility functions
└── App.jsx                # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/iamvysh/mindfin-frontend.git
cd MINDFIN-DASH
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

The application includes a multi-step authentication flow:
1. Enter email and request OTP
2. Enter OTP received via email
3. Create/enter password

### Dashboard

The dashboard provides an overview of:
- Total employees
- Recent activities
- Key metrics
- Activity charts

### Employee Management

- View all employees
- Add new employees
- Search and filter employees

## Folder Structure for Components

Each component is organized in its own folder following this structure:

```
Component/
├── Component.jsx      # Main component code
├── Component.test.jsx # Tests
└── index.js           # Export file
```

## Customization

The UI can be customized by modifying the Tailwind configuration in `tailwind.config.js`.

## License

MIT