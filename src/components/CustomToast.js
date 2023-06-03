import { Toast } from "react-bootstrap";

const CustomToast = ({ bg, onClose, show, delay, title, children, autohide = true }) => {
  return (
    <Toast bg={bg} onClose={() => onClose()} show={show} delay={delay} autohide={autohide}>
      <Toast.Header>
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};

export default CustomToast;
