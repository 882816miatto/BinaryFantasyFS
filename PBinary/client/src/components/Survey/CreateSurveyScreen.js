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
import './CreateSurveyScreen.css';
import SurveyQuestion from "./SurveyQuestion";

class CreateSurveyScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          questions: [],
          focusedQuestionIdx: 0,
        }
    }

    onQuestionAddClicked = () => {
      console.log('new empty question incoming');
      const newQuestion = {
        id: 'tmp-id-' + this.state.questions.length+1,
        title: '',
        typeOfQuestion: 'radio',
        questionOptions: [],
      }
      this.setState({
        questions: [...this.state.questions, newQuestion],
        focusedQuestionIdx: this.state.questions.length,
      }, () => console.log(this.state.questions))
    }

    onQuestionUpdated = (questionUpdated, questionIdx) => {
      const { questions } = this.state;
      questions[questionIdx] = questionUpdated;
      this.setState({
        questions,
      })
    }

    onQuestionFocused = (questionIdx) => {
      this.setState({
        focusedQuestionIdx: questionIdx,
      })
    }

    onQuestionDelete = (questionIdx) => {
      const { questions } = this.state;
      let newQuestions = [...questions];
      newQuestions = newQuestions.filter((q, i) => i !== questionIdx);
      this.setState({
        questions: [...newQuestions],
      }, () => {console.log(this.state)})
    }

    render() {
        const { history } = this.props;
        const { questions, focusedQuestionIdx } = this.state;
        return(
            <div className="create-survey">
              <BackNavigation
                title={"texts.backNavTitle"}
                onClick={() => history.goBack()}
              />
              <h1>Creazione nuovo sondaggio</h1>
              <TextField
                required
                id="survey-title-field"
                label="Titolo sondaggio"
                variant="outlined"
              />
              <div className="create-survey__questions">
                {questions.map((q, i) => (
                  <SurveyQuestion 
                    question={q}
                    editable={true} 
                    key={q.id} 
                    focused={focusedQuestionIdx === i}
                    onQuestionDelete={() => this.onQuestionDelete(i)}
                    onQuestionUpdated={(updatedQuestion) => this.onQuestionUpdated(updatedQuestion, i)}
                    onQuestionFocused={() => this.onQuestionFocused(i)}/>
                ))}
              </div>
              <Button id="add-question-btn" variant="contained" onClick={this.onQuestionAddClicked} startIcon={<AddIcon />}> 
                Aggiungi domanda
              </Button>
              <div className="create-survey__footer">
                <Button variant="contained" onClick={this.renderQuestion} startIcon={<SaveIcon />}> 
                  Crea sondaggio
                </Button>
              </div>
          </div>
        )
    }
}

export default withLanguage(CreateSurveyScreen);

CreateSurveyScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};