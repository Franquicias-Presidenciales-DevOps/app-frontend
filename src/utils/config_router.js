import { useAuthStore } from "@/store/auth";

export const useUtils = () => {
  /**
   * Rutas permitidas
   */
  const allowedPaths = ["dashboard", "changePassword", "changePasswordTemp"];

  const pathToRegex = (path) => {
    // Reemplaza :id por una expresión regular que permita números
    return new RegExp('^' + path.replace(/:\w+/g, '(\\d+)') + '$');
  };

  const comparePaths = (uri, path) => {
    const regex = pathToRegex(uri);
    return regex.test(path);
  };

  const SearchPathFtn = (paths_param, path_param) => {
    return paths_param.some((item) => {
      if (item.childs?.length > 0)
        return SearchPathFtn(item.childs, path_param);
      return comparePaths(item.uri.toLowerCase(), path_param.path.toLowerCase());
    });
  };

  const tempPassword = (path, name) => {
    const store_ref = useAuthStore();
    const info = store_ref.user_info_st;
    if (!(info?.user?.temp_pwd && path.name !== name)) return null;
    return name;
  };

  const canNext = async (path_param) => {
    const store_ref = useAuthStore();

    if (!path_param.name) return false;

    if (store_ref.paths_st.length === 0) await store_ref.obtainPathsAct();

    if (!store_ref.user_info_st?.user) await store_ref.obtainUserInfoAct();

    if (allowedPaths.includes(path_param.name)) return true;

    return SearchPathFtn(store_ref.paths_st, path_param);
  };

  return {
    canNext,
    tempPassword,
  };
};

export default useUtils;
