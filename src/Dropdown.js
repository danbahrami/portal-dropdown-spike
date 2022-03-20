import { useState, useRef, forwardRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import DropdownBox from "./DropdownBox";
import { useBoundingclientrect } from "rooks";
import "./Dropdown.css";

const Dropdown = forwardRef((props, ref) => {
  const { id, name, value, options, onChange, boxPosition } = props;
  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef();
  const boxRef = useRef();
  const inputRect = useBoundingclientrect(inputRef);

  const handleDocumentClick = useCallback((e) => {
    const clickedOutside =
      (!inputRef.current || !inputRef.current.contains(e.target)) &&
      (!boxRef.current || !boxRef.current.contains(e.target));

    if (clickedOutside) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    ref.current = {
      close: () => {
        setOpen(false);
        inputRef.current.blur();
      },
    };

    return () => {
      ref.current = null;
    };
  });

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
        onChange={() => {}}
        className="Dropdown__input"
        onFocus={handleFocus}
        id={id}
        name={name}
        ref={inputRef}
      />
      {isOpen && (
        <DropdownBox
          ref={boxRef}
          onChange={handleChange}
          options={options}
          position={boxPosition(inputRect)}
        />
      )}
    </div>
  );
});

Dropdown.defaultProps = {
  boxPosition: (inputRect) => ({
    top: inputRect.bottom,
    left: inputRect.left,
  }),
};

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  boxPosition: PropTypes.func,
};

export default Dropdown;
