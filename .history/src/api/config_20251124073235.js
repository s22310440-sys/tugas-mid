// ========== API CONFIGURATION ==========

// API Base URLs
export const API_BASE_URL = "https://jsonplaceholder.typicode.com";
export const API_KEY = "demo-key-2024";

// API Endpoints
export const API_ENDPOINTS = {
  BOOKS: "/posts",
  USERS: "/users",
  LOANS: "/comments",
};

// Fetch wrapper dengan error handling
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error.message);
    return { success: false, error: error.message };
  }
};

// Get all books/posts
export const getBooks = async () => {
  return fetchAPI(API_ENDPOINTS.BOOKS + "?_limit=10");
};

// Get book by ID
export const getBookById = async (id) => {
  return fetchAPI(`${API_ENDPOINTS.BOOKS}/${id}`);
};

// Get all users
export const getUsers = async () => {
  return fetchAPI(API_ENDPOINTS.USERS);
};

// Get loan records
export const getLoans = async () => {
  return fetchAPI(API_ENDPOINTS.LOANS + "?_limit=10");
};

// Submit loan request
export const submitLoan = async (loanData) => {
  return fetchAPI(API_ENDPOINTS.LOANS, {
    method: "POST",
    body: JSON.stringify(loanData),
  });
};

// Update loan status
export const updateLoan = async (loanId, status) => {
  return fetchAPI(`${API_ENDPOINTS.LOANS}/${loanId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
