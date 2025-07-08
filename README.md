# JSON Viewer

A beautiful, modern JSON viewer with markdown support, dark mode, and advanced features built with Next.js 14, React, and TypeScript.

## ✨ Features

### Core Features
- **JSON File Upload**: Drag & drop or click to upload JSON files
- **Interactive JSON Viewer**: Expandable/collapsible tree view with syntax highlighting
- **JSON Editor**: In-place editing with real-time validation
- **Markdown Support**: Renders markdown content within JSON strings
- **Download JSON**: Export edited JSON files

### Advanced Features
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📊 JSON Statistics**: View detailed statistics about your JSON structure
- **🔍 Search & Filter**: Search through JSON content (coming soon)
- **⌨️ Keyboard Shortcuts**: Quick access to common actions
- **📋 Copy to Clipboard**: Copy individual JSON nodes
- **🎨 Syntax Highlighting**: Beautiful color-coded JSON display
- **📱 Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
gh repo clone devbm7/json-viewer
cd json-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Usage

### Uploading JSON Files
1. Drag and drop a `.json` file onto the upload area, or click to browse
2. The file will be automatically parsed and displayed in the viewer

### Viewing JSON
- Click the chevron icons to expand/collapse objects and arrays
- Use the copy button to copy individual nodes
- Markdown content in strings will be rendered automatically

### Editing JSON
1. Click the "Edit" button to switch to edit mode
2. Make your changes in the text editor
3. Use the "Format" button to automatically format your JSON
4. Click "Save" to apply changes (only available when JSON is valid)

### Dark Mode
- Click the moon/sun icon in the top-right corner to toggle dark mode
- Your preference is automatically saved

### Keyboard Shortcuts
- `Ctrl + E` - Edit JSON
- `Ctrl + V` - View JSON
- `Ctrl + S` - Download JSON
- `Ctrl + K` - Clear JSON
- `Ctrl + /` - Toggle shortcuts panel

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the appearance by modifying:
- `app/globals.css` - Global styles and JSON syntax highlighting
- `tailwind.config.js` - Tailwind configuration

### Components
All components are located in `app/components/`:
- `FileUpload.tsx` - File upload interface
- `JSONViewer.tsx` - JSON tree viewer
- `JSONEditor.tsx` - JSON text editor
- `DarkModeToggle.tsx` - Dark mode toggle
- `JSONSearch.tsx` - Search functionality
- `JSONStats.tsx` - JSON statistics
- `KeyboardShortcuts.tsx` - Keyboard shortcuts panel

## 🔧 Technical Details

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Markdown**: React Markdown with remark-gfm
- **Syntax Highlighting**: Custom CSS classes

### Architecture
- **Client-side rendering** for interactive features
- **Component-based architecture** for maintainability
- **TypeScript** for type safety
- **Responsive design** with Tailwind CSS
- **Accessibility** considerations built-in

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [React Markdown](https://github.com/remarkjs/react-markdown) for markdown rendering

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub. 
