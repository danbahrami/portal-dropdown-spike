import { useState, useRef, forwardRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import DropdownBox from "./DropdownBox";
import { useBoundingclientrect } from "rooks";
import { getKey, KEYS } from "./keyboard-utils";
import "./Dropdown.css";

const Dropdown = forwardRef((props, ref) => {
  const { id, name, value, options, onChange, boxPosition } = props;
  const [isOpen, setOpen] = useState(false);
  const [hasFocus, setFocus] = useState(false);
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

  const handleKeydown = useCallback(
    (event) => {
      const key = getKey(event);
      if (!isOpen) {
        if ([KEYS.ENTER, KEYS.SPACE, KEYS.UP, KEYS.DOWN].includes(key)) {
          setOpen(true);
          return;
        }
      } else if ([KEYS.ESCAPE, KEYS.TAB].includes(key)) {
        setOpen(false);
      }
    },
    [isOpen]
  );

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

  useEffect(() => {
    if (hasFocus) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [hasFocus, handleKeydown]);

  const handleChange = useCallback(
    (option) => {
      onChange(option);
      setOpen(false);
      inputRef.current.focus();
    },
    [onChange]
  );

  return (
    <div className="Dropdown">
      <input
        type="text"
        role="combobox"
        aria-controls={`${id}-box`}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${id}-box-option-${value}` : undefined}
        value={value}
        onChange={() => {}}
        className="Dropdown__input"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick={() => setOpen(true)}
        id={id}
        name={name}
        ref={inputRef}
      />
      {isOpen && (
        <DropdownBox
          ref={boxRef}
          onChange={handleChange}
          options={options}
          selected={value}
          position={boxPosition(inputRect)}
          id={`${id}-box`}
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
