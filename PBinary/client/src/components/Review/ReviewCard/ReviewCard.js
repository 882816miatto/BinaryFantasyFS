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

class ReviewCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			review: props.review,
			onEditClick: props.onEditClick,
			canShowEdit: true // TODO: solo se l'utente loggato è l'autore della review
		};

		dayjs.extend(relativeTime);
		dayjs.extend(updateLocale)

		dayjs.updateLocale('en', {
			relativeTime: {
				future: "tra %s",
				past: "%s fa",
				s: 'qualche secondo',
				m: "un minuto",
				mm: "%d minuti",
				h: "un'ora",
				hh: "%d ore",
				d: "un giorno",
				dd: "%d giorni",
				M: "un mese",
				MM: "%d mesi",
				y: "un anno",
				yy: "%d anni"
			}
		})
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
		const { review, onEditClick, canShowEdit } = this.state;
		const { language, history } = this.props;
    	const texts = Texts[language].reviewCard;
		return (
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
								<div key={i} className="review-card__gallery-item" style={{ backgroundImage: 'url(' + image + ')'}}></div>
						))}
					</div>
				)}
			</div>
		);
	}

}

export default withLanguage(ReviewCard);

ReviewCard.propTypes = {
	review: PropTypes.object,
	onEditClick: PropTypes.func,
};
