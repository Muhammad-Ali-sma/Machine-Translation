import { Button, Overlay, Tooltip } from "react-bootstrap";
import { Copy } from "react-feather";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { generateDoc } from "./DocGenerator";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const ClipboardWordIcon = ({ taskId, toText }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    const subscribe = setTimeout(() => {
      if (show) {
        setShow(false);
      }
    }, 1000);

    return () => {
      clearTimeout(subscribe);
    }
  }, [show])

  return (
    <div className="d-flex flex-column position-relative">
      <Overlay target={target.current} show={show} placement="top">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            Target Text Copied!
          </Tooltip>
        )}
      </Overlay>
      <CopyToClipboard text={toText}>
        <div className="d-flex flex-row position-relative">
          <Button
            aria-label="copy text button"
            className="position-absolute"
            style={{ right: -19, padding: 0 }}
            variant="default"
            ref={target}
            onClick={() => toText && setShow(true)}
            tabIndex="5"
          >
            <Copy />
          </Button>
        </div>
      </CopyToClipboard>
      <div className="d-flex flex-row position-relative">
        <Button
          className="position-absolute"
          style={{ right: -23, top: 33, padding: 0 }}
          tabIndex="5"
          aria-label="convert text to word button"
          variant="default"
          onClick={() => {
            taskId && generateDoc(taskId, toText);
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H26"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 20H26"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 9V5C8 4.73478 8.10536 4.48043 8.29289 4.29289C8.48043 4.10536 8.73478 4 9 4H25C25.2652 4 25.5196 4.10536 25.7071 4.29289C25.8946 4.48043 26 4.73478 26 5V27C26 27.2652 25.8946 27.5196 25.7071 27.7071C25.5196 27.8946 25.2652 28 25 28H9C8.73478 28 8.48043 27.8946 8.29289 27.7071C8.10536 27.5196 8 27.2652 8 27V23"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 13L9.5 19L11.5 14.5L13.5 19L15 13"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 9H5C4.44772 9 4 9.44772 4 10V22C4 22.5523 4.44772 23 5 23H18C18.5523 23 19 22.5523 19 22V10C19 9.44772 18.5523 9 18 9Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ClipboardWordIcon;
