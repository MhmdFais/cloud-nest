# Cloud Nest

This project is a web-based file storage service, similar to Google Drive, allowing users to upload, organize, manage, and share their files securely. The project supports features like user authentication, dynamic folder/file management, and secure file delivery using Supabase and Prisma.

# Screenshots

# Features

1. Authentication

- User login/logout (with session management).
- Secured access to user-specific files and folders.

2. Files and Folder Management

- Users can create folders to organize their files.
- Upload files (with a size limit of 50MB).
- Delete files or folders.
- View files inside folders.
- Display file creation and modification times (e.g., "2 days ago").

3. Secure File Access

- Files are stored in Supabase and are accessed through signed URLs to ensure security.
- Files are available only for a temporary duration (1 hour) after the signed URL is generated.

# Technology Stack

1. Backend:

- Node.js with Express framework.
- Prisma ORM for database management.
- Supabase for file storage and signed URLs.
- Multer for handling file uploads.

2. Database:

- PostgreSQL (via Prisma).

3. Frontend:

- Rendered using templating engines like EJS (views rendered server-side).

# Installation and Setup

## Prerequisites

- Node.js: Ensure you have Node.js installed on your system.
- Supabase: Create a Supabase account and set up a bucket for file storage.
- PostgreSQL: Set up a PostgreSQL database.

## Steps

1. Clone the Repository:

```
git clone https://github.com/MhmdFais/cloud-nest
```

2. Navigate to the project directory:

```
cd cloud-nest
```

3. Install dependencies:

```
npm install
```

4. Set Up Environment Variables:
   Create a .env file in the root directory and configure the following environment variables:

```
DATABASE_URL=your_postgres_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
```

5. Database Setup:
   Run the Prisma migrations to create the necessary tables in your database

```
npx prisma migrate dev
```

6. Run the Application:
   Start the application locally

```
npm run dev
```

7. Access the Application: Open your browser and navigate to http://localhost:3000.

# Key Modules and Routes

1. Home Controller (controllers/home.ts)

- home(): Renders the dashboard view, listing all folders and files for the authenticated user.
- addFolder(): Allows users to create new folders.
- addFile(): Handles file uploads and saves metadata to the database.
- deleteFile(): Removes a specific file from the user's directory.
- deleteFolder(): Deletes an entire folder and its contents.
- folderView(): Displays files inside a specific folder.
- serveFiles(): Fetches files securely using a signed URL generated from Supabase.

2. Authentication (controllers/login.ts)

- isAuthenticated(): Middleware to ensure users are authenticated before accessing any resource.
- logOut(): Handles user logout.

3. Routes

- GET /: Renders the home page with the user's folders and files.
- POST /add-folder: Adds a new folder.
- POST /upload-file: Uploads a new file to the root directory.
- POST /delete-file/:id/:name: Deletes a specific file.
- POST /delete-folder/:id: Deletes a specific folder.
- GET /:folderId: Renders the contents of a specific folder.
- POST /:id/upload-file: Uploads a file to a specific folder.
- GET /:fileId/:name: Serves a file securely using a signed URL

# Security Considerations

- Authentication: Only logged-in users can access, upload, or delete files.
- File Serving: Files are served using Supabase signed URLs, ensuring that files are only accessible to authorized users for a limited time.
- File Upload Limits: The maximum file size is restricted to 50MB to prevent abuse.

# Contributions

Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request.

# License

This project is licensed under the MIT License.
