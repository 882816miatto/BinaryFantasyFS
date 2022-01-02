module.exports = class ReviewDoc {

    constructor(doc) {

        if (!!!doc)
            throw new Error('Cannot decode an undefined review');

        if (!!!doc.activity_id || !!!doc.user_id ||
            !!!doc.evaluation) throw new Error('Missing some values for this review');

        this.activity_id = doc.activity_id;
        this.user_id = doc.user_id;
        this.evaluation = doc.evaluation;

        if (doc.comment)
            this.comment = doc.comment;

        if (doc.images) {
            this.images = doc.images;
        }

    }


    encodeForSaving() {

        const reviewLiteral = {};
        Object.getOwnPropertyNames(this).forEach(v => v ? reviewLiteral[v] = this[v] : null );
        return reviewLiteral;

    }

}