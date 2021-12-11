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
import './SurveyDetailScreen.css';
import SurveyQuestion from '../SurveyQuestion/SurveyQuestion';
import { Snackbar }           from '@material-ui/core';

class SurveyDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSurvey: false,
      snackbarOpen: false,
      survey: [],
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { surveyId } = match.params;


    SurveyDAO.getSurveyById(surveyId)
        .then(surveyResponse => {
            const { title } = surveyResponse.data;
            AnswerDAO.getAnswerForQuestions(surveyId)
                .then((answersResponse) => {
                    const survey = {
                        title,
                        answers: answersResponse.data
                    }
                    this.setState({
                        fetchedSurvey: true,
                        survey,
                    }, () => console.log(this.state));
                }).catch((error) => {
                    Log.error(error);
                    this.setState({
                      fetchedSurvey: true,
                      survey: undefined
                    });
                });
        })
  }

  renderOptions = (options) => {
      if (options) {
          let answers = Object.keys(options).map(optionValue => ({label: optionValue, percentage: options[optionValue]}));

          return answers.map((a) => (
              <div className="survey-detail__answer">
                <div className="survey-detail__answer-labels">
                    <div className="survey-detail__progress" style={{width: a.percentage*100 + '%'}}></div>
                    <p className="survey-detail__answer-label">{a.label}</p>
                    <p className="survey-detail__answer-percentage">{a.percentage * 100 + '%'}</p>
                </div>
              </div>
          ))
      }
  }


  render() {
    const { fetchedSurvey, survey } = this.state;
    const { language, history } = this.props;
    const texts = Texts[language].editActivityScreen;

    return fetchedSurvey && survey ? (
      <React.Fragment>
        <BackNavigation title="texts.backNavTitle"
                        onClick={() => history.goBack()} />
        <div className="survey-detail__content">
          <h1>{survey.title}</h1>
          <div className="survey-detail__questions">
            {survey.answers.map((question, i) => (
                <div className="survey-detail__question" key={Date.now()}>
                    <p>{question.title}</p>
                    <div className="survey-detail__answers">
                        {this.renderOptions(question.options)}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    ) : (<LoadingSpinner />);
  }
}

export default withLanguage(SurveyDetailScreen);

SurveyDetailScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};
