import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dropdown.css";

const Dropdown = ({ options, value, onChange, name, id }) => {
  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef();
  const boxRef = useRef();

  const handleDocumentClick = useCallback((e) => {
    const clickedOutside =
      (!inputRef.current || !inputRef.current.contains(e.target)) &&
      (!boxRef.current || !boxRef.current.contains(e.target));

    if (clickedOutside) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleDocumentClick, true);
    } else {
      document.removeEventListener("click", handleDocumentClick, true);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isOpen, handleDocumentClick]);

  const handleFocus = () => {
    setOpen(true);
  };

  const handleChange = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="Dropdown">
      <input
        type="text"
        value={value}
        className="Dropdown__input"
        onFocus={handleFocus}
        id={id}
        name={name}
        ref={inputRef}
      />
      {isOpen && (
        <div className="Dropdown__box" ref={boxRef}>
          <ul>
            {options.map((option) => (
              <li key={option}>
                <button
                  className="Dropdown__box__option"
                  onClick={() => handleChange(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default Dropdown;
