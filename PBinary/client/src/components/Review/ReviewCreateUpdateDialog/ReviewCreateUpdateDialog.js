import React from "react";
import { Dialog, Slide, TextField } from "@material-ui/core";
import "./ReviewCreateUpdateDialog.css";
import PropTypes from "prop-types";
import ReviewDots from "../ReviewDots/ReviewDots";
import ImagePicker from "../../shared/ImagePicker/ImagePicker";
import Button from "../../shared/Button/Button";
import ReviewDAO from "../../../DAOs/reviewDAO";
import Texts            		from '../../../Constants/Texts';
import withLanguage   			from '../../LanguageContext';
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

  convertImageRelativePathToBase64 = (relativeFilePath) => {
    // convert image relative path to base64 string
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", relativeFilePath, true);
      xhr.responseType = "blob";
      xhr.onload = function (e) {
        if (this.status === 200) {
          const reader = new FileReader();
          reader.onload = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(this.response);
        } else {
          reject(this.statusText);
        }
      };
      xhr.send();
    });
  }

  base64toFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr = new Uint8Array(n);
    while (n) {
      n -= 1;
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  createReview = async () => {
    const user_id = JSON.parse(localStorage.getItem("user")).id;
    const { match } = this.props;
    const { activityId } = match.params;
    const activity_id = activityId;
    const { evaluation, comment, images } = this.state.newReview;
    const newReview = {
      activity_id,
      user_id,
      evaluation,
      comment,
    };

    const formData = new FormData();

    Object.keys(newReview).forEach(field => {
      formData.append(field, newReview[field]);
    });

    if (images.length) {
      //if images has string is on edit
      if (images.some(i => typeof i === "string")) {
        let base64Images = [];
        // images is an array of relative paths
        // convert every image path into base64
        base64Images = await Promise.all(images.map(i => i.size ? i : this.convertImageRelativePathToBase64(i)));
        // convert base64 to file
        base64Images = base64Images.map((image, index) => {
          if (typeof image !== "string") {
            return image
          } else {
            const fileName = images[index].split("/").pop();
            return this.base64toFile(image, fileName);
          }
        });

        for (let image of base64Images) {
          formData.append("images", image);
        }
      } else {
        for (let image of images) {
          formData.append("images", image);
        }
      }
    }

    ReviewDAO.insertOneReview(formData).then(response => {
      const { onReviewCreated } = this.props;
      this.setState({
        snackbarOpen: true,
      }, () => setTimeout(() => {
        this.setState({ open: false, snackbarOpen: false });
        onReviewCreated();
      }, 2500));
    })
    //TODO in caso di errore mostrare la snackbar con l'errore senza chiudere la modale
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    const { open, newReview, snackbarOpen } = this.state;
    const { language } = this.props;
    const texts = Texts[language].reviewCreateUpdateDialog;
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
              <h1 className="center">{texts.writeReview}</h1>
            </div>
          </div>
          <div className="review-create__content">
            <h1>{texts.yourExperience}</h1>
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
              placeholder={texts.writeCommentPlaceholder}
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
            {/*{newReview.user ? (
              <Button
                label={texts.delete}
                color="error"
                onClick={this.handleDelete}
              />
            ) : (
              <div />
            )}*/}
            <div />
            <div className="review-create__footer-right">
              <Button
                label={texts.cancel}
                color="secondary"
                onClick={this.handleClose}
              />
              <Button label={texts.publish} onClick={this.createReview} />
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
          message={texts.reviewCreatedMsg} />
      </Dialog>
    );
  }
}

export default withLanguage(ReviewCreateUpdateDialog);

ReviewCreateUpdateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  review: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
  onReviewCreated: PropTypes.func,
};
