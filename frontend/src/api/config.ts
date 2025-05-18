export const API_BASE_URL = '';

export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...getDefaultHeaders(),
    'Authorization': token ? `Bearer ${token}` : '',
  };
}; 