import axios from "axios";

export default class SurveyDAO {

    //creazione survey - dopo averlo compilato faccio questo per salvarlo in DB
    static insertOneSurvey(survey) { return axios.post('api/surveys/store', {survey: survey}); }
    //eliminazione
    static deleteOneSurvey(surveyId) { return axios.delete('api/surveys/delete', {data: {surveyId: surveyId} }); }
    
    static getSurveyById(surveyId) { return axios.get(`/api/surveys/show-survey-by-id/${surveyId}`); }

    static getSurveysByUserId(userId) { return axios.get('api/surveys/show-surveys-by-user-id', {params: {userId: userId} }); }

    static getAllSurveysByGroupId(groupId) { return axios.get(`/api/groups/${groupId}/show-surveys-by-group-id`); }

}