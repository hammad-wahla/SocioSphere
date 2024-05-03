import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import Status from "../components/home/Status";
import Posts from "../components/home/Posts";
import RightSideBar from "../components/home/RightSideBar";
import LeftSideBar from "../components/home/LeftSideBar";
import LoadIcon from "../images/loading.gif";

let scroll = 0;

const Home = () => {
  const { homePosts } = useSelector((state) => state);

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

  return (
    <div className="home row mx-0">
      {/* Left Sidebar */}
      <div className="col-lg-3 col-md-4 d-none d-md-block">
        <LeftSideBar />
      </div>

      {/* Main Content */}
      <div className="col-lg-6 mx-auto col-md-8 col-sm-12">
        <Status />
        {homePosts.loading ? (
          <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
        ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
          <h2 className="text-center">No Post</h2>
        ) : (
          <Posts />
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-lg-3 col-md-4 d-none d-md-block">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
