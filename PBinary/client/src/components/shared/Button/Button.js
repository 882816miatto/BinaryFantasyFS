import React      from 'react';
import './Button.css';
import PropTypes  from 'prop-types';

class Button extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			label: props.label,
			color: props.color || 'primary',
			onClick: props.onClick,
			type: props.type || 'standard', // icon or standard,
			iconClass: props.iconClass
		};
	}

	render() {
		const { label, color, onClick, type, iconClass } = this.state;
		return (
				<button className={'cool-button cool-button--' + color + ' cool-button--' + type} onClick={onClick}>
					{type === 'standard' ? label : (
							<i className={iconClass} />
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
};
