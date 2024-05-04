// import axios from 'axios'

// export const getDataAPI = async (url, token) => {
//     const res = await axios.get(`/api/${url}`, {
//         headers: { Authorization: token}
//     })
//     return res;
// }

// export const postDataAPI = async (url, post, token) => {
//     const res = await axios.post(`/api/${url}`, post, {
//         headers: { Authorization: token}
//     })
//     return res;
// }

// export const putDataAPI = async (url, post, token) => {
//     const res = await axios.put(`/api/${url}`, post, {
//         headers: { Authorization: token}
//     })
//     return res;
// }

// export const patchDataAPI = async (url, post, token) => {
//     const res = await axios.patch(`/api/${url}`, post, {
//         headers: { Authorization: token}
//     })
//     return res;
// }

// export const deleteDataAPI = async (url, token) => {
//     const res = await axios.delete(`/api/${url}`, {
//         headers: { Authorization: token}
//     })
//     return res;
// }





import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://socio-sphere-server-seven.vercel.app/api' : '/api';

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`${baseUrl}/${url}`, {
        headers: { Authorization: token }
    });
    return res;
};

export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`${baseUrl}/${url}`, post, {
        headers: { Authorization: token }
    });
    return res;
};

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`${baseUrl}/${url}`, post, {
        headers: { Authorization: token }
    });
    return res;
};

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`${baseUrl}/${url}`, post, {
        headers: { Authorization: token }
    });
    return res;
};

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${baseUrl}/${url}`, {
        headers: { Authorization: token }
    });
    return res;
};
