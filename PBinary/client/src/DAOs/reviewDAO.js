import axios from "axios";

export default class ReviewDAO {

    static getReviewsForActivity(activityId) { return axios.get('', {params: {activityId: activityId} }); }

    static insertOneReview(review) { return axios.post('', {review: review}); }

}