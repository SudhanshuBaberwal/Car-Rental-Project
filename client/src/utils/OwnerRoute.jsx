import { useSelector } from "react-redux";

const OwnerRoute = ({ children }) => {
  const isOwner = useSelector((state) => state.owner);

  if (!isOwner) {
    return <Navigate to="/" />;
  }

  return children;
};

export default OwnerRoute