# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your Hamba Village Union Management application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Once you've created an account, log in to the MongoDB Atlas dashboard.

## Step 2: Create a New Cluster

1. Click on "Build a Database" on the Atlas dashboard.
2. Choose the "FREE" option (M0 Sandbox).
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure) and region closest to your users.
4. Click "Create Cluster" - it may take a few minutes to provision.

## Step 3: Set Up Database Access

1. In the left sidebar, click on "Database Access" under SECURITY.
2. Click the "Add New Database User" button.
3. Create a new username and password. **Make sure to remember these credentials!**
4. Under "Database User Privileges," choose "Atlas admin" for simplicity.
5. Click "Add User" to create the database user.

## Step 4: Configure Network Access

1. In the left sidebar, click on "Network Access" under SECURITY.
2. Click the "Add IP Address" button.
3. For development, you can click "Allow Access from Anywhere" (this adds 0.0.0.0/0).
   - For production, you should restrict access to specific IP addresses.
4. Click "Confirm" to save your changes.

## Step 5: Get Your Connection String

1. Go back to the "Database" section in the left sidebar.
2. Click on "Connect" for your cluster.
3. Choose "Connect your application."
4. Make sure the driver is set to "Node.js" and the version is appropriate.
5. Copy the provided connection string. It will look something like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.<id>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the credentials you created earlier.

## Step 6: Configure Your Application

1. Create a `.env` file in the root of your project (if it doesn't exist already).
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.<id>.mongodb.net/hamba?retryWrites=true&w=majority
   ```
   - Note: We added `/hamba` to the connection string to specify the database name.
3. Make sure to add `.env` to your `.gitignore` to keep your credentials secure.

## Step 7: Testing the Connection

1. Run your server with `npm run dev:server`.
2. If the connection is successful, you should see `✅ MongoDB Atlas Connected Successfully` in your console.

## Troubleshooting

- **Authentication failed**: Double-check your username and password.
- **Network issues**: Make sure your IP address is in the allowed list in Network Access.
- **Connection timeout**: Check your internet connection or try a different region for your cluster.

## Next Steps

- Consider setting up database indexes for better performance.
- Implement regular backups of your data.
- Monitor your database usage through the MongoDB Atlas dashboard.

Remember to never commit your actual MongoDB credentials to your repository! 