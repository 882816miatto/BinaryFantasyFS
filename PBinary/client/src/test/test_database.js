import axios from "axios";

function colorLog(message, color) {

    color = color || "black";

    switch (color) {
        case "success":  
             color = "Green"; 
             break;
        case "info":     
             color = "DodgerBlue";  
             break;
        case "error":   
             color = "Red";     
             break;
        case "warning":  
             color = "Orange";   
             break;
        default: 
             color = color;
    }

    console.log("%c" + message, "color:" + color);
}

const sendTo = function(url, document) {
    return axios.post(url, document);
}
  
const createQuestion = function(title, type, options) {

    return {
        title: title,
        typeOfQuestion: type,
        questionOptions: options
    };

}
  
const createSurvey = function(status, title, user_id, email,
    group_id) {

    let q1 = createQuestion('question1', 'radio', ['op1', 'op2'])
    let q2 = createQuestion('question2', 'checkBox', ['op1', 'op2'])

    return {

        status: status,
        title: title,
        user_id: user_id,
        email: email,
        group_id: group_id,
        questions: [q1, q2]

    };
  
}

function createReview(activity_id, user_id, user_email, evaluation) {

    return {
        activity_id: activity_id,
        user_id: user_id,
        evaluation: evaluation
    };

}

// Preliminar database testing

async function test_creazioneSondaggio() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/survey', survey);
        colorLog('Test 1: creazione del sondaggio riuscito con successo', 'success');

    } catch (err) { colorLog('Test 1: creazione del sondaggio non riuscito', 'error'); }

}

async function test_cancellazioneSondaggio() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/deleteSurvey', survey);
        colorLog('Test 2: cancellazione del sondaggio riuscito con successo', 'success');

    } catch (err) { colorLog('Test 2: cancellazione del sondaggio non riuscito', 'error'); }

}

async function test_operazioniVarie() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/survey', survey);
        let surveyInserted = await sendTo('/api/tests/getSurvey', {group_id: survey.group_id});
        surveyInserted = surveyInserted.data;

        await sendTo('/api/tests/insertDeleteSurveyAndAnswer', {
            data: [{
            optionsSelected: ['op1'],
            question_id: surveyInserted.questions[0]._id,
            survey_id: surveyInserted._id,
            user_id: 'ZioTreno'}]
        })

        colorLog('Test 3: inserimento e cancellazione di sondaggi e risposte riuscito con successo', 'success');

    } catch (err) { colorLog('Test 3: inserimento e cancellazione di sondaggi e risposte non riuscito', 'error'); }

}

async function test_creazioneRecensione() {

    const activity_id = 'activity_id';
    const user_id = 'user_id';
    const user_email = 'user_email';
    const evaluation = 5;

    const review = createReview(activity_id, user_id, user_email, evaluation);

    try {

        await sendTo('/api/tests/insertReview', review);
        colorLog('Test 4: creazione della recensione riuscita con successo', 'success');

    } catch (e) { colorLog('Test 4: creazione della recensione non riuscita', 'error'); }
    
}

async function test_axiosDelete() {

    try {

        await axios.delete('/api/tests/deleteTrial', {data: {s: 'Stringa_di_dati'} });
        colorLog('Test 5: testing di una chiamata delete riuscito con successo', 'success');

    } catch (e) { colorLog('Test 5: testing di una chiamata delete non riuscito', 'error'); }

}

async function test_axiosGet() {

    try {
        await axios.get('/api/tests/getTrial', {params: {answer: [42, 67]} });
        colorLog('Test 6: testing di una chiamata get riuscito con successo', 'success');
    } catch (e) { colorLog('Test 6: testing di una chiamata get non riuscito', 'error'); }

}

