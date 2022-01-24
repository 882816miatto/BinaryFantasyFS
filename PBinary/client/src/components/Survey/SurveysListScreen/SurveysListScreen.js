import React                             from 'react';
import PropTypes                         from 'prop-types';
import Texts                             from '../../../Constants/Texts';
import LoadingSpinner                    from '../../LoadingSpinner';
import SurveyDAO                         from '../../../DAOs/surveyDAO';
import AnswerDAO                         from '../../../DAOs/answerDAO';
import withLanguage                      from '../../LanguageContext';
import BackNavigation                    from '../../BackNavigation';
import Log                               from '../../Log';
import emptyStateImage                   from '../../../images/undraw_no_data_re_kwbl.svg';
import './SurveysListScreen.css';
import Button                            from '../../shared/Button/Button';
import { Dialog, DialogTitle, Snackbar } from '@material-ui/core';

class SurveysListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSurveys: false,
      surveys: [],
      surveyDeletionDialogOpen: false,
      surveyToDeleteId: undefined,
      snackbarOpen: false,
    };
  }

  componentDidMount() {
    this.fetchSurveys();
  }

  fetchSurveys = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    SurveyDAO.getSurveysByUserId(userId)
             .then(response => {
               const surveys = response.data;
               this.setState({
                 fetchedSurveys: true,
                 surveys
               });
             })
             .catch(error => {
               Log.error(error);
               this.setState({
                 fetchedSurvey: true,
                 surveys: []
               });
             });
  };

  goToSurvey = (surveyId) => {
    const { history } = this.props;
    history.push('/surveys/' + surveyId);
  };

  onDeleteSurveyClick = () => {
    const { language } = this.props;
    const texts = Texts[language].surveyListScreen;
    const { surveyToDeleteId } = this.state;
    SurveyDAO.deleteOneSurvey(surveyToDeleteId)
             .then(() => {
               this.setState({
                 snackbarOpen: true,
                 snackbarMessage: texts.surveyDeletedMessage,
                 surveyDeletionDialogOpen: false,
               });
               this.fetchSurveys();
             })
             .catch(error => {
               Log.error(error);
               this.setState({
                 snackbarOpen: true,
                 snackbarMessage: error.message,
               });
             });
  };

  onOpenSurveyDeletionDialog = (surveyToDeleteId) => {
    this.setState({
      surveyDeletionDialogOpen: true,
      surveyToDeleteId,
    });
  };

  handleDeletionDialogClose = () => {
    this.setState({
      surveyDeletionDialogOpen: false,
      surveyToDeleteId: undefined,
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  render() {
    const { history, language } = this.props;
    const { fetchedSurveys, surveys, surveyDeletionDialogOpen, snackbarOpen, snackbarMessage } = this.state;
    const texts = Texts[language].surveyListScreen;
    return (
      fetchedSurveys ? (
        <React.Fragment>
          <BackNavigation title={texts.backNavTitle}
                          onClick={() => history.goBack()} />
          <div className="surveys-list">
            {/*<h1>I miei sondaggi</h1>*/}
            {!!surveys && !!surveys.length ? (
              <div className="surveys-list__list">
                {surveys.map(group => (
                  <div className="surveys-list__group"
                       key={group.id}>
                    <h2>{group.group_name}</h2>
                    {!!group.surveys && !!group.surveys.length && group.surveys.map(s => (
                      <div className="surveys-list__survey-row"
                           key={s.id}>
                        <div className="surveys-list__survey"
                             onClick={() => this.goToSurvey(s.id)}>
                          <i className="fas fa-poll" />
                          <p>{s.title}</p>
                          <i className="fas fa-chevron-right" />
                        </div>
                        <Button type="icon"
                                iconClass="fas fa-trash"
                                color="error"
                                onClick={() => this.onOpenSurveyDeletionDialog(s.id)} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
               <div className="surveys-list__empty-state">
                 <img src={emptyStateImage} />
                 <p>{texts.noSurveys}</p>
               </div>
             )}

          </div>
          <Dialog onClose={this.handleDeletionDialogClose}
                  fullWidth={true}
                  maxWidth="md"
                  disableBackdropClick={true}
                  open={surveyDeletionDialogOpen}>
            <div className="survey-delete-dialog">
              <div className="survey-delete-dialog__header">
                <button className="transparentButton"
                        onClick={this.handleDeletionDialogClose}
                        type="button">
                  <i className="fas fa-times"></i>
                </button>
                <h2>{texts.deleteSurveyDialogTitle}</h2>
              </div>
              <div className="survey-delete-dialog__content">
                <p>{texts.deleteSurveyDialogBody}</p>
              </div>
              <div className="survey-delete-dialog__footer">
                <Button label={texts.cancelDeleteSurvey}
                        color="secondary"
                        onClick={this.handleDeletionDialogClose} />
                <Button label={texts.confirmDeleteSurvey}
                        color="error"
                        onClick={this.onDeleteSurveyClick} />
              </div>
            </div>
          </Dialog>
          <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                    message={snackbarMessage} />
        </React.Fragment>
      ) : (<LoadingSpinner />)
    );
  }
}

export default withLanguage(SurveysListScreen);

SurveysListScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};
