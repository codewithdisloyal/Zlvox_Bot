/**
 * Collection of top AI tools by category.
 * Scalable structure: easily add new categories or tools to the arrays.
 */
const aiTools = [
  {
    category: "✍️ AI Writing Tools",
    tools: [
      { name: "ChatGPT", description: "The industry standard for general writing and brainstorming." },
      { name: "Claude", description: "Excellent for long-form content, nuances, and coding." },
      { name: "Copy.ai", description: "Optimized for marketing copy and social media posts." }
    ]
  },
  {
    category: "🎨 AI Design Tools",
    tools: [
      { name: "Midjourney", description: "Highest quality AI image generation available." },
      { name: "Canva AI", description: "Easy-to-use design tools with integrated Magic Studio." },
      { name: "Figma AI", description: "Automates UI/UX design tasks within Figma." }
    ]
  },
  {
    category: "💻 AI Coding Tools",
    tools: [
      { name: "GitHub Copilot", description: "The most popular AI pair programmer in your IDE." },
      { name: "Cursor", description: "An AI-first code editor designed for maximum productivity." },
      { name: "Groq", description: "Ultra-fast inference engine for running open-source LLMs." }
    ]
  }
];

module.exports = aiTools;
