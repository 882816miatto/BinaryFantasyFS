import axios from "axios";

export default class ActivityDAO {

    static getActivityById(activityId) {
        return axios.get(`/api/activities/get-activity-by-id/${activityId}`);
    }

}