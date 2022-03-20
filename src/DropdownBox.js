import { useState, useEffect, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { getKey, KEYS } from "./keyboard-utils";

const usePortal = () => {
  const [element] = useState(() => document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  return element;
};

const DropdownBox = forwardRef((props, ref) => {
  const { position, options, onChange, id, selected } = props;
  const portal = usePortal();
  const [focused, setFocus] = useState(selected);

  const handleKeydown = useCallback(
    (e) => {
      const focusedIndex = options.indexOf(focused);
      const key = getKey(e);

      if (key === KEYS.UP && focusedIndex > 0) {
        setFocus(options[focusedIndex - 1]);
        return;
      }

      if (key === KEYS.DOWN && focusedIndex < options.length - 1) {
        setFocus(options[focusedIndex + 1]);
        return;
      }

      if (key === KEYS.ENTER || key === KEYS.SPACE) {
        onChange(focused);
        return;
      }
    },
    [options, focused, onChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  if (!portal) {
    return null;
  }

  return createPortal(
    <div
      className="Dropdown__box"
      ref={ref}
      style={{
        ...position,
      }}
    >
      <ul>
        {options.map((option) => (
          <li key={option}>
            <button
              role="option"
              id={`${id}-option-${option}`}
              aria-selected={option === selected}
              className={`Dropdown__box__option ${
                option === focused ? "focused" : ""
              }`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>,
    portal
  );
});

DropdownBox.propTypes = {
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  onChange: PropTypes.func,
  options: PropTypes.array,
  selected: PropTypes.string,
  id: PropTypes.string,
};

export default DropdownBox;
