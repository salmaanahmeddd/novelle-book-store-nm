import React from 'react';
import '../styles/Overlay.css';

const ActionOverlay = ({ onView, onEdit, onDelete, onClose }) => {
  return (
    <div className="action-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="overlay-option" onClick={onView}>View</div>
      <div className="overlay-option" onClick={onEdit}>Edit</div>
      <div className="overlay-option overlay-option-delete" onClick={onDelete}>Delete</div>
    </div>
  );
};

export default ActionOverlay;
