import React from "react";
import PropTypes from "prop-types";
import "./SidePanel.css";

const SidePanel = (props) => {
  return (
    <div className="SidePanel">
      <div className="SidePanel__header"></div>
      <div className="SidePanel__scroller">
        <div className="SidePanel__scroller__content">{props.children}</div>
      </div>
      <div className="SidePanel__footer"></div>
    </div>
  );
};

SidePanel.propTypes = {
  children: PropTypes.node,
};

export default SidePanel;
