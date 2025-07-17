// Script de prueba para verificar las APIs
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

// Función para hacer una solicitud POST
async function makeRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, options);
        const result = await response.json();
        console.log(`${method} ${url}:`, response.status, result);
        return result;
    } catch (error) {
        console.error(`Error en ${method} ${url}:`, error.message);
        return null;
    }
}

async function testAPIs() {
    console.log('=== Probando APIs ===');
    
    // Probar API de libros
    console.log('\n1. Probando API de libros:');
    await makeRequest('/api/book', 'GET');
    
    // Probar API de usuarios
    console.log('\n2. Probando API de usuarios:');
    await makeRequest('/api/users', 'GET');
    
    // Probar creación de libro (necesita sesión)
    console.log('\n3. Probando creación de libro:');
    await makeRequest('/api/book', 'POST', {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        genre: 'Test',
        publicationYear: 2023,
        totalCopies: 1,
        availableCopies: 1,
        description: 'Test description',
        coverImageUrl: 'https://example.com/cover.jpg',
        createdById: 'test-user-id'
    });
    
    // Probar creación de usuario
    console.log('\n4. Probando creación de usuario:');
    await makeRequest('/api/users', 'POST', {
        name: 'Test User',
        email: 'test@example.com'
    });
    
    console.log('\n=== Fin de pruebas ===');
}

testAPIs();
