module.exports = class AnswerDoc {

    constructor(doc) {

        if (!!!doc) throw new Error('Cannot decode an undefined answer');

        if (!!!doc.question_id || !!!doc.survey_id || !!!doc.user_id || doc.optionsSelected.length === 0) 
            throw new Error('Missing some values for this answer');

        this.question_id = doc.question_id;
        this.survey_id = doc.survey_id;
        this.user_id = doc.user_id;
        this.optionsSelected = doc.optionsSelected;

    }

    encodeForSaving() {

        const answerLiteral = {};

        Object.getOwnPropertyNames(this).forEach(v => v ? answerLiteral[v] = this[v] : null );
        return answerLiteral;

    }

}