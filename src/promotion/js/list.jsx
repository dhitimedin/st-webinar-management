import React from 'react';

const List = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.text}>
          <strong>{item.label}</strong> {item.text}
        </li>
      ))}
    </ul>
  );
};

export default List;
