import axios from "axios";

export default class AnswerDAO {

    static getAnswerForQuestions(surveyId) {
        return axios.get(`/api/answers/show-answers-by-survey-id/${surveyId}`);
    }

    static insertAnswers(answers) { return axios.post('/api/answers/store', {...answers}); }

}
