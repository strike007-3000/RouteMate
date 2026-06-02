# Security Policy

## Supported Versions

We actively support the latest version of routemate.top.

| Version | Supported          |
| ------- | ------------------ |
| 3.16.x  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within routemate.top, please do not disclose it publicly. We want to keep traveler data safe.

1. **Email us**: Send a detailed report to hello@routemate.top.
2. **Details**: Include the nature of the vulnerability, steps to reproduce, and possible impact.
3. **Response**: We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Our Approach to Secrets

routemate.top uses a **Hybrid Secret Management** system:
- **Server-side**: API keys are stored in environment variables (Vercel).
- **Client-side**: Users can input their own keys in the **Settings** UI, which are stored in the browser's `localStorage`.

**Warning**: Never hardcode API keys directly into the source code or commit them to the repository.
