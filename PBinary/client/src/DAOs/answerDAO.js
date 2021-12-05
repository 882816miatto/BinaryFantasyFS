import axios from "axios";

export default class AnswerDAO {

    static getAnswerForQuestions(surveyId) { 
        return axios.get('api/answers/show-answers-by-survey-id', {params: {surveyId: surveyId} }); 
    }

    static insertOneAnswer(answer) { return axios.post('api/answers/store', {answer: answer}); }

    static insertManyAnswers(answers) { return axios.post('api/answers/store-many', {answers: answers}); }

}