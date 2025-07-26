import axios from "axios";
import {API_URL} from "@/context/AuthContext";
import {User} from "@/app/Services/UserService/user";


export const fetchProfile = async () => {
    const result = await axios.get(`${API_URL}/api/users/me`);
    const resultData = result.data;
    return resultData as User;
}

export const updateSelfUser = async (user: User) => {
    await axios.put(`${API_URL}/api/users/me`, user);
}

export const deleteUser = async (user: User) => {
    await axios.delete(`${API_URL}/api/users/${user.id}`);
}

export default {fetchProfile, updateSelfUser, deleteUser};