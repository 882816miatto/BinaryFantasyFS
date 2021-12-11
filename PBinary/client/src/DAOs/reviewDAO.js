import axios from "axios";

export default class ReviewDAO {

    static getReviewsForActivity(activityId) { return axios.get(`/api/reviews/get-reviews/${activityId}`); }

    static insertOneReview(review) { return axios.post('/api/reviews/store', {review: review}); }

    static deleteReview(reviewId) { return axios.delete('/api/reviews/delete', {data: {reviewId: reviewId} }); }

}