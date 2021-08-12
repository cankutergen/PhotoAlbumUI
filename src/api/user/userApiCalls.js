import fetch from 'cross-fetch';

export const getAllUsers = async () => {
    return fetch(process.env.REACT_APP_API_BASE_URL + "user", {
        headers: {
            'Content-Type': 'application/json'
        }
    })
} 