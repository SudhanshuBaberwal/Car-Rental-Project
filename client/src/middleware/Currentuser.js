import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

const dispatch = useDispatch();

const getCurrentUser = async () => {
    const result = await axios.get("http://localhost:3000/api/auth/getCurrentUser")
    console.log(result)
    dispatch(setUserData(result))
}

export default getCurrentUser;