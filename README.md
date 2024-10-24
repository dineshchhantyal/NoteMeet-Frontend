# NextAuth.js v5 Template

This project was created to learn and implement **Auth.js v5** (formerly NextAuth.js) for authentication in a Next.js app. The learning process followed a highly detailed tutorial by [Code With Antonio](https://www.codewithantonio.com/projects/auth-masterclass) (Antonio Erdeljac) from GitHub - [AntonioErdeljac](https://github.com/AntonioErdeljac).

## Project Overview

This template demonstrates how to integrate Auth.js v5 into a Next.js application using the App Router. The project includes multiple authentication providers, such as GitHub, Google, and custom credentials.

## Features

- **Authentication Providers**:
  - Credentials
  - OAuth (Google & GitHub)
- **Two-Factor Authentication (2FA)**
- **Email Verification** using [Resend](https://resend.com/) for sending mails
- **Protected Routes**: Restrict access to specific parts of the app to authenticated users
- **User Session Management**: Efficient session handling to manage user login states
- **PostgreSQL Integration** with **Prisma ORM**

## Technologies Used

- **Next.js** (App Router)
- **Auth.js v5**
- **PostgreSQL** (with Prisma ORM)
- **Resend** (for email services)
- **TypeScript**
- **Tailwind CSS** (for styling)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/valik3201/next-auth-template
   cd next-auth-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables for authentication providers and database connection:

   - GitHub OAuth
   - Google OAuth
   - PostgreSQL connection string
   - Resend API key for email services

4. Run Prisma migration:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Credits

This project was developed by following [Code With Antonio](https://www.codewithantonio.com/projects/auth-masterclass)'s excellent tutorial.
