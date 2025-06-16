import React from "react";

const Avatar = ({ src, size }) => {
  return <img src={src} alt="avatar" className={size} />;
};

export default Avatar;
