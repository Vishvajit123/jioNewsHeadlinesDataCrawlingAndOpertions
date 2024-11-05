This project is a Node.js-based backend for managing and retrieving news headlines with user interactions. It integrates MongoDB for storing headlines and user data, and Redis for caching and optimizing data retrieval. The backend allows efficient fetching, pagination, and storage of news headlines, along with features for user registration, viewing tracking, and caching headlines.

Key Features
MongoDB Integration: Stores news headlines and user details in MongoDB with structured schemas, utilizing TTL indexes and efficient MongoDB queries.
Redis Caching: Caches headlines in Redis to speed up retrieval, reduce MongoDB load, and handle sorted sets for tracking viewed headlines.
Headline Retrieval with Pagination: Fetches headlines from an external API, caches them in Redis by page, and updates MongoDB as needed to avoid duplicate entries.
User and View Tracking: Manages user creation and fetches user details, tracking views by user with Redis sets and MongoDB for persistence.
Redis Queueing for Viewed News: Implements Redis-based sorted sets to push viewed headlines to the back of the queue, enhancing user experience similar to social media status updates.
Folder Structure
config/ - MongoDB and Redis configurations.
controllers/ - Contains core logic for handling headline retrieval, user management, and view tracking.
models/ - Mongoose schemas for MongoDB collections, including User, Headline, and View.
services/ - Service layer for API integration and additional Redis operations.

Requirements
Node.js
MongoDB
Redis
Usage

Start MongoDB and Redis on your local machine.
Run the server:   npm start

Access the API endpoints for user and headline management with the provided routes.
This backend is well-suited for applications requiring scalable news/headline storage, caching for high-speed data access, and user-specific interactions with media content.
