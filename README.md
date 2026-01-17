# Your Search Wrapped 🔍

A privacy-first web application that analyzes your Google search history and provides insightful visualizations about your browsing patterns.

![Homepage Screenshot](https://github.com/user-attachments/assets/fc031185-fe50-4f1a-9027-d216b231e98f)

## Features

- 📊 **Comprehensive Analytics**: Get detailed insights about your search behavior
  - Total searches and unique queries
  - Top searched terms
  - Search category breakdown
  - Time-based activity patterns (hourly and daily)
  - Recent search history

- 🔒 **Privacy First**: All analysis happens locally in your browser - your data never leaves your device

- 🎨 **Beautiful Visualizations**: Interactive charts and statistics with a modern, responsive design

- 📁 **Multiple Format Support**: Supports JSON, CSV, TXT, and HTML browser history exports

## How to Use

1. **Export your browser history**:
   - **Chrome/Edge**: Go to `chrome://history` → Click three dots menu → Export history (or use Google Takeout)
   - **Firefox**: Open Library → History → Show All History → Import and Backup → Export

2. **Upload your file**: Drag and drop your history file or click to select it

3. **Explore your insights**: View comprehensive analytics about your search patterns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/veonlok/Your-Search-Wrapped.git

# Navigate to the project directory
cd Your-Search-Wrapped

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Deployment**: Vercel (or any Node.js hosting)

## Project Structure

```
Your-Search-Wrapped/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FileUpload.tsx    # File upload interface
│   └── SearchAnalytics.tsx # Analytics dashboard
├── lib/                   # Utility functions
│   ├── parser.ts         # History file parser
│   └── types.ts          # TypeScript type definitions
└── public/               # Static assets
```

## Privacy & Security

- ✅ All data processing happens client-side in your browser
- ✅ No server uploads or external API calls with your data
- ✅ No tracking or analytics on user data
- ✅ Open source - you can verify the code yourself

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
