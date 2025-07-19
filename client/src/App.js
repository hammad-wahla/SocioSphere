import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles/confirm-modal.css";
import "./styles/follow-request.css";
import "./styles/unified-buttons.css";
import "./styles/bottom-nav.css";

import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyEmail from "./pages/verifyEmail";

import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import BottomNav from "./components/BottomNav";
import StatusModal from "./components/StatusModal";
import LoadingSpinner from "./components/LoadingSpinner";

import { useSelector, useDispatch } from "react-redux";
import { refreshToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionsAction";

import io from "socket.io-client";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import SocketClient from "./SocketClient";

import { getNotifies } from "./redux/actions/notifyAction";
import CallModal from "./components/message/CallModal";
import Peer from "peerjs";

function App() {
  const { auth, status, modal, call, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      await dispatch(refreshToken());
      setAuthLoading(false);
    };
    
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      loadAuth();
    } else {
      setAuthLoading(false);
    }

    const socket = io("https://69f218f0-915f-473f-9072-57a577b86780-00-1sjx3pcr451nc.pike.replit.dev", {
      withCredentials: true
    });
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (!("Notification" in window)) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: "This browser does not support desktop notifications",
        },
      });
    } else if (Notification.permission === "granted") {
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: "Desktop notifications enabled!" },
          });
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: "/",
      secure: true,
    });

    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
  }, [dispatch]);

  // Show loading spinner during initial auth check
  if (authLoading) {
    return (
      <div className="App" data-theme={theme ? "dark" : "light"}>
        <Alert />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Alert />

      <div
        className={`App ${(status || modal) && "mode"}`}
        data-theme={theme ? "dark" : "light"}
      >
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/" component={auth.token ? Home : Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/verify-email/:token" component={VerifyEmail} />

          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
          
          {auth.token && <BottomNav />}
        </div>
      </div>
    </Router>
  );
}

export default App;
