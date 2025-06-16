import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import UserCard from "../UserCard";
import LoadingSpinner from "../LoadingSpinner";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (search && auth.token) {
        setLoad(true);
        getDataAPI(`search?username=${search}`, auth.token)
          .then((res) => setUsers(res.data.users))
          .catch((err) => {
            dispatch({
              type: GLOBALTYPES.ALERT,
              payload: { error: err.response.data.msg },
            });
          })
          .finally(() => setLoad(false));
      } else {
        setUsers([]);
        setLoad(false);
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(delayedSearch);
  }, [search, auth.token, dispatch]);

  const handleClose = () => {
    setSearch("");
    setUsers([]);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value.toLowerCase().replace(/ /g, ""));
  };

  return (
    <form className="search_form">
      <div className="search-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-input-icon"></i>
          <input
            type="text"
            name="search"
            value={search}
            id="search"
            className="search-input"
            placeholder="Search people, posts, or topics..."
            onChange={handleInputChange}
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClose}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {load && (
          <div className="search-loading">
            <LoadingSpinner type="spinner" size="small" />
          </div>
        )}

        {search && users.length > 0 && (
          <div className="search-results">
            <div className="search-results-header">
              <h6 className="mb-0">
                <i className="fas fa-users me-2"></i>
                People ({users.length})
              </h6>
            </div>
            <div className="search-results-body">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  border="border"
                  handleClose={handleClose}
                />
              ))}
            </div>
          </div>
        )}

        {search && !load && users.length === 0 && (
          <div className="search-no-results">
            <div className="text-center py-3">
              <i className="fas fa-search fa-2x text-muted mb-2"></i>
              <p className="mb-0 text-muted">No users found for "{search}"</p>
              <small className="text-muted">Try a different search term</small>
            </div>
          </div>
        )}
      </div>

      <button type="submit" style={{ display: "none" }}>
        Search
      </button>
    </form>
  );
};

export default Search;
