// Script to test login functionality
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testLogin() {
    try {
        console.log('Testing login with admin credentials...');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('');

        const response = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });

        if (response.data.token) {
            console.log('✅ Login successful!');
            console.log('Token received:', response.data.token.substring(0, 20) + '...');
            console.log('User:', response.data.user);
            return true;
        }
    } catch (error) {
        if (error.response) {
            console.log('❌ Login failed:', error.response.data.error || error.response.data.message);
        } else if (error.code === 'ECONNREFUSED') {
            console.log('❌ Cannot connect to server. Make sure backend is running on port 3001!');
        } else {
            console.log('❌ Error:', error.message);
        }
        return false;
    }
}

testLogin();
