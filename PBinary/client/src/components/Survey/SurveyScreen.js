import React from "react";
import PropTypes from "prop-types";
import withLanguage from "../LanguageContext";
import Texts from "../../Constants/Texts";
import LoadingSpinner from "../LoadingSpinner";
import Typography from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import SurveyDAO from "../../DAOs/surveyDAO";
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Log from "../Log";

class SurveyScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchedActivity: false,
            answers: []
        };
    }

    componentDidMount() {
        const { match } = this.props;
        const { surveyId } = match.params;
        SurveyDAO.getSurveyById(surveyId).then(response => {
            const { title, questions, status } = response.data;
            this.setState({
                fetchedSurvey: true,
                title,
                questions,
                status
            });
            //initializeAnswers(questions);
        })
        .catch(error => {
            Log.error(error);
            this.setState({
                fetchedSurvey: true,
                title: "",
                questions: [],
                status: false
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

    handleQuestionChange = (e, question, answerId) => {

        const currentStateAnswers = this.state.answers;
        if (question.typeOfQuestion === 'radio') {
            const event = e.target.value;
            currentStateAnswers[question.id] = [event];
        } 
        else {
            const event = e.target.checked;
            if ((!currentStateAnswers[question.id] || !currentStateAnswers[question.id].length) && event === true) {
                // se currentStateAnswers della domanda in questione è vuoto e la risposta è stata marcata come checked
                currentStateAnswers[question.id] = [answerId];
            } 
            else if (currentStateAnswers[question.id] && currentStateAnswers[question.id].length) {
                // se currentStateAnswers della domanda in questione ha già dei valori
                if (event === true) {
                    // se la risposta è stata marcata come checked
                    currentStateAnswers[question.id].push(answerId);
                } 
                else {
                    // se la risposta è stata deselezionata
                    currentStateAnswers[question.id] = currentStateAnswers[question.id].filter(answer => answer !== answerId);
                }
            }
        }
        
        this.setState({
            answers: currentStateAnswers
        });
    }

    handleSave = () => {

    }

    getRadioValue = (questionId) => {
        return !!this.state.answers[questionId] && this.state.answers[questionId][0];
    }

    getCheckBoxValue = (questionId, answerId) => {
        return !!this.state.answers[questionId] && this.state.answers[questionId].some(a => a === answerId);
    }

    render() {

        const {
            fetchedSurvey,
            title,
            questions,
            status
          } = this.state;
          const { language, history } = this.props;
          const texts = Texts[language].editActivityScreen;

        return fetchedSurvey ? (
            <React.Fragment>
            <Typography variant="h4">{title}</Typography>
                {questions.map((question, index) => (
                    <Card>
                        <CardContent>
                            {question.typeOfQuestion === "radio" ? 
                                (
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">{question.title}</FormLabel>
                                        <RadioGroup
                                            id={question.id}
                                            aria-label={question.title}
                                            name="controlled-radio-buttons-group"
                                            value={this.getRadioValue(question.id)}
                                            onChange={(event) => this.handleQuestionChange(event, question)}
                                        >
                                        {question.questionOptions.map((option, index) => (
                                            <FormControlLabel value={option.id} control={<Radio />} label={option.value} />
                                        ))}
                                        </RadioGroup>
                                    </FormControl>
                                ) : (
                                    <FormControl component="fieldset" variant="standard">
                                        <FormLabel component="legend">{question.title}</FormLabel>
                                        <FormGroup>
                                            {question.questionOptions.map((option, index) => (
                                                    <FormControlLabel
                                                    control={
                                                        <Checkbox 
                                                            checked={this.getCheckBoxValue(question.id, option.id)} 
                                                            onChange={(event) => this.handleQuestionChange(event, question, option.id)} 
                                                            name={option} 
                                                        />
                                                    }
                                                    label={option.value}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                )
                            }
                        </CardContent>
                    </Card>
                ))}
                <Divider />
                <Button variant="contained" color="success" onClick={this.handleSave} endIcon={<SaveIcon />}> 
                    Save
                </Button>
            </React.Fragment>
        ) : (
            <LoadingSpinner />
        );
    }
}

export default withLanguage(SurveyScreen);

SurveyScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object
};