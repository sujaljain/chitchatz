# ChitChatz - A Realtime Chat Application

ChitChatz is a modern, feature-rich real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack. It supports direct messaging, group channels, file sharing, and more.

## Features

- **Authentication**: Secure login and signup with profile setup.
- **Direct Messaging**: Chat one-on-one with other users.
- **Group Channels**: Create and manage group chats.
- **File Sharing**: Upload and download files in chats.
- **Real-time Updates**: Powered by WebSockets for instant communication.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Profile Management**: Customize your profile with images and colors.
- **Light/Dark Mode Toggle**: Switch between light and dark themes for a personalized experience.
- **Welcome Animation**: A visually appealing welcome screen using Lottie animations.

## Unique Selling Points

- **Light/Dark Mode**: A simple yet impactful feature that enhances user experience by allowing theme customization.
- **Welcome Animation**: A polished and professional touch to the app, making it visually engaging for users.
- **Profile Customization**: Users can set dynamic avatars and profile colors, showcasing creativity and personalization.

These features are designed to make the app stand out while keeping the implementation simple and efficient.

## Tech Stack

### Frontend

- **React**: For building the user interface.
- **Tailwind CSS**: For styling.
- **ShadCn UI (Based On Radix UI)**: For accessible components.
- **Vite**: For fast development and build.

### Backend

- **Node.js**: For server-side logic.
- **Express**: For building RESTful APIs.
- **MongoDB**: For database storage.
- **Socket.IO**: For real-time communication.

## API Endpoints

### Authentication

- `POST /api/auth/login`: Login a user.
- `POST /api/auth/signup`: Register a new user.

### Contacts

- `GET /api/contacts/get-all-contacts`: Fetch all contacts.
- `POST /api/contacts/search`: Search for contacts.

### Channels

- `POST /api/channel/create-channel`: Create a new channel.
- `GET /api/channel/get-user-channels`: Fetch user channels.

### Messages

- `POST /api/messages/get-messages`: Fetch messages between two users.
- `POST /api/messages/upload-file`: Upload a file.

## Acknowledgments

- Made with ❤️ by Sujal Jain.
