import { Card } from '@welcome-ui/card';
import { Candidate } from '../../api';
import { useDrag } from 'react-dnd';

export const CARD_TYPE = 'CANDIDATE'; // Unique type identifier for drag-and-drop

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CARD_TYPE, // Type identifier to match with droppable areas
    item: { id: candidate.id, status: candidate.status, position: candidate.position }, // Data passed on drag
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Track dragging state
    }),
  }));

  return (
    <Card
      ref={drag} // Attach the drag reference to make the card draggable
      mb={10}
      style={{
        opacity: isDragging ? 0.5 : 1, // Adjust opacity while dragging
        cursor: 'move', // Change cursor to indicate draggable
      }}
    >
      <Card.Body>{candidate.email}</Card.Body>
    </Card>
  );
}

export default CandidateCard;