async function test_creazioneSondaggiPerTesting() {

    const manySurveys = [];

    const s1 = {

        status: true,
        title: 'survey1',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'albero', 'fontana',
                'giardino', 'formica'
            ]
        }]

    };

    const s2 = {

        status: true,
        title: 'survey2',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',

        questions: [
        {
            title: 'question1',
            typeOfQuestion: 'checkBox',
            questionOptions: [
                'Enrico', 'Simone',
                'Eleanor', 'Rigby'
            ]
        },
    
        {
            title: 'question2',
            typeOfQuestion: 'radio',
            questionOptions: [
                'Giallo', 'Rosso',
                'Verde', 'Arancione'
            ]
        }]

    };

    const s3 = {

        status: true,
        title: 'survey3',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]
        }]

    };

    const s4 = {

        status: true,
        title: 'survey4',
        user_id: 'simone',
        email: 'simoneBiondo@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]
        }]

    };

    const survey = {

        status: true,
        title: 'Survey Di prova per le risposte',
        user_id: 'Simone Biondo',
        email: 'simoneBiondo@gmail.com',
        group_id: 'gId',

        questions: [{
            
            title: 'Domanda 1',
            typeOfQuestion: 'radio',

            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]}, {

                title: 'Domanda 2',
                typeOfQuestion: 'checkBox',
    
                questionOptions: [
                    'Zio', 'Nonna',
                    'Zia', 'Nonno'
                ]
        }]

    };

    const survey_ = {

        status: true,
        title: 'Survey Di prova per le risposte',
        user_id: 'Simone Biondo_',
        email: 'simoneBiondo@gmail.com',
        group_id: 'gId',

        questions: [{
            
            title: 'Domanda 1',
            typeOfQuestion: 'radio',

            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]}, {

                title: 'Domanda 2',
                typeOfQuestion: 'checkBox',
    
                questionOptions: [
                    'Zio', 'Nonna',
                    'Zia', 'Nonno'
                ]
        }]

    };

    manySurveys.push(s1, s2, s3, s4, survey, survey_);

    try {

        await axios.post('/api/tests/create-surveys', {data: manySurveys});
        colorLog("Test 7: creazione di vari sondagi riuscita con successo", 'success');

    } catch (e) { colorLog("Test 7: creazione di vari sondaggi no riuscita", 'error'); }

}

async function test_creazioneRispostePerTesting() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

        let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        const id = response.data[0].id;
        response = await axios.get(`/api/tests/show-survey-by-id/${id}`);

        const a1 = {

            optionsSelected: [ 'pallone', 'spada'],

            question_id: response.data.questions[0]._id,
            survey_id: id,
            user_id: 'Enrico'

        };

        const a2 = {

            optionsSelected: ['spada'],

            question_id: response.data.questions[0]._id,
            survey_id: id,
            user_id: 'Simone'

        };

        const insertMany = [a1, a2];

        await axios.post('/api/tests/create-answers', insertMany);
        colorLog('Test 11: inserimento di alcune riposte riuscito con successo', 'success');
 
    } catch (e) { colorLog('Test 11: inserimento di alcune riposte non riuscito', 'error'); }

    try {

        const groupId2 = 'gId';
        const userId2 = 'Simone Biondo';

        let response2 = await axios.get(`/api/tests/show-surveys/${groupId2}/${userId2}`);
        const id2 = response2.data[0].id;
        response2 = await axios.get(`/api/tests/show-survey-by-id/${id2}`);

        const a101 = {

            optionsSelected: ['pallone', 'bici'],

            question_id: response2.data.questions[0]._id,
            survey_id: id2,
            user_id: 'Simone Biondo'

        };

        const a102 = {

            optionsSelected: ['Zio', 'Zia'],

            question_id: response2.data.questions[1]._id,
            survey_id: id2,
            user_id: 'Simone Biondo'

        };

        const insertManyAns = [a101, a102];

        await axios.post('/api/tests/store-answers', {answers: insertManyAns});
        colorLog('Test 11.1: riuscito con successo', 'success');

    } catch (e) { colorLog('Test 11.1: non riuscito', 'error'); } 

    try {

        const groupId2 = 'gId';
        const userId2 = 'Simone Biondo_';

        let response2 = await axios.get(`/api/tests/show-surveys/${groupId2}/${userId2}`);
        const id2 = response2.data[0].id;

        response2 = await axios.get(`/api/tests/show-survey-by-id/${id2}`);

        const a101 = {

            optionsSelected: ['pallone_', 'bici'],

            question_id: response2.data.questions[0]._id,
            survey_id: id2,
            user_id: 'Simone Biondo'

        };

        const a102 = {

            optionsSelected: ['Zio', 'Zia'],

            question_id: response2.data.questions[1]._id,
            survey_id: id2,
            user_id: 'Simone Biondo'

        };

        const insertManyAns = [a101, a102];

        await axios.post('/api/tests/store-answers', {answers: insertManyAns});
        colorLog('Test 11.2: non riuscito', 'error');

    } catch (e) {

        colorLog('Test 11.2: riuscito con successo tramite Bad Request', 'success');

    } 

}

