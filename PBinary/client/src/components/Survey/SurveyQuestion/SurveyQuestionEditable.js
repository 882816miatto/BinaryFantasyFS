import React                   from 'react';
import PropTypes, { objectOf } from 'prop-types';
import TextField               from '@material-ui/core/TextField';
import Radio                   from '@material-ui/core/Radio';
import RadioGroup              from '@material-ui/core/RadioGroup';
import FormControlLabel        from '@material-ui/core/FormControlLabel';
import FormControl             from '@material-ui/core/FormControl';
import AddIcon                 from '@material-ui/icons/Add';
import Button                  from '../../shared/Button/Button';
import IconButton              from '@material-ui/core/IconButton';
import DeleteIcon              from '@material-ui/icons/Delete';
import withLanguage            from '../../LanguageContext';
import './SurveyQuestionEditable.css';

class SurveyQuestionEditable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question,
      editable: props.editable,
      focused: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { focused } = this.state;
    if (nextProps.focused !== focused) {
      this.setState({
        focused: nextProps.focused,
      });
    }
    return true;
  }

  onLostFocus = () => {
    console.log('lost focus on question');
    this.setState({
      focused: false,
    });
  };

  onGainedFocus = () => {
    const { onQuestionFocused } = this.props;
    this.setState(
      {
        focused: true,
      },
      () => onQuestionFocused()
    );
  };

  onQuestionFieldChange = (newValue, field) => {
    const { question } = this.state;
    question[field] = newValue;
    this.questionUpdated(question);
  };

  onAddOptionClick = () => {
    const { question } = this.state;
    const newOption = {
      id: question.questionOptions.length + 1,
      value: '',
    };
    if (!question.questionOptions) {
      question.questionOptions = [];
    }
    question.questionOptions.push(newOption);
    this.questionUpdated(question);
  };

  onAnswerOptionValueChange = (newValue, optionIndex) => {
    const { question } = this.state;
    if (question.questionOptions) {
      question.questionOptions[optionIndex].value = newValue;
    }
    this.questionUpdated(question);
  };

  questionUpdated = (question) => {
    this.setState(
      {
        question,
      },
      () => this.props.onQuestionUpdated(question)
    );
  };

  onAnswerOptionDelete = (optionIdx) => {
    const { question } = this.state;
    if (question.questionOptions) {
      question.questionOptions = question.questionOptions.filter(
        (o, i) => i !== optionIdx
      );
    }
    this.questionUpdated(question);
  };

  onDeleteQuestionClick = () => {
    this.props.onQuestionDelete();
  };

  render() {
    const { focused, question, editable } = this.state;
    return (
      <>
        {/* <OutsideAlerter onOutsideClick={e => this.onLostFocus(e) }> */}
        <div className={
          focused
          ? 'survey-question survey-question--focused'
          : 'survey-question'
        }
             onClick={this.onGainedFocus}>
          {focused && editable ? (
            <div className="survey-question__form">
              <TextField required
                         onChange={(e) =>
                           this.onQuestionFieldChange(e.target.value, 'title')
                         }
                         id="survey-title-field"
                         placeholder="Titolo domanda"
                         defaultValue={question.title}
                         variant="standard" />
              <FormControl component="fieldset">
                <RadioGroup row
                            name="controlled-radio-buttons-group"
                            value={question.typeOfQuestion}
                            onChange={(event) =>
                              this.onQuestionFieldChange(
                                event.target.value,
                                'typeOfQuestion'
                              )
                            }>
                  <FormControlLabel value="radio"
                                    control={<Radio />}
                                    label="Scelta singola" />
                  <FormControlLabel value="checkBox"
                                    control={<Radio />}
                                    label="Scelta multipla" />
                </RadioGroup>
              </FormControl>

              {!!question.questionOptions &&
               !!question.questionOptions.length &&
               question.questionOptions.map((o, i) => (
                 <div className="survey-question__answer-option"
                      key={o.id}>
                   <div className={
                     question.typeOfQuestion === 'radio'
                     ? 'survey-question__radio-circle'
                     : 'survey-question__checkbox-square'
                   } />
                   <TextField required
                              onChange={(e) =>
                                this.onAnswerOptionValueChange(e.target.value, i)
                              }
                              placeholder={`Testo opzione ${i + 1}`}
                              defaultValue={o.value}
                              variant="standard" />
                   <i className="fas fa-times"
                      onClick={() => this.onAnswerOptionDelete(i)} />
                 </div>
               ))}

              <div className="survey-question__footer">
                <Button color="secondary"
                        type="standard-icon"
                        onClick={this.onAddOptionClick}
                        label="Aggiungi opzione"
                        iconClass="fas fa-plus" />
                <Button color="error"
                        type="icon"
                        onClick={this.onDeleteQuestionClick}
                        iconClass="fas fa-trash" />

              </div>
            </div>
          ) : (
             <div className="survey-question__not-focused">
               {question.title || question.questionOptions.length ? (
                 <>
                   <p className={!question.title ? 'error-text' : ''}>{question.title || 'No title'}</p>
                   <div className="survey-question__options">
                     {editable ? (
                       <>
                         {!!question.questionOptions &&
                          !!question.questionOptions.length &&
                          question.questionOptions.map((o, i) => (
                            <div className="survey-question__answer-option survey-question__answer-option--not-focused"
                                 key={o.id}>
                              <div className={
                                question.typeOfQuestion === 'radio'
                                ? 'survey-question__radio-circle'
                                : 'survey-question__checkbox-square'
                              } />
                              <p className={!o.value ? 'error-text' : ''}>{o.value || 'No text'}</p>
                            </div>
                          ))}
                       </>
                     ) : (
                        <div>
                          TODO: visualizzazione dell'utente che fa il sondaggio piu
                          visualizzazione del creatore del sondaggio con percentuali </div>
                      )}
                   </div>
                 </>) : <div className="survey-question__empty"><p><i className="fas fa-exclamation-circle" /> Domanda vuota, click per modificare</p></div>}
             </div>
           )}
        </div>
        {/* </OutsideAlerter> */}
      </>
    );
  }
}

export default withLanguage(SurveyQuestionEditable);

SurveyQuestionEditable.propTypes = {
  question: PropTypes.object,
  editable: PropTypes.bool,
  onQuestionUpdated: PropTypes.func,
  onQuestionFocused: PropTypes.func,
  onQuestionDelete: PropTypes.func,
  focused: PropTypes.bool,
};
