import { useState, useEffect, useRef, forwardRef, useCallback } from "react";
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
  const scrollerRef = useRef(null);
  const optionRefs = useRef({});

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

  /**
   * Update the scroll to always include the focussed element
   */
  useEffect(() => {
    const scrollTop = scrollerRef.current.scrollTop;
    const scrollerHeight = scrollerRef.current.offsetHeight;
    const offsetTop = optionRefs.current[focused].offsetTop;
    const optionHeight = optionRefs.current[focused].offsetHeight;

    if (scrollTop > offsetTop) {
      scrollerRef.current.scrollTop = offsetTop;
      return;
    }

    if (scrollTop + scrollerHeight < offsetTop + optionHeight) {
      scrollerRef.current.scrollTop = offsetTop + optionHeight - scrollerHeight;
      return;
    }
  }, [focused]);

  /**
   * Ensure the selected option is visible when the dropdown box is opened
   */
  useEffect(() => {
    const scrollerHeight = scrollerRef.current.offsetHeight;
    const offsetTop = optionRefs.current[selected].offsetTop;
    const optionHeight = optionRefs.current[selected].offsetHeight;

    scrollerRef.current.scrollTop =
      offsetTop - scrollerHeight / 2 + optionHeight / 2;
  }, []);

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
      <div className="Dropdown__box__scroller" ref={scrollerRef}>
        {options.map((option) => (
          <button
            key={option}
            role="option"
            ref={(el) => (optionRefs.current[option] = el)}
            id={`${id}-option-${option}`}
            aria-selected={option === selected}
            className={`Dropdown__box__option ${
              option === focused ? "focused" : ""
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
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
