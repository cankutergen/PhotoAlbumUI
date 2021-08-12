import fetch from 'cross-fetch';

export const getAlbumByUserId = async (userId) => {
    return fetch(process.env.REACT_APP_API_BASE_URL + "album/GetAlbumsByUserId/" + userId, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
} 