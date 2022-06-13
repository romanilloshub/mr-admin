import { useSelector } from "react-redux";
import ROLES from "custom/constants/RoleTypes";

const useUserRole = () => {
  const [role] = useSelector(
    ({ auth }) => auth.authUser.claims.roles || ["base"]
  );
  return [role, ROLES];
};

export default useUserRole;
