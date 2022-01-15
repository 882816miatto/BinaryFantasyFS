import React                  from 'react';
import PropTypes              from 'prop-types';
import TextField              from '@material-ui/core/TextField';
import Button                 from '../shared/Button/Button';
import BackNavigation         from '../BackNavigation';
import Texts                  from "../../Constants/Texts";
import withLanguage           from '../LanguageContext';
import './CreateSurveyScreen.css';
import SurveyDAO              from '../../DAOs/surveyDAO';
import { Snackbar }           from '@material-ui/core';
import SurveyQuestionEditable from './SurveyQuestion/SurveyQuestionEditable';

class CreateSurveyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      surveyTitle: '',
      focusedQuestionIdx: 0,
      canAddQuestion: true,
      snackbarOpen: false,
    };
  }

  onSurveyTitleChanged = (newTitle) => {
    this.setState({
      surveyTitle: newTitle,
    });
  };

  onQuestionAddClicked = () => {
    const { questions } = this.state;
    const newQuestion = {
      id: `question-${Date.now()}`,
      title: '',
      typeOfQuestion: 'radio',
      questionOptions: [],
    };
    this.setState(
      {
        questions: [...questions, newQuestion],
        focusedQuestionIdx: questions.length,
        canAddQuestion: false,
      });
  };

  onQuestionUpdated = (questionUpdated, questionIdx) => {
    const { questions } = this.state;
    questions[questionIdx] = questionUpdated;
    this.setState(
      {
        questions,
      },
      () => this.updateCanAddQuestion()
    );
  };

  updateCanAddQuestion = () => {
    let canAddQuestion = true;
    let canCreateSurvey = false;
    const { questions, surveyTitle } = this.state;

    if (questions.length) {
      // controllo che le domande inserite abbiano tutti i campi compilati prima di poter creare una nuova domanda e che ci siano almeno 2 opzioni per domanda creata
      canAddQuestion = questions.every(q => !!q.title && !!q.typeOfQuestion && q.questionOptions && q.questionOptions.length && q.questionOptions.length > 1 && q.questionOptions.every(o => !!o.value));
    }

    if (canAddQuestion && surveyTitle && questions.length) {
      canCreateSurvey = true;
    }

    this.setState({
      canAddQuestion,
      canCreateSurvey,
    });
  };

  onQuestionFocused = (questionIdx) => {
    this.setState({
      focusedQuestionIdx: questionIdx,
    });
  };

  onQuestionDelete = (questionIdx) => {
    let { questions } = this.state;
    let newQuestions = [...questions];
    newQuestions = newQuestions.filter((q, i) => i !== questionIdx);
    this.setState(
      {
        questions: [...newQuestions],
      },
      () => {
        this.updateCanAddQuestion();
      }
    );
  };

  onQuestionnaireCreate = () => {
    const { surveyTitle, questions } = this.state;
    const { match } = this.props;
    const { params } = match;
    let userId;
    const user = localStorage.getItem('user');
    if (user) {
      userId = JSON.parse(user).id;
    }
    const payload = {
      status: true,
      title: surveyTitle,
      user_id: userId,
      group_id: params.groupId,
      questions: questions.map(q => ({
        title: q.title,
        typeOfQuestion: q.typeOfQuestion,
        questionOptions: q.questionOptions.map(o => o.value),
      })),
    };
    SurveyDAO.insertOneSurvey(payload)
             .then(() => {
               const { history } = this.props;
               this.setState({
                 snackbarOpen: true,
               }, () => setTimeout(() => history.goBack(), 2500));
             });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  render() {
    const { history, language } = this.props;
    const { questions, focusedQuestionIdx, canAddQuestion, canCreateSurvey, snackbarOpen } = this.state;
    const texts = Texts[language].createSurveyScreen;
    return (
      <div className="create-survey">
        <BackNavigation title={texts.backNavTitle}
                        onClick={() => history.goBack()} />
        <div className="create-survey__content">
    {/*<h1>Creazione nuovo sondaggio</h1>*/}
          <TextField required
                     id="survey-title-field"
                     placeholder={texts.placeholderTitle}
                     variant="outlined"
                     onChange={(e) => this.onSurveyTitleChanged(e.target.value)} />
          <div className="create-survey__questions">
            {questions.map((q, i) => (
              <SurveyQuestionEditable question={q}
                                      editable
                                      key={q.id}
                                      focused={focusedQuestionIdx === i}
                                      onQuestionDelete={() => this.onQuestionDelete(i)}
                                      onQuestionUpdated={(updatedQuestion) =>
                                        this.onQuestionUpdated(updatedQuestion, i)
                                      }
                                      onQuestionFocused={() => this.onQuestionFocused(i)} />
            ))}
          </div>
          <div className="create-survey__add-question-btn">
            <Button label={texts.addQuestion}
                    type="standard-icon"
                    color="accent"
                    iconClass="fas fa-plus"
                    disabled={!canAddQuestion}
                    onClick={this.onQuestionAddClicked} />
          </div>
          <div className="create-survey__footer">
            <Button label={texts.createSurvey}
                    disabled={!canCreateSurvey}
                    onClick={this.onQuestionnaireCreate} />
          </div>
        </div>
        <Snackbar anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={this.handleSnackbarClose}
                  message={texts.createdSurveyMsg} />
      </div>
    );
  }
}

export default withLanguage(CreateSurveyScreen);

CreateSurveyScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};