async function test_getSondaggio() {

    const groupId = 'gId';
    const userId = 'userTest';

    try {

        await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        colorLog('Test 8: get del sondaggio riuscito con successo', 'success');

    } catch (e) { colorLog("Test 8: get del sondaggio non riuscito", 'error'); }

}

async function test_restore() {

    try {

        await axios.get('/api/tests/delete-all');
        colorLog('Restore completato', 'success');

    } catch (e) { colorLog('Restore non completato', 'error'); }

}

async function test_getSondaggi() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

       let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
       const id = response.data[0].id;
       response = await axios.get(`/api/tests/show-survey-by-id/${id}`);

       colorLog('Test 9: get dei sondaggi riuscito con successo', 'success');

    } catch (e) {
        colorLog('Test 9: get dei sondaggi non riuscito', 'error');
    }

}

async function test_getSondaggioUtente() {

    const userId = 'userTest';

    try {

        await axios.get(`/api/tests/show-surveys-by-user-id/${userId}`);
        colorLog('Test 10: get dei sondaggi per utente riuscito con successo', 'success');

    } catch (e) {

        colorLog('Test 10: get dei sondaggi per utente non riuscito', 'error');

    }

}

async function test_eliminazioneSondaggio() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

        let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        const id = response.data[0].id;
        response = await axios.delete('/api/tests/delete-survey', {data: {surveyId: id} });
        colorLog('Test 12: cancellazione sondaggio riuscita con successo', 'success');

    } catch (e) { colorLog('Test 12: canellazione sondaggio non riuscita', 'error'); }

}

async function test_inserimentoSondaddio() {

    let surveyObj = {

        status: true,
        title: 'Un sondaggio di prova',
        user_id: 'John Benson',
        email: 'email@stud.unive.it',
        group_id: 'gId',

        questions: [{

            title: 'Domanda di prova 1',
            typeOfQuestion: 'radio',

            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]

        }, {

            title: 'Domanda di prova 2',
            typeOfQuestion: 'checkBox',

            questionOptions: [
                'Enrico', 'Simone',
                'Marika', 'Alessandro'
            ]

        }]

    }

    try {

        await axios.post('/api/tests/store', {survey: surveyObj});
        colorLog('Test 13: inserimento sondaggio riuscito con successo', 'success');

    } catch (e) { colorLog('Test 13: inserimento sondaggio non riuscito', 'error'); }

}

async function showResults() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

        let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        const id = response.data[0].id;
        response = await axios.get(`/api/tests/show-survey-by-id/${id}`);

        await axios.get(`/api/tests/show-answers-by-survey-id/${id}`);
 
    } catch (e) {
        console.error('An error occurred', e);
    }

}

async function storeReview() {

    let review = {
        activity_id: 'activityId',
        user_id: 'userId',
        evaluation: 4,
        comment: 'Questo è un commento di prova'
    };

    try { 
        await axios.post('/api/tests/store-review', {review: review});
    } catch (e) { console.error('Test store review not passed', e); }

}

async function getFromReq() {

    try {
        await axios.get('/api/tests/get-from-req')
    } catch (e) { console.error(e); }

}

async function testMember() {

    try {
        await axios.get('/api/tests/get-group-id-and-name-for-user');
    } catch (e) {
        console.error(e);
    }

}

async function handleTest() {

    try {
  
        await test_creazioneSondaggio();
        await test_cancellazioneSondaggio();
        await test_operazioniVarie();
        await test_creazioneRecensione();
        await test_axiosDelete();
        await test_axiosGet();

        await test_creazioneSondaggiPerTesting();
        await test_getSondaggio();
        await test_getSondaggi();
        await test_getSondaggioUtente();
        await test_creazioneRispostePerTesting();
        await showResults();
        await test_eliminazioneSondaggio()
        await test_inserimentoSondaddio();
        await storeReview();
        await getFromReq();
        await testMember();

        await test_restore();

    } catch (e) { console.error(e); }

}

export default handleTest;
