# Gemini AI Chat - Google Hackathon Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A stylish, theme-aware chatbot built with Google's Gemini AI, Next.js, and Tailwind CSS. Designed for a Google Hackathon presentation to showcase the capabilities of Gemini AI.**

This project demonstrates a simple yet powerful chat application that interacts with the Gemini AI model. It features a clean, Google-inspired user interface with support for both light and dark themes, and is configured to act as a friendly, informal chat companion.

## ✨ Features

- **Gemini AI Integration**: Leverages the `gemini-2.0-flash` model via the `@google/generative-ai` SDK for intelligent chat responses.
- **Customizable System Prompt**: Easily define the chatbot's personality and behavior through a system instruction.
- **Google-Inspired UI**: Modern and clean interface styled with Tailwind CSS, using Google's color palette and fonts (Roboto, Google Sans).
- **Light/Dark Mode Toggle**: Users can switch between light, dark, or system-preferred themes using `next-themes`.
- **Responsive Design**: The chat interface is designed to work well on various screen sizes.
- **Real-time Chat**: Messages are displayed dynamically as the conversation progresses.
- **Loading & Error States**: Clear visual feedback for when the AI is typing or if an error occurs.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v14+ with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **UI Components**: React Server Components & Client Components
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18, v20)
- [pnpm](https://pnpm.io/installation)
- A Google Gemini API Key (see [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation & Setup

1.  **Clone the repository (or download the source code):**
    ```bash
    git clone https://github.com/byigitt/google-hackathon-presentation-demo.git
    cd google-hackathon-presentation-demo
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    npm install # if you don't have pnpm installed
    ```

3.  **Set up your Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Gemini API key:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    Replace `YOUR_API_KEY_HERE` with your actual Gemini API key.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📁 Project Structure

Here's a brief overview of the key files and directories:

```
google-hackathon-presentation-demo/
├── public/                     # Static assets (e.g., favicon.ico)
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── components/         # Reusable UI components (e.g., ThemeToggleButton.tsx)
│   │   ├── services/           # Client-side providers (e.g., ThemeProvider)
│   │   ├── globals.css         # Global styles and CSS variables for theming
│   │   ├── layout.tsx          # Root layout for the application
│   │   ├── page.tsx            # Main chat page component and logic
│   │   └── providers.tsx       # Theme provider setup
│   └── ...
├── .env.local                  # Environment variables (API Key - Gitignored)
├── .gitignore                  # Files and folders to be ignored by Git
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── pnpm-lock.yaml              # Exact versions of dependencies
├── tailwind.config.js          # Tailwind CSS configuration (ensure darkMode: 'class')
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file!
```

## ⚙️ How It Works

### Gemini AI Chat Logic (`src/app/page.tsx`)
- The page maintains state for user input, chat history, loading status, and errors.
- When a user submits a message:
    1.  The message is added to the chat history.
    2.  An API call is made to the Gemini model using `model.startChat()` and `chat.sendMessage()`.
    3.  The `systemInstruction` (defined in `page.tsx`) guides the AI's persona.
    4.  The AI's response is then added to the chat history and displayed.

### Theme Switching (`src/app/components/ThemeToggleButton.tsx`, `src/app/services/providers.tsx`, `src/app/globals.css`)
- `next-themes` is used to manage theme state.
- The `Providers` component wraps the application in `layout.tsx` to enable theme context.
- `ThemeToggleButton` allows users to cycle through 'light', 'dark', and 'system' themes.
- `globals.css` defines CSS variables for both light (`:root`) and dark (`html.dark`) themes.
- Tailwind CSS is configured with `darkMode: 'class'` in `tailwind.config.js` to apply dark theme styles when the `html` tag has the `dark` class.

## 🎨 Customization

### Chatbot Behavior
- Modify the `systemInstruction` object in `src/app/page.tsx` to change the chatbot's personality, tone, and instructions.
  ```typescript
  const systemInstruction = {
    role: "system",
    parts: [{ text: "You are a helpful assistant that loves to talk about coding." }],
  };
  ```

### Styling and Theming
- **Colors & Fonts**: Adjust the CSS variables in `src/app/globals.css` for both light (`:root`) and dark (`html.dark`) themes to change the color palette.
- **Tailwind Classes**: Utilize Tailwind CSS utility classes directly in your components for fine-grained styling control.
- **Google-Inspired Components**: The `.google-button` and `.google-input` classes in `globals.css` provide base styles for common UI elements.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying to other platforms.

## 🤝 Contributing

This is a demo project for a hackathon. Contributions are welcome if you have ideas for improvement!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information (though a LICENSE file was not explicitly created in this setup, MIT is a common choice for such projects).

## 🙏 Acknowledgements

- Google for the powerful Gemini AI.
- Vercel for Next.js and an excellent developer experience.
- The creators of `next-themes` and Tailwind CSS.

---