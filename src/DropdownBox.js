import { useState, useEffect, forwardRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

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
  const { position, options, onChange } = props;
  const portal = usePortal();

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
              className="Dropdown__box__option"
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
};

export default DropdownBox;
