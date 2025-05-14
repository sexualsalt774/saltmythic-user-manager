require('dotenv').config()
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT;

// MongoDB URI and Database Configuration
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));  // Serve the HTML UI

// MongoDB Client
const client = new MongoClient(uri);

// API to get all users
app.get('/api/users', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();  // Fetch all users

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// API to get all roles
app.get('/api/roles', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const rolesCollection = db.collection('roles');
        const roles = await rolesCollection.find({}).toArray();  // Fetch all roles

        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// API to update user group with multiple roles
app.post('/api/update-groups', async (req, res) => {
    const { username, newGroups } = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { name: username },
            { $set: { groups: newGroups } }  // Replaces the entire groups array
        );

        if (result.matchedCount === 1) {
            res.json({ message: `Groups updated for ${username}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user groups:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});