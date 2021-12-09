import React            from 'react';
import PropTypes        from 'prop-types';
import Texts            from '../../../Constants/Texts';
import LoadingSpinner   from '../../LoadingSpinner';
import SurveyDAO      from '../../../DAOs/surveyDAO';
import AnswerDAO      from '../../../DAOs/answerDAO';
import Button         from '../../shared/Button/Button';
import withLanguage   from '../../LanguageContext';
import Log            from '../../Log';
import BackNavigation from '../../BackNavigation';
import './SurveyScreen.css';
import SurveyQuestion from '../SurveyQuestion/SurveyQuestion';
import { Snackbar }           from '@material-ui/core';

class SurveyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedActivity: false,
      snackbarOpen: false,
      answers: [],
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { surveyId } = match.params;
    SurveyDAO.getSurveyById(surveyId)
             .then((response) => {
               const { title, questions, status } = response.data;
               this.setState({
                 fetchedSurvey: true,
                 title,
                 questions,
                 status,
               });
               // initializeAnswers(questions);
             })
             .catch((error) => {
               Log.error(error);
               this.setState({
                 fetchedSurvey: true,
                 title: '',
                 questions: [],
                 status: false,
               });
             });
  }

  // initializeAnswers = (questions) => {
  //     // TODO 6: faccio a finta che la struttura dati sia:
  //     // -  ogni question ha un campo questionAnswers che è un array che contiene gli id delle risposte date tipo [1, 5, 4]
  //     const answers = {};
  //     if (questions && questions.length) {
  //         questions.forEach(question => {
  //             if (question.questionAnswers && question.questionAnswers.length) {
  //                 answers[question.id] = question.questionAnswers;
  //             }
  //         })
  //     }
  //     this.setState({
  //         answers
  //     });
  // }

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  };


  handleSave = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const { match } = this.props;
    const { surveyId } = match.params;
    const answerObj = { ...this.state.answers };
    const surveyAnswers = {
      answers: Object.keys(answerObj).map((question) => ({
        question_id: question,
        optionsSelected: answerObj[question],
      })),
      survey_id: surveyId,
      user_id: userId,
    };

    AnswerDAO.insertAnswers(surveyAnswers).then(() => {
      const { history } = this.props;
      this.setState({
        snackbarOpen: true,
      }, () => setTimeout(() => history.goBack(), 2500));
    });
  };;

  onQuestionAnswerChanged = (newAnswers, questionId) => {
    const { answers, questions } = this.state;
    if (newAnswers.length) {
      answers[questionId] = newAnswers;
    }
    else {
      delete answers[questionId];
    }

    this.setState({
      answers,
      canSave: Object.keys(answers).length === questions.length
    }, () => console.log(this.state.answers));
  }


  render() {
    const { fetchedSurvey, title, questions, status, answers, snackbarOpen, canSave } = this.state;
    const { language, history } = this.props;
    const texts = Texts[language].editActivityScreen;

    return fetchedSurvey ? (
      <React.Fragment>
        <BackNavigation title="texts.backNavTitle"
                        onClick={() => history.goBack()} />
        <div className="survey-screen__content">
          <h1>{title}</h1>
          <div className="survey-screen__questions">
            {questions.map(question => (
              <SurveyQuestion question={question}
                              key={question.id}
                              questionAnswers={answers[question.id]}
                              questionValueChanged={(newAnswers) => this.onQuestionAnswerChanged(newAnswers, question.id)} />
            ))}
          </div>
          <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                    message="Risposte inviate" />
          {status && (
            <div className="survey-screen__footer">
              <Button color="primary"
                      onClick={this.handleSave}
                      disabled={!canSave}
                      type="standard-icon"
                      label="Salva"
                      iconClass="fas fa-save" />
            </div>
          )}
        </div>
      </React.Fragment>
    ) : (<LoadingSpinner />);
  }
}

export default withLanguage(SurveyScreen);

SurveyScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};
