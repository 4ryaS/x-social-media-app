# Social Media Application

A modern social media platform built with a focus on performance, scalability, and ease of use. The application allows users to authenticate, post content, follow others, and upload media. 

## Technologies Used

- **Backend**: 
  - **Node.js**: A JavaScript runtime to handle backend logic.
  - **GraphQL**: A flexible and efficient API for querying and mutating data.
  - **Prisma ORM**: A type-safe and easy-to-use database ORM for interacting with PostgreSQL.
  - **PostgreSQL**: A powerful relational database for storing user data and content.
  - **Redis**: Used for caching GraphQL queries to increase speed and reduce server load.
  - **Google OAuth**: For user authentication via Google login.
  - **JSON Web Tokens (JWT)**: For securing authentication and maintaining user sessions.
  
- **Frontend**: 
  - **Next.js**: A React-based framework for server-side rendering and optimized performance.
  - **TailwindCSS**: For styling with utility-first, reusable components.
  - **TypeScript**: Ensures code quality and type safety.
  - **Codegen**: Generates typesafe GraphQL queries and mutations.
  - **React Query**: Client-side data caching and query management.
  - **GraphQL-Request**: A minimal API client for communication between frontend and backend.

- **Cloud Services**: 
  - **Supabase**: Hosts and manages the PostgreSQL database.
  - **Amazon Web Services (AWS)**: Provides storage, deployments, and content delivery via CDN.

## Features

- **User Authentication**: Users can log in using their Google account via OAuth.
- **User Interaction**: Users can post content, like posts, repost posts, follow other users and engage with the community.
- **Media Upload**: Users can upload media to enrich their posts.
- **Post Caching**: Fast content retrieval through Redis caching to improve user experience.
  
