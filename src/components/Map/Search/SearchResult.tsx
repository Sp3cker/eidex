import React from "react";

const SearchResult = React.memo(function SearchResult(props: any) {
  return (
    <div className="row-container">
      <div className="name-container">
        <p>{props.name}</p>
      </div>
    </div>
  );
});

export default SearchResult;
