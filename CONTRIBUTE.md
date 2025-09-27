# Contributing to Reviews Mini App

Thank you for your interest in contributing to the Reviews Mini App! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or bun
- Git
- Basic knowledge of React, Next.js, and Web3 development

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/reviews.git
   cd reviews
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   echo "NEXT_PUBLIC_HOST=http://localhost:3000" > .env.local
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Contribution Guidelines

### Code Style

- Follow existing code patterns and conventions
- Use TypeScript for all new code
- Add proper type definitions for functions and variables
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good examples
feat: add user profile page
fix: resolve smart contract interaction bug
docs: update API documentation
refactor: improve error handling

# Bad examples
fix stuff
update
changes
```

### Pull Request Process

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Your Changes**

   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation as needed

3. **Test Your Changes**

   ```bash
   npm run lint
   npm run build
   ```

4. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the provided PR template
   - Describe your changes clearly
   - Link any related issues
   - Request review from maintainers

## Development Areas

### Frontend Development

- **Location**: `app/frontend/`
- **Components**: Add reusable components in `app/frontend/components/`
- **Pages**: Create new pages in `app/frontend/pages/`
- **State**: Use Zustand store in `app/lib/store/`

### API Development

- **Location**: `app/api/`
- **New Endpoints**: Create new API routes under `app/api/<name>/route.ts`
- **Authentication**: Use existing session handling patterns
- **Error Handling**: Implement proper error responses

### Smart Contract Integration

- **Location**: `app/lib/constants/index.ts`
- **Contract Address**: Update if deploying new contract
- **ABI**: Update contract ABI when needed
- **Testing**: Test all contract interactions thoroughly

### Web3 Development

- **Providers**: Use existing Wagmi and Reown AppKit setup
- **Hooks**: Create custom hooks for blockchain interactions
- **Error Handling**: Handle network errors gracefully
- **Gas Optimization**: Consider gas costs for contract interactions

## Testing

### Manual Testing

- Test on different devices and browsers
- Verify Farcaster Mini App integration
- Test smart contract interactions on Base testnet
- Check mobile responsiveness

### Smart Contract Testing

- Test all contract functions
- Verify gas estimates
- Test error scenarios
- Validate data integrity

## Code Review Process

### For Contributors

- Respond to review feedback promptly
- Make requested changes
- Ask questions if feedback is unclear
- Keep PRs focused and manageable

### For Reviewers

- Provide constructive feedback
- Test the changes locally
- Check for security issues
- Verify code quality and style

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots if applicable

### Feature Requests

For new features, provide:

- Clear description of the feature
- Use case and benefits
- Implementation suggestions if you have them
- Mockups or examples if applicable

## Development Tips

### Smart Contract Development

- Always test on testnet first
- Use proper error handling for contract calls
- Consider gas costs for users
- Implement proper loading states

### Farcaster Integration

- Test in Farcaster mobile app
- Ensure proper Mini App SDK usage
- Handle authentication flows correctly
- Test on different devices

### Performance

- Optimize bundle size
- Use proper React patterns (memo, useMemo, useCallback)
- Implement proper loading states
- Consider mobile performance

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Wagmi Documentation](https://wagmi.sh)
- [Farcaster Mini Apps](https://docs.farcaster.xyz/miniapps)
- [Base Documentation](https://docs.base.org)

## Questions?

- Open an issue for questions
- Join our community discussions
- Check existing issues and PRs for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
