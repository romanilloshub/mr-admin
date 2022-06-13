import { useSelector } from "react-redux";

const useAmI = () => {
  const { roles } = useSelector(({ auth }) => auth.authUser?.claims);
  const amIByRoles = (amIRoles) => {
    if (Array.isArray(amIRoles)) {
      return amIRoles.map((role) => amI(role, roles)).some((x) => x);
    }
    return amI(amIRoles, roles);
  };
  return [amIByRoles];
};

const amI = (role, roles) => {
  return roles.includes(role);
};

export default useAmI;
