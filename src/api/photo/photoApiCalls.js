import fetch from 'cross-fetch';

export const getPhotosByAlbumId = async (albumId) => {
    return fetch(process.env.REACT_APP_API_BASE_URL + "photo/GetPhotosByAlbumId/" + albumId, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
} 