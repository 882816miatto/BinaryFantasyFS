import React from "react";
import { Dialog, Slide, TextField } from "@material-ui/core";
import "./ReviewCreateUpdateDialog.css";
import PropTypes from "prop-types";
import ReviewDots from "../ReviewDots/ReviewDots";
import ImagePicker from "../../shared/ImagePicker/ImagePicker";
import Button from "../../shared/Button/Button";
import ReviewDAO from "../../../DAOs/reviewDAO";
import { Snackbar } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ReviewCreateUpdateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onClose: this.props.onClose,
      open: this.props.open,
      newReview: this.props.review ? this.props.review : {},
      snackbarOpen: false,
    };
  }

  handleClose = () => {
    this.setState(
      {
        newReview: {},
      },
      () => this.state.onClose()
    );
  };

  /*handleListItemClick = (value) => {
    this.state.onClose(value);
  };*/

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.open !== this.state.open) {
      this.setState({
        open: !!nextProps.open,
      });
    }
    if (nextProps.review !== this.state.newReview) {
      this.setState({
        newReview: nextProps.review,
      });
    }
    return true;
  }

  onReviewFieldChanged = (field, value) => {
    let { newReview } = this.state;
    if (!newReview) {
      newReview = {};
    }
    newReview[field] = value;
    this.setState({
      newReview,
    });
  };

  createReview = () => {
    const user_id = JSON.parse(localStorage.getItem("user")).id;
    const { match } = this.props;
    const { activityId } = match.params;
    const activity_id = activityId;
    const {evaluation, comment} = this.state.newReview;
    const newReview = {
      activity_id,
      user_id,
      evaluation,
      comment,
    };

    ReviewDAO.insertOneReview(newReview).then(response => {
      const { onReviewCreated } = this.props;
      this.setState({
        snackbarOpen: true,
      }, () => setTimeout(() => {
        this.setState({open: false});
        onReviewCreated();
      }, 2500));
    })
    //TODO in caso di errore mostrare la snackbar con l'errore senza chiudere la modale
  };

  handleDelete = () => {
    // TODO
  };

  deleteReview = () => {
    // TODO
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    const { open, newReview, snackbarOpen } = this.state;
    return (
      <Dialog
        fullScreen
        onClose={this.handleClose}
        TransitionComponent={Transition}
        open={open}
      >
        <div className="review-create">
          <div className="review-create__header-container row no-gutters">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleClose}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="col-5-10">
              <h1 className="center">Scrivi recensione</h1>
            </div>
          </div>
          <div className="review-create__content">
            <h1>La tua esperienza</h1>
            <ReviewDots
              editable
              evaluation={newReview ? newReview.evaluation : 0}
              dotsOutput={(e) => this.onReviewFieldChanged("evaluation", e)}
            />
            <TextField
              id="outlined-multiline-static"
              multiline
              variant="outlined"
              defaultValue={newReview ? newReview.comment : ""}
              placeholder="Scrivi una recensione..."
              onChange={(e) =>
                this.onReviewFieldChanged("comment", e.target.value)
              }
              rows={8}
            />
            <ImagePicker
              pictures={newReview ? newReview.images : []}
              imageOutput={(e) => this.onReviewFieldChanged("images", e)}
            />
          </div>
          <div className="review-create__footer">
            {newReview.user ? (
              <Button
                label="Elimina"
                color="error"
                onClick={this.handleDelete}
              />
            ) : (
              <div />
            )}
            <div className="review-create__footer-right">
              <Button
                label="Annulla"
                color="secondary"
                onClick={this.handleClose}
              />
              <Button label="Pubblica" onClick={this.createReview} />
            </div>
          </div>
        </div>
        <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message="Recensione creata" />
      </Dialog>
    );
  }
}

export default ReviewCreateUpdateDialog;

ReviewCreateUpdateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  review: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
  onReviewCreated: PropTypes.func,
};
