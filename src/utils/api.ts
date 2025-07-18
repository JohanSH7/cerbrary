const makePost = (
    url: string, 
    body: string, 
    method: 'POST' | 'PUT' | 'DELETE' | 'GET' = 'POST',
    options:{ headers?: Record<string, string>}) => {
    const headers = options.headers || {};
    return fetch(url, {
        body,
        method,
        headers
    }).then(async (response) => {
        if (response.status === 204) {
            return response;
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return responseData;
        } else {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        }
    }).catch((error) => {
        console.error("Error in API request:", error);
        throw error;
    });
};

const makeJsonPost = (
    url: string,
    data: unknown,
    method: 'POST' | 'PUT' | 'DELETE' | 'GET' = 'POST',
    options: { headers?: Record<string, string> } = {}
) => {
    const body = JSON.stringify(data);
    const headers =  options.headers || {};
    headers['Content-Type'] = 'application/json';
    
    console.log(`Making ${method} request to ${url}`, { data, headers });
    
    return makePost(url, body, method, { headers }).then(response => {
        console.log(`Response from ${method} ${url}:`, response);
        return response;
    }).catch(error => {
        console.error(`Error in ${method} ${url}:`, error);
        throw error;
    });
};

// =================== USUARIOS ===================
export const getUsers = async () => {
    try {
        const response = await fetch('/api/users', { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching users: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await fetch(`/api/users/${userId}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching user: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const createUser = async (userData: { name: string, email: string }) => {
    return makeJsonPost('/api/users', userData, 'POST');
};

export const updateUser = async (userId: string, updatedData: { name: string }) => {
    return makeJsonPost('/api/users', { id: userId, updatedName: updatedData.name }, 'PUT');
};

export const updateUserRole = async (userId: string, role: string) => {
    return makeJsonPost('/api/users', { id: userId, role }, 'PUT');
};

export const deleteUser = async (userId: string) => {
    return makeJsonPost('/api/users', { userId }, 'DELETE');
};

export const approveUser = async (userId: string) => {
    return makeJsonPost('/api/users', { id: userId, status: "APPROVED" }, 'PUT');
};

export const rejectUser = async (userId: string) => {
    return makeJsonPost('/api/users', { id: userId, status: "REJECTED" }, 'PUT');
};

export const toggleUserStatus = async (userId: string, enabled: boolean) => {
    return makeJsonPost('/api/users', { id: userId, enabled }, 'PUT');
};

export const updateUserStatus = async (userId: string, status: "PENDING" | "APPROVED" | "REJECTED") => {
    return makeJsonPost('/api/users', { id: userId, status }, 'PUT');
};

// =================== LIBROS ===================
export const getBooks = async () => {
    try {
        const response = await fetch('/api/book', { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching books: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const createBook = async (bookData: {
    title: string,
    author: string,
    isbn: string,
    genre: string,
    publicationYear: number,
    totalCopies: number,
    availableCopies: number,
    description: string,
    coverImageUrl: string,
    createdById: string
}) => {
    // Justo antes de crear el libro
    return makeJsonPost('/api/book', bookData, 'POST');
};

export const updateBook = async (bookId: string, updatedData: Record<string, unknown>) => {
    return makeJsonPost('/api/book', { id: bookId, updatedData }, 'PUT');
};

export const deleteBook = async (bookId: string) => {
    return makeJsonPost('/api/book', { bookId }, 'DELETE');
};

// Obtener un libro por ID
export const getBookById = async (bookId: string) => {
    try {
        const response = await fetch(`/api/book/${bookId}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching book: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching book:", error);
        throw error;
    }
};

// Buscar libros por título, autor o género
export const searchBooks = async (query: string) => {
    try {
        const response = await fetch(`/api/book/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error searching books: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error searching books:", error);
        throw error;
    }
};

// Obtener libros por autor
export const getBooksByAuthor = async (author: string) => {
    try {
        const response = await fetch(`/api/book/author/${encodeURIComponent(author)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching books by author: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching books by author:", error);
        throw error;
    }
};

// Obtener libros por género
export const getBooksByGenre = async (genre: string) => {
    try {
        const response = await fetch(`/api/book/genre/${encodeURIComponent(genre)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching books by genre: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching books by genre:", error);
        throw error;
    }
};

// Buscar libros por nombre (título)
export const searchBooksByTitle = async (title: string) => {
    try {
        const response = await fetch(`/api/book/search?q=${encodeURIComponent(title)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error searching books by title: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error searching books by title:", error);
        throw error;
    }
};

// Filtrar libros por año
export const filterBooksByYear = async (year: number) => {
    try {
        const response = await fetch(`/api/book/filter?year=${year}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error filtering books by year: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error filtering books by year:", error);
        throw error;
    }
};

// Filtrar libros por autor
export const filterBooksByAuthor = async (author: string) => {
    try {
        const response = await fetch(`/api/book/filter?author=${encodeURIComponent(author)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error filtering books by author: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error filtering books by author:", error);
        throw error;
    }
};

// Filtrar libros por año y autor juntos
export const filterBooksByYearAndAuthor = async (year: number, author: string) => {
    try {
        const response = await fetch(`/api/book/filter?year=${year}&author=${encodeURIComponent(author)}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error filtering books by year and author: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error filtering books by year and author:", error);
        throw error;
    }
};

// =================== TRANSACCIONES ===================
export const createTransaction = async (bookId: string, userId: string) => {
    return makeJsonPost('/api/transaction', { bookId, userId }, 'POST');
};

export const getUserTransactions = async (userId?: string) => {
  try {
    const url = userId ? `/api/transaction?userId=${userId}` : '/api/transaction';
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};


export const updateTransaction = async (transactionId: string, status: string, returnDate?: string) => {
    const response = await fetch('/api/transaction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status, returnDate }),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar la transacción');
    }

    return response.json();
};
