# GitHub Repository Analyzer

A modern, professional web application for analyzing GitHub repositories with comprehensive insights into code quality, contributors, security, and more.

## ✨ Features

### 🔍 **Repository Analysis**

- **Repository Overview**: Basic stats, language breakdown, topics, and metadata
- **Real-time Analysis**: Enter any public GitHub repository URL for instant analysis
- **Beautiful UI**: Clean, modern interface with smooth animations

### 📊 **Comprehensive Dashboard**

- **Activity Metrics**: Commit trends, contributor statistics, and growth metrics
- **Visual Charts**: Interactive charts showing repository activity and trends
- **Real-time Updates**: Live data visualization with beautiful animations

### 👥 **Contributors Analysis**

- **Team Insights**: Detailed contributor profiles and activity patterns
- **Contribution Metrics**: Commits, additions, deletions, and active periods
- **Activity Visualization**: Weekly and monthly activity charts
- **Contributor Rankings**: Badge system for different contribution levels

### 🔧 **Codebase Analysis**

- **File Structure**: Interactive file tree with size and complexity metrics
- **Code Quality**: Complexity analysis and technical debt assessment
- **Language Breakdown**: Detailed language distribution with visual charts
- **Quality Hotspots**: Identification of files needing attention

### 🔒 **Security Analysis**

- **Security Score**: Overall security rating with detailed breakdown
- **Vulnerability Detection**: Identification of security issues with severity levels
- **Dependency Security**: Analysis of dependencies and their security status
- **Security Trends**: Historical security metrics and improvement tracking

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd RepoAnalyzer/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout/          # Layout components (Header, Layout)
│   │   ├── Cards/           # Card components (RepoCard, StatsCard)
│   │   └── Charts/          # Chart components (LanguageChart, ActivityChart)
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Main analyzer page
│   │   ├── Dashboard.jsx    # Repository dashboard
│   │   ├── Contributors.jsx # Contributors analysis
│   │   ├── Codebase.jsx     # Codebase analysis
│   │   └── Security.jsx     # Security analysis
│   ├── assets/              # Static assets
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles (Tailwind imports)
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with subtle animations
- **Responsive**: Fully responsive design that works on all devices
- **Dark Mode Ready**: Built with design system that supports dark mode
- **Accessibility**: Proper semantic HTML and accessibility features
- **Performance**: Optimized bundle size and fast loading times

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Future Enhancements

- **Backend Integration**: Connect to GitHub API for real data
- **Authentication**: GitHub OAuth integration
- **Export Features**: PDF reports and data export
- **Advanced Analytics**: ML-powered insights and predictions
- **Collaboration**: Team analysis and comparison features
- **Real-time Updates**: WebSocket integration for live updates

## 📝 Usage

1. **Enter Repository URL**: Paste any public GitHub repository URL in the search bar
2. **Analyze**: Click the "Analyze" button to start the analysis
3. **Explore**: Navigate through different sections using the top navigation
4. **Insights**: Review detailed insights in Dashboard, Contributors, Codebase, and Security sections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- GitHub API for repository data
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All the open-source libraries that make this project possible
