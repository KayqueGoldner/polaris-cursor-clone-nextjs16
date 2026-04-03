# Polaris — AI Code Editor

> A modern AI-powered code editor inspired by Cursor, built with Next.js 16, React 19, and a powerful real-time tech stack. Create projects, edit code, chat with AI, and preview your apps — all from the browser.

![Application Screenshot](/polaris-landing-page.png "Polaris Landing Page")
![Application Screenshot](/polaris-code-editor.png "Polaris Code Editor")
![Application Screenshot](/polaris-preview-tab.png "Polaris Preview Tab")

## 🚀 Features

- **Modern Stack**: Built with Next.js 16 and React 19
- **Authentication**: Secure auth system powered by Clerk (OAuth support)
- **AI Chat**: Conversational AI assistant with support for Google Gemini and Anthropic Claude
- **Code Editor**: Full-featured code editor with CodeMirror 6 (syntax highlighting, minimap, indentation markers)
- **Multi-Language Support**: Syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, Python, and Markdown
- **WebContainer Preview**: In-browser app preview with integrated terminal via WebContainers
- **File Management**: Project file tree with folder/file CRUD operations
- **GitHub Integration**: Import from and export to GitHub repositories via Octokit
- **Real-time Database**: Powered by Convex for real-time data sync
- **AI Agent Kit**: Inngest Agent Kit for background AI-driven workflows
- **Web Scraping**: Firecrawl integration for URL context in AI prompts
- **Modern UI**: Built with Radix UI, shadcn/ui components, and TailwindCSS v4
- **Resizable Panels**: Split-pane editor layout with allotment
- **Streaming Markdown**: Real-time AI response rendering with Streamdown
- **Dark Mode**: Built-in theme support via next-themes
- **Charts & Analytics**: Recharts for data visualization
- **Form Handling**: Robust forms with react-hook-form, TanStack Form, and Zod validation
- **Error Monitoring**: Sentry integration for error tracking
- **Animations**: Smooth UI transitions with Motion (Framer Motion)
- **Rive Animations**: Interactive animations with Rive WebGL2

## 🛠️ Tech Stack

- **Framework**: Next.js 16, React 19
- **Styling**: TailwindCSS v4, CVA, tailwind-merge
- **UI Components**: Radix UI, shadcn/ui, Lucide Icons, React Icons, cmdk
- **Database**: Convex (real-time backend)
- **Authentication**: Clerk
- **Code Editor**: CodeMirror 6 (with Replit extensions)
- **Forms**: react-hook-form, TanStack Form, Zod
- **AI SDK**: Vercel AI SDK (ai), @ai-sdk/google, @ai-sdk/anthropic
- **AI Agent**: Inngest Agent Kit
- **WebContainers**: @webcontainer/api
- **Terminal**: xterm.js
- **GitHub**: Octokit
- **Web Scraping**: Firecrawl
- **Streaming**: Streamdown
- **Animations**: Motion, Rive
- **State Management**: Zustand
- **Charts**: Recharts
- **Error Tracking**: Sentry
- **Development**: TypeScript, ESLint, Prettier

## 📂 Project Structure

```
src/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes
│   │   ├── github/             # GitHub import/export endpoints
│   │   ├── inngest/            # Inngest webhook handler
│   │   ├── messages/           # AI chat message endpoints
│   │   ├── projects/           # Project management endpoints
│   │   ├── quick-edit/         # Quick edit endpoints
│   │   └── suggestion/         # AI suggestion endpoints
│   └── projects/
│       └── [projectId]/        # Project editor page
├── components/                 # Reusable components
│   ├── ai-elements/            # AI chat UI components (48+ components)
│   └── ui/                     # shadcn/ui component library
├── features/                   # Feature modules
│   ├── auth/                   # Authentication (Clerk)
│   ├── conversations/          # AI conversation sidebar & history
│   ├── editor/                 # Code editor (CodeMirror)
│   ├── preview/                # WebContainer preview & terminal
│   └── projects/               # Project management
├── hooks/                      # Custom React hooks
├── inngest/                    # Inngest client & functions
└── lib/                        # Utility functions
convex/                         # Convex backend
├── schema.ts                   # Database schema (projects, files, conversations, messages)
├── projects.ts                 # Project mutations/queries
├── files.ts                    # File mutations/queries
├── conversations.ts            # Conversation mutations/queries
├── system.ts                   # System-level operations
└── auth.ts                     # Auth configuration
public/                         # Static assets
```

## ⚡ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/KayqueGoldner/polaris-cursor-clone-nextjs16.git
   cd polaris-cursor-clone-nextjs16
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your configuration (see Environment Variables section below)

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔐 Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Anthropic AI
ANTHROPIC_API_KEY=

# Firecrawl
FIRECRAWL_API_KEY=

# Sentry
SENTRY_AUTH_TOKEN=
```

## 📜 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
