import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";

const LangDropdown = ({ currentlanguage, setLanguage, languages, type, label = "", ariaLabel, tabIndex, disabledLanguage }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const handleOnKeyPress = (key) => {
    if (key.keyCode === 27) {
      setOpen(false);
    }
  }
  useOnClickOutside(ref, () => setOpen(false));
  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
  }
  return (
    <Dropdown ref={ref} className="langDrop" show={open} autoClose={true}>
      {
        label !== "" &&
        <label className="floating-label">{label}</label>
      }

      <Dropdown.Toggle onKeyDown={handleOnKeyPress} tabIndex={tabIndex} onClick={() => setOpen(true)} aria-label={`${ariaLabel} dropdown`} id="sourceLanguageSelector">
        {currentlanguage[type]}
      </Dropdown.Toggle>
      <Dropdown.Menu onBlur={() => console.log("first")}>
        {languages?.map((x, index) => (
          <Dropdown.Item
            onKeyDown={handleOnKeyPress}
            className={x[type] === disabledLanguage ? 'dropdownDisabled' : x[type] === currentlanguage[type] ? 'selected' : ''}
            aria-label={x[type] === disabledLanguage ? `${x[type]} already selected in ${type === 'sourceLanguage' ? 'to' : 'from'} language dropdown` : x[type]}
            key={index.toString()}
            onClick={() => {
              if (x[type] !== disabledLanguage) {
                setLanguage(x);
                setOpen(false);
              }
            }}
          >
            {x[type]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LangDropdown;
