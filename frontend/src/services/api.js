const API_BASE = '/api'

function getAuthHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Auth API
export const authAPI = {
  generateToken: async (data) => {
    const response = await fetch(`${API_BASE}/auth/generate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  generateAdminToken: async (data) => {
    const response = await fetch(`${API_BASE}/auth/generate-admin-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  verify: async (token) => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  me: async (token) => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  refresh: async (token) => {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })
    return response.json()
  }
}

// Posts API
export const postsAPI = {
  list: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_BASE}/posts${queryString ? '?' + queryString : ''}`
    const response = await fetch(url)
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/posts/${id}`)
    return response.json()
  },

  create: async (data, token) => {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    })
    return response.json()
  },

  update: async (id, data, token) => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    })
    return response.json()
  },

  publish: async (id, token) => {
    const response = await fetch(`${API_BASE}/posts/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(token)
    })
    return response.status === 204 ? { success: true } : response.json()
  },

  delete: async (id, token) => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
    return response.status === 204 ? { success: true } : response.json()
  }
}

// Comments API
export const commentsAPI = {
  list: async (postId) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`)
    return response.json()
  },

  create: async (postId, content, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ content })
    })
    return response.json()
  },

  delete: async (postId, commentId, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
    return response.status === 204 ? { success: true } : response.json()
  }
}

// Likes API
export const likesAPI = {
  list: async (postId) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/likes`)
    return response.json()
  },

  count: async (postId) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/likes-count`)
    return response.json()
  },

  add: async (postId, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/likes`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  delete: async (postId, likeId, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/likes/${likeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
    return response.status === 204 ? { success: true } : response.json()
  }
}

// Admin API
export const adminAPI = {
  diagnostics: async (token) => {
    const response = await fetch(`${API_BASE}/admin/diagnostics`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  reset: async (token) => {
    const response = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  seed: async (token) => {
    const response = await fetch(`${API_BASE}/admin/seed`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  generate: async (count, token) => {
    const response = await fetch(`${API_BASE}/admin/generate`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ count })
    })
    return response.json()
  }
}

