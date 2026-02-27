import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsOwner, setOwnerData } from "../redux/ownerSlice";

export const changeRole = async (dispatch) => {
  const { data } = await axios.post(
    "http://localhost:3000/api/owner/change-role",
    {},
    { withCredentials: true },
  );
  dispatch(setOwnerData(data))
  dispatch(setIsOwner(true))
};
