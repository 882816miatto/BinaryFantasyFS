import React from "react";
import PropTypes from "prop-types";
// import { Skeleton } from "antd";
import { withRouter } from "react-router-dom";
import withLanguage from "../LanguageContext";
//import SurveyDAO from "../../DAOs/surveyDAO";

class SurveyListItem extends React.Component {
    constructor(props) {
      super(props);
      const { survey } = this.props;
      this.state = { survey };
    }

    async componentDidMount() {
        const { survey } = this.state;
        // const userId = JSON.parse(localStorage.getItem("user")).id;
        // const { groupId } = this.props;
        // const surveyId = survey.survey_id;
        this.setState({ survey });
      }

    handleSurveyClick = event => {
        const { history } = this.props;
        //const { pathname } = history.location;
        //history.push(`${pathname}/${event.currentTarget.id}`);
        //history.push(`/groups/${groupId}/activities/pending`);
        history.push(`/surveys/show-survey-by-id/${event.currentTarget.id}`);
        //SurveyDAO.getSurveyById(this.state.survey.id)
      };

    render() {
        const { survey } = this.state;
        //return survey.length ? (
            return(
          <React.Fragment>
            <div
              role="button"
              tabIndex="0"
              onKeyPress={this.handleSurveyClick}
              className="row no-gutters"
              style={{ minHheight: "7rem", cursor: "pointer" }}
              id={survey.id}
              onClick={this.handleSurveyClick}
            >
              <div className="col-2-10">
                <i
                  style={{
                    fontSize: "3rem",
                    color: "#f44336"//survey.color
                  }}
                  className="fas fa-poll center"
                />
              </div>
              <div
                className="col-6-10"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
              >
                <div className="verticalCenter">
                  <div className="row no-gutters">
                    <h1>{survey.title}</h1>
                  </div>
                </div>
              </div>
              <div
                className="col-2-10"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
              >
                <i
                  style={{ fontSize: "2rem" }}
                  className="fas fa-chevron-right center"
                />
              </div>
            </div>
          </React.Fragment>
        ) //: (
          //<Skeleton avatar active paragraph={{ rows: 1 }} />
        //);
      }
}

export default withRouter(withLanguage(SurveyListItem));

SurveyListItem.propTypes = {
  survey: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string
};
