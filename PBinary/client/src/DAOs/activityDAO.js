import axios from "axios";

export default class ActivityDAO {

    static getUnratedActivitiesForUser(userId) { 
        return axios.get('/api/activities/show-activities-by-user-id', {params: {userId: userId} }); 
    }

}