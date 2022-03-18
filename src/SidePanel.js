import React from "react";
import PropTypes from "prop-types";
import "./SidePanel.css";

const SidePanel = ({ children, onScroll }) => {
  return (
    <div className="SidePanel">
      <div className="SidePanel__header"></div>
      <div className="SidePanel__scroller" onScroll={onScroll}>
        <div className="SidePanel__scroller__content">{children}</div>
      </div>
      <div className="SidePanel__footer"></div>
    </div>
  );
};

SidePanel.propTypes = {
  children: PropTypes.node,
  onScroll: PropTypes.func,
};

export default SidePanel;
