class QuestionDoc {

    constructor(doc) {

        if (!!!doc) throw new Error('Cannot create an undefined question');

        if (!!!doc.title || (doc.typeOfQuestion !== 'radio' && doc.typeOfQuestion !== 'checkBox') ||
            doc.questionOptions.length === 0) throw new Error('Invalid question');

        this.title = doc.title;
        this.typeOfQuestion = doc.typeOfQuestion;
        this.questionOptions = doc.questionOptions;

    }

    encodeForSaving() {

        const questionLiteral = {};
        Object.getOwnPropertyNames(this).forEach(v => v ? questionLiteral[v] = this[v] : null );
        return questionLiteral;

    }

}

module.exports = class SurveyDoc {

    constructor(doc) {

        if (!!!doc)
            throw new Error('Cannot create an undefined survey');

        if (!!!doc.status || !!!doc.title || !!!doc.user_id || !!!doc.group_id ||
            doc.questions.length === 0) throw new Error('Missing some values for this survey');

        this.status = doc.status,
        this.title = doc.title;
        this.user_id = doc.user_id;
        this.group_id = doc.group_id;

        this.questions = doc.questions.map(v => new QuestionDoc(v));

    }

    encodeForSaving() {

        const surveyLiteral = {};

        Object.getOwnPropertyNames(this).forEach(v => v !== 'questions' ? surveyLiteral[v] = this[v] : null );
        surveyLiteral.questions = this.questions.map(v => v.encodeForSaving())
        return surveyLiteral;

    }

}