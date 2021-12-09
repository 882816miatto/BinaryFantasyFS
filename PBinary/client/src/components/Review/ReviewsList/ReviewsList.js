import React              from 'react';
import axios              from 'axios';
import './ReviewsList.css';
import ReviewCard         from '../ReviewCard/ReviewCard';
import ReviewDots         from '../ReviewDots/ReviewDots';
import Button                   from '../../shared/Button/Button';
import ReviewCreateUpdateDialog from '../ReviewCreateUpdateDialog/ReviewCreateUpdateDialog';

class ReviewsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reviews: [],
			avgVote: 0,
			sort: 'new', // new, best, worst,
			createDialogOpen: false,
			reviewToEdit: {},
		};
	}

	average = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0);

	componentDidMount() {
		axios.get('/api/surveys/review')
		     .then(res => {
			     const { data } = res;
			     let avgVote = 0;
			     if (data.length) {
				     const votes = data.map(r => r.evaluation);
				     avgVote = this.average(votes);
			     }
			     this.setState({
				     reviews: data,
				     avgVote
			     }, () => console.log('reviews list:', this.state.reviews));
		     });
	}

	sort = (key) => {
		let { reviews } = this.state;
		let sortedReviews = [];
		if (key === 'new') {
			sortedReviews = reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (key === 'best') {
			sortedReviews = reviews.sort((a, b) => b.evaluation - a.evaluation);
		} else {
			sortedReviews = reviews.sort((a, b) => a.evaluation - b.evaluation);
		}
		this.setState({
			...this.state,
			reviews: [],
			sort: key,
		}, () => {
			this.setState({
				...this.state,
				reviews: [...sortedReviews],
			});
		});
	};

	onReviewCreate = () => {
		this.setState({
			createDialogOpen: true,
		})
	};

	handleClose = () => {
		this.setState({
			createDialogOpen: false,
			reviewToEdit: {}
		})
	};

	onReviewEdit = (review) => {
		this.setState({
			createDialogOpen: true,
			reviewToEdit: review,
		})
	}

	render() {
		const { history } = this.props;
		const { reviews, avgVote, sort, createDialogOpen, reviewToEdit } = this.state;
		return (
				<div className="reviews">
					<div className="reviews__header-container row no-gutters">
						<div className="col-2-10">
							<button type="button" className="transparentButton center" onClick={() => history.goBack()}>
								<i className="fas fa-arrow-left" />
							</button>
						</div>
						<div className="col-5-10">
							<h1 className="center">TODO nome attività</h1>
						</div>
					</div>

					<div className="reviews__content">
						<h1 className="reviews__title">Recensioni ({reviews.length})</h1>
						{
							reviews && reviews.length ?
							(
									<div>
										<div className="reviews__avg">
											<div>
												<ReviewDots evaluation={+avgVote} />
												<p>Voto medio: {avgVote}</p>
											</div>
											<Button label={'Scrivi una recensione'} onClick={() => this.onReviewCreate()} />
										</div>
										<div className="reviews__sort">
											<p>Ordina per:</p>
											<div onClick={() => this.sort('new')} className={sort === 'new' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>Più
												recenti
											</div>
											<div onClick={() => this.sort('best')} className={sort === 'best' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>Migliori</div>
											<div onClick={() => this.sort('worst')} className={sort === 'worst' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>Peggiori</div>
										</div>
										<div className="reviews__list">
											{reviews.map((review, i) => (
													<ReviewCard onEditClick={() => this.onReviewEdit(review)} review={review} key={'card-review-' + i} />
											))}
										</div>
									</div>
							) :
							(
									<div className="reviews__content reviews__empty-state">
										<Button label={'Scrivi una recensione'} onClick={() => this.onReviewCreate()} />
									</div>
							)
						}
					</div>

					<ReviewCreateUpdateDialog
							open={createDialogOpen}
							review={reviewToEdit}
							onClose={this.handleClose}
					/>

				</div>
		);
	}
}

export default ReviewsList;
