import api from '../services/api'

export const getMyProfileApi = async () => {
    const res = await api.get("profiles/me")
    console.log('res.data', res.data)
    return res.data
}