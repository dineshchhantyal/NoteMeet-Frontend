# NoteMeet: Next.js Frontend & Backend

NoteMeet is a dynamic web application built with Next.js that seamlessly integrates note-taking and meeting collaboration features. Designed to enhance productivity, it allows users to create, organize, and share notes effortlessly while collaborating with team members in real-time. With a user-friendly interface, NoteMeet provides a smooth experience for managing meeting agendas, taking meeting notes, and tracking action items. The app allows for easy sharing of notes with team members, making collaboration simple and efficient. Users can organize their notes with tags, categories, and search functionalities, ensuring quick access to important information. Additionally, real-time syncing ensures that all team members have up-to-date information. The app is optimized for performance, leveraging Next.js’s server-side rendering capabilities to provide a fast, responsive experience. NoteMeet aims to improve team collaboration, streamline workflows, and ensure that important meeting details are captured and accessible for all team members.

## Project Overview

This repo contains the backend and frontend code for NoteMeet. The main responsibilities of the backend are to handle user authentication, manage user sessions, and interact with the database. The frontend is responsible for rendering the user interface, handling user interactions, and communicating with the backend API. The backend is built with Next.js, Auth.js, and Prisma ORM, while the frontend is built with React and Tailwind CSS. The backend provides authentication features such as login, registration, password reset, and two-factor authentication. It also includes email verification using the Resend API. The frontend provides a user-friendly interface for users to interact with the app, create notes, manage meetings, and collaborate with team members. The app is designed to be responsive and accessible, providing a seamless experience across devices.

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
