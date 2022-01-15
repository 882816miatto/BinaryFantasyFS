import React            from 'react';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import RadioGroup       from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio            from '@material-ui/core/Radio';
import FormGroup        from '@material-ui/core/FormGroup';
import Checkbox         from '@material-ui/core/Checkbox';
import PropTypes        from 'prop-types';
import './SurveyQuestion.css';
//import Texts            from '../../../Constants/Texts';
import withLanguage     from '../../LanguageContext';

class SurveyQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question,
      questionAnswers: props.questionAnswers,
    };
  }

  handleAnswerChange = (e, answerId) => {
    const { question, questionAnswers } = this.state;
    const { questionValueChanged } = this.props;

    let currentQuestionAnswers = [];
    if (questionAnswers) {
      currentQuestionAnswers = [...questionAnswers];
    }

    if (question.typeOfQuestion === 'radio') {
      const event = e.target.value;
      currentQuestionAnswers = [event];
    } else {
      const event = e.target.checked;
      console.log(event);
      if (
        (!currentQuestionAnswers || !currentQuestionAnswers.length) &&
        event === true
      ) {
        // se currentStateAnswers della domanda in questione è vuoto e la risposta è stata marcata come checked
        currentQuestionAnswers = [answerId];
      } else if (currentQuestionAnswers && currentQuestionAnswers.length) {
        // se currentStateAnswers della domanda in questione ha già dei valori
        if (event === true) {
          // se la risposta è stata marcata come checked
          currentQuestionAnswers.push(answerId);
        } else {
          // se la risposta è stata deselezionata
          currentQuestionAnswers = currentQuestionAnswers.filter(
            (answer) => answer !== answerId
          );
        }
      }
    }

    this.setState(
      {
        questionAnswers: [...currentQuestionAnswers],
      },
      () => questionValueChanged(this.state.questionAnswers)
    );
  };

  getCheckBoxValue = (answerId) => {
    const { questionAnswers } = this.state;
    return !!questionAnswers && questionAnswers.some((a) => a === answerId);
  };

  render() {
    //const { language } = this.props;
    // const texts = Texts[language].surveyQuestion;
    const { questionAnswers, question } = this.state;
    return (
      <div className="survey-question">
        {question.typeOfQuestion === 'radio' ? (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.title}</FormLabel>
            <RadioGroup aria-label={question.title}
                        name="controlled-radio-buttons-group"
                        value={questionAnswers ? questionAnswers[0] : ''}
                        onChange={(event) => this.handleAnswerChange(event)}>
              {question.questionOptions.map((option) => (
                <FormControlLabel key={question.id + '-' + option.id}
                                  value={option.value}
                                  control={<Radio />}
                                  label={option.value} />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
           <FormControl component="fieldset"
                        variant="standard">
             <FormLabel component="legend">{question.title}</FormLabel>
             <FormGroup>
               {question.questionOptions.map((option) => (
                 <FormControlLabel key={question.id + '-' + option.id}
                                   control={(
                                     <Checkbox checked={this.getCheckBoxValue(option.value)}
                                               onChange={(event) => this.handleAnswerChange(event, option.value)}
                                               name={option.value}
                                                />
                                   )}
                                   label={option.value}
                 />
                 ))}
             </FormGroup>
           </FormControl>
         )}
      </div>
    );
  }
}

export default withLanguage(SurveyQuestion);

SurveyQuestion.propTypes = {
  question: PropTypes.object,
  questionAnswers: PropTypes.array,
  questionValueChanged: PropTypes.func,
};
