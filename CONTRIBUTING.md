# 🤝 Contributing to HireMeAI

Thank you for considering contributing to HireMeAI! We're excited to welcome you to our community. 🎉

## 📑 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Process](#-development-process)
- [Pull Request Process](#-pull-request-process)
- [Style Guidelines](#-style-guidelines)
- [Community](#-community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to roland.vrignon@gmail.com.

## 🚀 Getting Started

1. Fork the repository

2. Clone your fork:
```bash
git clone https://github.com/your-username/HireMeAI.git
```
3. Add the upstream remote:
```bash
git remote add upstream https://github.com/RolandVrignon/HireMeAI.git
```
4. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## 💻 Development Process

1. Install dependencies:
```bash
pnpm install
```

2. Create your `.env.local` file based on `.env.example` with required variables:
```bash
# Required
MISTRAL_API_KEY="your-mistral-api-key"
NEXT_PUBLIC_ASSISTANT_NAME="YourGPT"
NEXT_PUBLIC_USER_NAME="Your Name"

# Optional
EMAIL_USER="your.email@gmail.com"
EMAIL_APP_PASSWORD="your-gmail-app-password"
NEXT_PUBLIC_WHATSAPP_NUMBER="your-number"
```

3. Run the development server:
```bash
pnpm run dev
```

## 📝 Pull Request Process

1. Update documentation if needed
2. Ensure your code follows our style guidelines
3. Make sure all tests pass
4. Create a pull request with a clear title and description

### PR Title Format
- `✨ feat: Add new feature`
- `🐛 fix: Fix bug in component`
- `📝 docs: Update documentation`
- `💄 style: Format code`
- `♻️ refactor: Refactor component`
- `✅ test: Add tests`

## 🎨 Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` when possible

### React
- Use functional components with hooks
- Follow React Server Components patterns
- Maintain proper component structure

### CSS
- Use Tailwind CSS classes
- Follow mobile-first approach
- Support both light and dark themes

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

## 👥 Community

### Where to Get Help
- 🐛 **Bug Reports**: Create an issue
- ✨ **Feature Requests**: Use discussions
- 💬 **Questions**: Start a discussion
- 📝 **Documentation**: Open a PR

### Issue Labels
- `🐛 bug`: Something isn't working
- `✨ enhancement`: New feature request
- `📝 documentation`: Docs improvements
- `👋 good first issue`: Good for newcomers
- `🆘 help wanted`: Extra attention needed

Thank you for making HireMeAI better! 🙏 