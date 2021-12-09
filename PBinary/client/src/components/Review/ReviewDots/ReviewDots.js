import React     from 'react';
import './ReviewDots.css';
import PropTypes from 'prop-types';

class ReviewDots extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			evaluation: props.evaluation,
			maxEvaluation: 5,
			editable: props.editable,
			dotsOutput: props.dotsOutput,
		};
	}

	handleDotsChange = (newValue) => {
		const currentEvaluation = this.state.evaluation;
		if (currentEvaluation === 1 && newValue === 1) {
			newValue = 0;
		}
		this.state.dotsOutput(newValue);
		this.setState({
			evaluation: newValue,
		})
	}

	render() {
		const { evaluation, maxEvaluation, editable } = this.state;
		const dotsArray = [];
		for (let i = 0; i < maxEvaluation; i++) {
			dotsArray.push(i+1);
		}
		return (
				<div className={editable ? 'review-dots review-dots--selectable' : 'review-dots'}>
					{
						dotsArray.map(dot => (
							<div key={dot}
							     onClick={() => editable && this.handleDotsChange(dot)}
							     className={dot <= evaluation ? 'review-dot review-dot--active' : editable ? 'review-dot review-dot--selectable' : 'review-dot'}/>
						))
					}
				</div>
		);
	}

}

export default ReviewDots;

ReviewDots.propTypes = {
	evaluation: PropTypes.number,
	maxEvaluation: PropTypes.number,
	editable: PropTypes.bool,
	dotsOutput: PropTypes.func
};
