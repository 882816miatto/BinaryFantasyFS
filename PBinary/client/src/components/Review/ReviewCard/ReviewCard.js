import React                    from 'react';
import './ReviewCard.css';
import ReviewDots               from '../ReviewDots/ReviewDots';
import PropTypes                from 'prop-types';
import Button                   from '../../shared/Button/Button';
import Texts            		from '../../../Constants/Texts';
import withLanguage   			from '../../LanguageContext';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import ImagesViewer from '../../shared/ImagesViewer/ImagesViewer';

class ReviewCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			review: props.review,
			onEditClick: props.onEditClick,
			canShowEdit: true,
			imageGalleryOpened: false,
		};

		dayjs.extend(relativeTime);
		dayjs.extend(updateLocale)

		const { language } = props;
		const texts = Texts[language].reviewCard;

		dayjs.updateLocale('en', {
		relativeTime: {
			future: texts.futureTimeMark,
			past: texts.pastTimeMark,
			s: texts.aFewSeconds,
			m: texts.aMinute,
			mm: texts.xMinutes,
			h: texts.anHour,
			hh: texts.xHours,
			d: texts.aDay,
			dd: texts.xDays,
			M: texts.aMonth,
			MM: texts.xMonths,
			y: texts.aYear,
			yy: texts.xYears,
		}
		});
	}

	componentDidMount() {
		const userId = JSON.parse(localStorage.getItem("user")).id;
		const { review } = this.state;
		if (review) {
			this.setState({
				canShowEdit: userId === review.user_id,
			})
		}
	}

	getTimestamp = (createdAt) => {
		return !!dayjs && dayjs(createdAt).fromNow();
	}

	render() {
		const { review, onEditClick, canShowEdit, imageGalleryOpened, clickedPictureIndex } = this.state;
		const { language, history } = this.props;
    	const texts = Texts[language].reviewCard;
		return (
			<>
				<div className="review-card">
					<div className="review-card__header">
						<div className="review-card__avatar" style={{backgroundImage: 'url('+ review.user.avatar +')'}} />
						<div className="review-card__user">
							<p className="review-card__user__name">{review.user.role === 'organizer' && <i className="fas fa-user-shield"/>}<strong>{review.user.given_name}</strong></p>
							<p>{review.user.role === 'parent' ? texts.parent : texts.organizer}</p>
						</div>
						{canShowEdit ? <Button type="icon" iconClass="fas fa-pen" color="secondary" onClick={onEditClick} /> : <div></div>}
					</div>
					<div className="review-card__evaluation">
						<ReviewDots evaluation={review.evaluation} />
						<p>{this.getTimestamp(review.created_at)}</p>
					</div>
					<div className="review-card__text">
						{review.comment}
					</div>
					{!!review.images && !!review.images.length && (
						<div className="review-card__gallery">
							{review.images.map((image, i) => (
									<div key={i} 
										onClick={() => this.setState({ clickedPictureIndex: i, imageGalleryOpened: true })}
										className="review-card__gallery-item" 
										style={{ backgroundImage: 'url(' + image.path + ')'}}/>
							))}
						</div>
					)}
				</div>

				{!!review.images && !!review.images.length && clickedPictureIndex !== -1 && clickedPictureIndex !== undefined && (
					<ImagesViewer urls={review.images}
								clickedPictureIndex={clickedPictureIndex}
								open={!!imageGalleryOpened}
								onClose={() => this.setState({
									imageGalleryOpened: false,
									clickedPictureIndex: undefined
								})} />
				)}
			</>
		);
	}

}

export default withLanguage(ReviewCard);

ReviewCard.propTypes = {
	review: PropTypes.object,
	onEditClick: PropTypes.func,
};
