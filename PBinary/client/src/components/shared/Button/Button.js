import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      color: props.color || "primary", // primary (teal) secondary (grey) accent (dark-pink) error (red)
      onClick: props.onClick,
      type: props.type || "standard", // icon or standard or standard-icon,
      iconClass: props.iconClass,
      disabled: props.disabled,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.disabled !== this.state.disabled) {
      this.setState({
        disabled: nextProps.disabled,
      })
    }
    return true;
  }

  render() {
    const { label, color, onClick, type, iconClass, disabled } = this.state;
    return (
      <button
        type="button"
        className={`cool-button cool-button--${color} cool-button--${type} ${
          disabled ? "cool-button--disabled" : ""
        }`}
        onClick={onClick}
      >
        {type === "standard" && label}
        {type === "icon" && <i className={iconClass} />}
        {type === "standard-icon" && (
          <>
            <i className={iconClass} />
            {label}
          </>
        )}
      </button>
    );
  }
}

export default Button;

Button.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  iconClass: PropTypes.string,
  disabled: PropTypes.bool,
};
