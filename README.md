# Kanban Board Implementation
- This project implements a scalable, real-time Kanban board application for managing candidate workflows.

# Setup Instructions
# Install dependencies:
- Ensure you have Node.js and PostgreSQL installed.
- Run yarn install to install frontend dependencies.
# Set up the backend:
- Follow the instructions provided in the backend repository/bootstrap to set up and seed the PostgreSQL database.
- Start the backend server using mix phx.server.
# Start the frontend:
- Navigate to the src directory and run yarn dev to start the frontend development server.

# Features Implemented
# Drag-and-Drop Functionality
- Implemented: Drag-and-drop functionality for moving cards between different columns using React DND.

- Installed libraries: react-dnd and react-dnd-html5-backend using yarn add react-dnd react-dnd-html5-backend.
- Cards can be moved between columns such as new, interview, hired, and rejected.
- #Pending:#  Drag-and-drop within the same column for reordering cards. This will require additional logic to update card positions and maintain their order in the backend.

# API Integration
- Axios is used for making API calls to the backend for retrieving and updating candidate data.
- Installed using: yarn add axios.
#Key APIs Used
- GET /api/jobs/:jobId/candidates: To fetch candidate data.
- PUT /api/candidates/:id: To update the status and position of candidates during drag-and-drop.

# Known Issues/Next Steps
- Same Column Drag-and-Drop:

# Pending implementation to reorder cards within the same column.
- This requires:
- Frontend logic to capture new card positions.
- Backend updates to store and reflect the updated order.
- Error Handling:
- Add robust error handling for API calls.
- Real-Time Collaboration:
-Real-time updates using WebSockets or Server-Sent Events (not implemented in this version).