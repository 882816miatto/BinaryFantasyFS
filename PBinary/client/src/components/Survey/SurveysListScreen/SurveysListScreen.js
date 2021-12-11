import React            from 'react';
import PropTypes        from 'prop-types';
import Texts            from '../../../Constants/Texts';
import LoadingSpinner   from '../../LoadingSpinner';
import SurveyDAO      from '../../../DAOs/surveyDAO';
import AnswerDAO      from '../../../DAOs/answerDAO';
import withLanguage   from '../../LanguageContext';
import BackNavigation         from '../../BackNavigation';
import Log            from '../../Log';
import emptyStateImage from '../../../images/undraw_no_data_re_kwbl.svg'
import './SurveysListScreen.css';
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
                const surveys = response.data;
                this.setState({
                    fetchedSurveys: true,
                    surveys
                }, () => console.log(surveys))
            })
            .catch(error => {
                Log.error(error);
                this.setState({
                    fetchedSurvey: true,
                    surveys: []
                })
                
            });
    }

    goToSurvey = (surveyId) => {
        const { history } = this.props;
        history.push('/surveys/' + surveyId);
    }

    render() {
        const { history } = this.props
        const { fetchedSurveys, surveys } = this.state
        return (
            fetchedSurveys ? (
            <React.Fragment>
                <BackNavigation title="texts.backNavTitle" onClick={() => history.goBack()} />
                <div className="surveys-list">
                    <h1>I miei sondaggi</h1>
                    {!!surveys && !!surveys.length ? (
                        <div className="surveys-list__list">
                        {surveys.map(group => (
                            <div className="surveys-list__group" key={group.id}>
                                <h2>{group.group_name}</h2>
                                {!!group.surveys && !!group.surveys.length && group.surveys.map(s => (
                                    <div className="surveys-list__survey" key={s.id} onClick={() => this.goToSurvey(s.id)}>
                                        <i class="fas fa-poll" />
                                        <p>{s.title}</p>
                                        <i class="fas fa-chevron-right"></i>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    ) : (
                        <div className="surveys-list__empty-state">
                            <img src={emptyStateImage} />
                            <p>Nessun sondaggio creato</p>
                        </div>
                    )}
                    
                </div>
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
