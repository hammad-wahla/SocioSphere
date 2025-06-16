import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = (props) => {
  const { auth } = useSelector((state) => state);
  const firstLogin = localStorage.getItem("firstLogin");

  // Allow access if user has auth token OR if localStorage indicates previous login
  // This prevents blocking during the refresh token process
  return auth.token || firstLogin ? <Route {...props} /> : <Redirect to="/" />;
};

export default PrivateRouter;
