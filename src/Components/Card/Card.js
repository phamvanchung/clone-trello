import React from "react";
import "./Card.scss";

export default function Card(props) {
  const { card } = props;

  return (
    <div className="card-item">
      {card.cover && (
        <img
          src="https://img.saostar.vn/w500/2017/12/27/1971045/dr0swo8vwaupjwo.jpg"
          alt=""
          onMouseDown={e => e.preventDefault()}
        />
      )}
      {card.title}
    </div>
  );
}
