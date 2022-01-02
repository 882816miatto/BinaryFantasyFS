import React                    from 'react';
import './ReviewsList.css';
import ReviewCard               from '../ReviewCard/ReviewCard';
import ReviewDots               from '../ReviewDots/ReviewDots';
import Button                   from '../../shared/Button/Button';
import ReviewCreateUpdateDialog from '../ReviewCreateUpdateDialog/ReviewCreateUpdateDialog';
import ReviewDAO                from '../../../DAOs/reviewDAO';
import ActivityDAO              from '../../../DAOs/activityDAO';
import Texts                    from '../../../Constants/Texts';
import withLanguage             from '../../LanguageContext';

class ReviewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      avgVote: 0,
      sort: 'new', // new, best, worst,
      createDialogOpen: false,
      reviewToEdit: {},
      userCanWriteReview: true,
    };
  }

  average = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0);

  componentDidMount() {
    this.fetchActivity();
  }

  fetchReviews = () => {
    const { match } = this.props;
    const { activityId } = match.params;
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const { userCanWriteReview } = this.state;
    let _userCanWriteReview = userCanWriteReview;

    ReviewDAO.getReviewsForActivity(activityId)
             .then(res => {
               const { data } = res;
               /*let avgVote = 0;*/
               if (data.length) {
                 /*const votes = data.map(r => r.evaluation);
                 avgVote = this.average(votes);*/
                 _userCanWriteReview = !data.some(r => r.user_id === userId);
               }

               this.setState({
                 reviews: [...data],
                 /*avgVote,*/
                 createDialogOpen: false,
                 userCanWriteReview: _userCanWriteReview,
               }, () => this.sort('new'));
             });
  };

  fetchActivity = () => {
    const { match } = this.props;
    const { activityId } = match.params;
    ActivityDAO.getActivityById(activityId)
               .then(res => {
                 const { data } = res;
                 this.setState({
                   title: data.name,
                   avgVote: data.average,
                 }, () => this.fetchReviews());
               });
  };

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
    });
  };

  handleClose = () => {
    this.setState({
      createDialogOpen: false,
      reviewToEdit: {}
    });
  };

  onReviewEdit = (review) => {
    this.setState({
      createDialogOpen: true,
      reviewToEdit:  { ...review },
    });
  };

  render() {
    const { history, language, match } = this.props;
    const texts = Texts[language].reviewList;
    const { reviews, avgVote, sort, createDialogOpen, reviewToEdit, userCanWriteReview, title } = this.state;
    return (
      <div className="reviews">
        <div className="reviews__header-container row no-gutters">
          <div className="col-2-10">
            <button type="button"
                    className="transparentButton center"
                    onClick={() => history.goBack()}>
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-5-10">
            <h1 className="center">{title}</h1>
          </div>
        </div>

        <div className="reviews__content">
          <h1 className="reviews__title">{texts.reviews} ({reviews.length})</h1>
          {
            reviews && reviews.length ?
            (
              <div>
                <div className="reviews__avg">
                  <div>
                    <ReviewDots evaluation={+avgVote} />
                    <p>{texts.avgVote}: {avgVote}</p>
                  </div>
                  <Button disabled={!userCanWriteReview}
                          label={texts.writeReviewBtn}
                          onClick={() => this.onReviewCreate()} />
                </div>
                <div className="reviews__sort">
                  <p>{texts.orderBy}:</p>
                  <div onClick={() => this.sort('new')}
                       className={sort === 'new' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>{texts.mostRecent}
                  </div>
                  <div onClick={() => this.sort('best')}
                       className={sort === 'best' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>{texts.best}</div>
                  <div onClick={() => this.sort('worst')}
                       className={sort === 'worst' ? 'reviews__sort__button reviews__sort__button--active' : 'reviews__sort__button'}>{texts.worst}</div>
                </div>
                <div className="reviews__list">
                  {reviews.map((review, i) => (
                    <ReviewCard onEditClick={() => this.onReviewEdit(review)}
                                review={review}
                                key={'card-review-' + i} />
                  ))}
                </div>
              </div>
            ) :
            (
              <div className="reviews__content reviews__empty-state">
                <Button disabled={!userCanWriteReview}
                        label={texts.writeReviewBtn}
                        onClick={() => this.onReviewCreate()} />
              </div>
            )
          }
        </div>

        <ReviewCreateUpdateDialog match={match}
                                  open={createDialogOpen}
                                  review={reviewToEdit}
                                  onClose={this.handleClose}
                                  onReviewCreated={this.fetchActivity} />

      </div>
    );
  }
}

export default withLanguage(ReviewsList);