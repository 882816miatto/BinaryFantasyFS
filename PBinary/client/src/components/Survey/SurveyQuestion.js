import React from "react";
import ReactDOM from 'react-dom'
import PropTypes, { objectOf } from "prop-types";
import withLanguage from "../LanguageContext";
import Texts from "../../Constants/Texts";
import LoadingSpinner from "../LoadingSpinner";
import Log from "../Log";
import BackNavigation from "../BackNavigation";
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OutsideAlerter from "./OutsideAlerter";
import DeleteIcon from '@material-ui/icons/Delete';
import './SurveyQuestion.css';

class SurveyQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          question: props.question,
          editable: props.editable,
          focused: true,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.focused !== this.state.focused) {
            this.setState({
                focused: nextProps.focused
            })
        }
        return true;
       
    }

    onLostFocus = (event) => {
        console.log('lost focus on question');
        this.setState({
            focused: false,
        });
    }

    onGainedFocus = () => {
        this.setState({
            focused: true,
        }, () => this.props.onQuestionFocused());
    }

    onQuestionFieldChange = (newValue, field) => {
        const { question } = this.state;
        question[field] = newValue;
        this.questionUpdated(question);
    }

    onAddOptionClick = () => {
        const { question } = this.state;
        const newOption = {
            id: question.questionOptions.length+1,
            value: ''
        };
        if (!question.questionOptions) {
            question.questionOptions = [];
        }
        question.questionOptions.push(newOption);
        this.questionUpdated(question);

    }

    onAnswerOptionValueChange = (newValue, optionIndex) => {
        const { question } = this.state;
        if (question.questionOptions) {
            question.questionOptions[optionIndex].value = newValue;
        }
        this.questionUpdated(question);

    }

    questionUpdated = (question) => {
        this.setState({
            question,
        }, () => this.props.onQuestionUpdated(question))
    }

    onAnswerOptionDelete = (optionIdx) => {
        const { question } = this.state;
        if (question.questionOptions) {
            question.questionOptions = question.questionOptions.filter((o, i) => i !== optionIdx);
        }
        this.questionUpdated(question);
    }

    onDeleteQuestionClick = () => {
        this.props.onQuestionDelete();
    }

    render() {
        const { focused, question, editable } = this.state;
        return(
            <>
            {/*<OutsideAlerter onOutsideClick={e => this.onLostFocus(e) }>*/}
                <div className={focused ? 'survey-question survey-question--focused' : 'survey-question'} onClick={this.onGainedFocus}>
                    {
                        focused && editable ? (
                            <div className="survey-question__form">
                                <TextField
                                    required
                                    onChange={(e) => this.onQuestionFieldChange(e.target.value, 'title')}
                                    id="survey-title-field"
                                    label="Titolo domanda"
                                    defaultValue={question.title}
                                    variant="standard"/>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        name="controlled-radio-buttons-group"
                                        value={question.typeOfQuestion}
                                        onChange={(event) => this.onQuestionFieldChange(event.target.value, 'typeOfQuestion')}>
                                        <FormControlLabel value="radio" control={<Radio />} label="Scelta singola" />
                                        <FormControlLabel value="checkBox" control={<Radio />} label="Scelta multipla" />
                                    </RadioGroup>
                                </FormControl>

                                {
                                    !!question.questionOptions && !!question.questionOptions.length && question.questionOptions.map((o, i) => (
                                        <div className="survey-question__answer-option" key={o.id}>
                                            <div className={question.typeOfQuestion === 'radio' ? "survey-question__radio-circle" : "survey-question__checkbox-square"}></div>
                                            <TextField
                                                required
                                                onChange={(e) => this.onAnswerOptionValueChange(e.target.value, i)}
                                                label={"Testo opzione " + (i+1) }
                                                defaultValue={o.value}
                                                variant="standard"/>
                                            <i className="fas fa-times" onClick={() => this.onAnswerOptionDelete(i)}></i>
                                        </div>
                                    ))
                                }
                                
                                <div className="survey-question__footer">
                                    <Button className="survey-question__add-option-btn" variant="contained" onClick={this.onAddOptionClick} startIcon={<AddIcon />}> 
                                        Aggiungi opzione
                                    </Button>
                                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={this.onDeleteQuestionClick}>
                                        <DeleteIcon />
                                    </IconButton>

                                </div>
                               
                            </div>
                        ) : (
                            <div className="survey-question__not-focused">
                                <p>{question.title}</p>
                                <div className="survey-question__options">
                                    {editable ? 
                                        <>
                                        {
                                            !!question.questionOptions && !!question.questionOptions.length && question.questionOptions.map((o, i) => (
                                                <div className="survey-question__answer-option survey-question__answer-option--not-focused" key={o.id}>
                                                    <div className={question.typeOfQuestion === 'radio' ? "survey-question__radio-circle" : "survey-question__checkbox-square"}></div>
                                                    <p>{o.value}</p>
                                                </div>
                                            ))
                                        }
                                        </> : <div>TODO: visualizzazione dell'utente che fa il sondaggio piu visualizzazione del creatore del sondaggio con percentuali</div>}
                                </div>
                            </div>
                        )
                    }
                </div>
            {/*</OutsideAlerter>*/}
            </>
        );
    }
}

export default withLanguage(SurveyQuestion);

SurveyQuestion.propTypes = {
  question: PropTypes.object,
  editable: PropTypes.bool,
  onQuestionUpdated: PropTypes.func,
  onQuestionFocused: PropTypes.func,
  onQuestionDelete: PropTypes.func,
};