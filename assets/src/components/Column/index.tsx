import React from "react";
import { useDrop } from "react-dnd";
import Card from "../Candidate";

const Column = ({ status, candidates, onCardDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { id: number }, monitor) => {
      const newPosition = candidates.length; // Add to the end of the column
      onCardDrop(item.id, status, newPosition);
    },
  }));

  return (
    <div ref={drop} style={{ padding: "1rem", backgroundColor: "#f4f4f4" }}>
      <h3>{status}</h3>
      {candidates.map((candidate) => (
        <Card key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
};

export default Column;
