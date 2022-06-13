import { useSelector } from "react-redux";

const useForRoleFilter = (listToFilter) => {
  const { roles } = useSelector(({ auth }) => auth.authUser.claims);

  return listToFilter
    .map((elem) => {
      if (!elem.forRoles) return elem;
      if (roles.some((role) => elem.forRoles.includes(role))) return elem;
      return null;
    })
    .filter((x) => x);
};

export default useForRoleFilter;
