import React from "react";
import "../search.css";

const SearchBox = (props) => {
  return (
    <div className="search">
      <input
        type="text"
        name="text"
        class="input"
        placeholder="Browse movies.."
        value={props.value}
        onChange={(event) => props.setSearchValue(event.target.value)}
      ></input>
    </div>
  );
};

export default SearchBox;
