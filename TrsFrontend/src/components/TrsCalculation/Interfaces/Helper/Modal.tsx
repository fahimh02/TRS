import React from 'react';

interface ModalProps {
  isOpen: boolean;         // Modal open state
  image: string;          // URL of the image to display
  onClose: () => void;    // Function to call when closing the modal
  onNext: () => void;     // Function to call when going to the next image
  onPrev: () => void;     // Function to call when going to the previous image
}

const Modal: React.FC<ModalProps> = ({ isOpen, image, onClose, onNext, onPrev }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <img
          src={image}
          alt="Zoomed"
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
        />
        <button onClick={onPrev} style={styles.button}>Previous</button>
        <button onClick={onNext} style={styles.button}>Next</button>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    position: 'relative',
    textAlign: 'center',
  },
  button: {
    margin: '5px',
  },
};

export default Modal;
