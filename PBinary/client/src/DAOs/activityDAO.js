import axios from "axios";

export default class ActivityDAO {

    static getUnratedActivitiesForUser(userId) {
        return axios.get('/api/activities/show-activities-by-user-id', {params: {userId: userId} });
    }

    static getActivityById(activityId) {
        return axios.get(`/api/activities/get-activity-by-id/${activityId}`);
    }

}
