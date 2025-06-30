# JSON Viewer

A beautiful, modern JSON file viewer built with Next.js that makes reading and editing JSON files easy and enjoyable. Features markdown support for content within JSON strings.

## Features

### 🎯 Core Features
- **File Upload**: Drag and drop or click to upload JSON files
- **Beautiful Viewer**: Syntax-highlighted JSON with collapsible sections
- **Markdown Support**: Automatically renders markdown content within JSON strings
- **Edit Mode**: Full JSON editor with real-time validation
- **Download**: Save your edited JSON files
- **Copy to Clipboard**: Copy any JSON section with one click

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Automatically adapts to your system preferences
- **Collapsible Sections**: Expand/collapse JSON objects and arrays
- **Line Numbers**: Editor shows line numbers for easy navigation
- **Real-time Validation**: JSON validation as you type in edit mode

### 🔧 Technical Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling
- **React Markdown**: Renders markdown with GitHub Flavored Markdown support
- **Lucide Icons**: Beautiful, consistent iconography

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Uploading JSON Files
1. Click the upload area or drag and drop a JSON file
2. The file will be automatically parsed and displayed
3. If the file contains markdown content, it will be rendered beautifully

### Viewing JSON
- **Expand/Collapse**: Click the chevron icons to expand or collapse sections
- **Copy Sections**: Click the copy icon next to expanded sections
- **Markdown Content**: Any string containing markdown syntax will be rendered as formatted content

### Editing JSON
1. Click the "Edit" button to enter edit mode
2. Make your changes in the text editor
3. Use the "Format" button to automatically format your JSON
4. Click "Save" to apply your changes
5. Click "View" to return to the viewer

### Downloading
- Click the "Download" button to save your JSON file
- The file will be downloaded with the original filename or as "data.json"

## Markdown Support

The viewer automatically detects and renders markdown content within JSON strings. Supported features include:

- **Headers**: `# ## ###`
- **Bold/Italic**: `**bold**` `*italic*`
- **Code**: `` `inline code` ``
- **Code Blocks**: ``` ``` ```
- **Lists**: `- item` `1. item`
- **Links**: `[text](url)`
- **Tables**: GitHub Flavored Markdown tables
- **Blockquotes**: `> quote`

## Example JSON with Markdown

```json
{
  "title": "Sample Document",
  "description": "This is a **bold** description with *italic* text",
  "content": "# Main Heading\n\nThis is a paragraph with `inline code`.\n\n## Subheading\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log('Hello World');\n```",
  "metadata": {
    "author": "John Doe",
    "tags": ["json", "markdown", "viewer"]
  }
}
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **React Markdown**: Markdown rendering
- **Remark GFM**: GitHub Flavored Markdown support
- **Lucide React**: Beautiful icons

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 