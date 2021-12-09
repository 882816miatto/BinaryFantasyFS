import React                        from 'react';
import { Dialog, Slide, TextField } from '@material-ui/core';
import './ReviewCreateUpdateDialog.css';
import ReviewDots                   from '../ReviewDots/ReviewDots';
import ImagePicker                  from '../../shared/ImagePicker/ImagePicker';
import Button                       from '../../shared/Button/Button';
import PropTypes                    from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class ReviewCreateUpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			onClose: this.props.onClose,
			open: this.props.open,
			newReview: this.props.review ? this.props.review : {},
		};
	}

	handleClose = () => {
		this.setState({
			newReview: {}
		}, () => this.state.onClose());
	};

	handleListItemClick = (value) => {
		this.state.onClose(value);
	};

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.open !== this.state.open) {
			this.setState({
				open: !!nextProps.open
			});
		}
		if (nextProps.review !== this.state.newReview) {
			this.setState({
				newReview: nextProps.review,
			})
		}
		return true;
	}

	onReviewFieldChanged = (field, value) => {
		let { newReview } = this.state;
		if (!newReview) {
			newReview = {};
		}
		newReview[field] = value;
		this.setState({
			newReview,
		});
	}

	createReview = () => {
		console.log(this.state.newReview);
	}

	handleDelete = () => {
		// TODO

	}

	deleteReview = () => {
		// TODO
	}

	render() {
		const { open, newReview } = this.state;
		return (
				<Dialog fullScreen
				        onClose={this.handleClose}
				        TransitionComponent={Transition}
				        open={open}>
					<div className="review-create">
						<div className="review-create__header-container row no-gutters">
							<div className="col-2-10">
								<button type="button" className="transparentButton center" onClick={this.handleClose}>
									<i className="fas fa-times" />
								</button>
							</div>
							<div className="col-5-10">
								<h1 className="center">Scrivi recensione</h1>
							</div>
						</div>
						<div className="review-create__content">
							<h1>La tua esperienza</h1>
							<ReviewDots
									editable={true}
									evaluation={newReview ? newReview.evaluation : 0}
									dotsOutput={e => this.onReviewFieldChanged('evaluation', e)} />
							<TextField
									id="outlined-multiline-static"
									multiline
									variant="outlined"
									defaultValue={newReview ? newReview.comment : ''}
									placeholder="Scrivi una recensione..."
									onChange={e => this.onReviewFieldChanged('comment', e.target.value)}
									rows={8}
							/>
							<ImagePicker
									pictures={newReview ? newReview.images : []}
									imageOutput={e => this.onReviewFieldChanged('images', e)} />
						</div>
						<div className="review-create__footer">
							{newReview.user ? <Button label="Elimina" color="error" onClick={this.handleDelete} /> : <div></div>}
							<div className="review-create__footer-right">
								<Button label="Annulla" color="secondary" onClick={this.handleClose} />
								<Button label="Pubblica" onClick={this.createReview} />
							</div>
						</div>
					</div>
				</Dialog>
		);
	}

}

export default ReviewCreateUpdateDialog;

ReviewCreateUpdateDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	review: PropTypes.object,
};
