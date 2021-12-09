import React            from 'react';
import PropTypes        from 'prop-types';
import Texts            from '../../../Constants/Texts';
import LoadingSpinner   from '../../LoadingSpinner';
import SurveyDAO      from '../../../DAOs/surveyDAO';
import AnswerDAO      from '../../../DAOs/answerDAO';
import withLanguage   from '../../LanguageContext';
import BackNavigation         from '../../BackNavigation';
import Log            from '../../Log';
import { Typography } from '@material-ui/core';

class SurveysListScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        fetchedSurveys: false,
        surveys: []
      };
    }
    
    componentDidMount() {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        SurveyDAO.getSurveysByUserId(userId)
        .then(response => {
            const { surveys } = response.data;
            this.setState({
                fetchedSurveys: true,
                surveys
            })
        })
        .catch(error => {
            Log.error(error);
            this.setState({
                fetchedSurvey: true,
                surveys: []
            })
            
        });
    }

    render() {
        const { history } = this.props
        const { fetchedSurveys } = this.state
        return (
            fetchedSurveys ? (
            <React.Fragment>
            <BackNavigation title="texts.backNavTitle" onClick={() => history.goBack()} />
                <Typography variant="h4">I miei sondaggi</Typography>
            </React.Fragment>
            ) : ( <LoadingSpinner />)
        )
    }
}

export default withLanguage(SurveysListScreen);

SurveysListScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};
