import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Status from "../components/home/Status";
import Posts from "../components/home/Posts";
import RightSideBar from "../components/home/RightSideBar";
import LeftSideBar from "../components/home/LeftSideBar";
import LoadingSpinner from "../components/LoadingSpinner";

import { refreshToken } from "../redux/actions/authAction";
import { getPosts } from "../redux/actions/postAction";
import { getSuggestions } from "../redux/actions/suggestionsAction";

let scroll = 0;

const Home = () => {
  const { auth, homePosts } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 767);

  useEffect(() => {
    dispatch(refreshToken());

    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
    }
  }, [dispatch, auth.token]);

  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="home row mx-0"
      style={{ paddingTop: "20px", paddingBottom: isMobile ? "0px" : "40px" }}
    >
      {/* Left Sidebar */}
      <div
        className="col-lg-3 h-content d-none d-lg-block"
        style={{ paddingRight: "15px" }}
      >
        <LeftSideBar />
      </div>
      
      {/* Combined Left Sidebar for Medium screens */}
      <div
        className="col-md-4 d-none d-md-block d-lg-none"
        style={{ paddingRight: "15px" }}
      >
        <LeftSideBar />
        <div className="mt-3">
          <RightSideBar />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="col-lg-6 mx-auto col-md-8 col-sm-12"
        style={{ padding: "0 15px" }}
      >
        <Status />
        {homePosts.loading ? (
          <div style={{ padding: "40px 0" }}>
            <LoadingSpinner type="dots" text="Loading feed..." size="medium" />
          </div>
        ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
            </div>
            <h3 className="text-muted mb-3">Welcome to SocioSphere!</h3>
            <p className="text-muted mb-4">
              Your feed is empty. Start connecting with people and sharing your
              thoughts!
            </p>
            <div className="d-flex flex-column align-items-center">
              <p className="text-muted mb-2">
                <i className="fas fa-lightbulb mr-2"></i>
                What can you do to get started?
              </p>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <i className="fas fa-edit mr-2 text-info"></i>
                  Share your first post above
                </li>
                <li className="mb-2">
                  <i className="fas fa-user-plus mr-2 text-success"></i>
                  Follow suggested users on the right
                </li>
                <li className="mb-2">
                  <i className="fas fa-search mr-2 text-warning"></i>
                  Discover new content and people
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Posts />
        )}
      </div>

      {/* Right Sidebar - Only on large screens */}
      <div
        className="col-lg-3 h-content d-none d-lg-block"
        style={{ paddingLeft: "15px" }}
      >
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
