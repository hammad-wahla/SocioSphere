import React from "react";
import { useSelector } from "react-redux";
import UserCard from "../../components/UserCard";
import Avatar from "../Avatar";

const LeftSideBar = () => {
  // Get the list of friends from the Redux store
  const { auth } = useSelector((state) => state);
  const friends = auth.user.following;

  return (
    <>
      <div className=" LeftSide">
        <UserCard user={auth.user} />
      </div>
      <div className="mt-2   LeftSide">
        <h5>Friends</h5>
        <hr />
        {/* Display friends */}
        <div>
          {friends.map((friend) => (
            <UserCard key={friend._id} user={friend} />
          ))}
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
