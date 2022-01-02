import React             from 'react';
import PropTypes         from 'prop-types';
import { Dialog, Slide } from '@material-ui/core';
import './ImagesViewer.css';
import Button            from '../Button/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up"
                ref={ref} {...props} />;
});

class ImagesViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: props.clickedPictureIndex,
      urls: props.urls, //array of images
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.clickedPictureIndex !== this.props.clickedPictureIndex) {
      this.setState({
        currentImageIndex: this.props.clickedPictureIndex,
      });
    }
  }

  handleClose = () => {
    this.props.onClose();
  };

  onBackClick = () => {
    // currentImageIndex - 1 if it is not the first image
    if (this.state.currentImageIndex > 0) {
      this.setState({
        currentImageIndex: this.state.currentImageIndex - 1,
      });
    } else {
      this.setState({
        currentImageIndex: this.state.urls.length - 1,
      });
    }
  };

  onNextClick = () => {
    // currentImageIndex +1 if it is not the last image
    if (this.state.currentImageIndex < this.state.urls.length - 1) {
      this.setState({
        currentImageIndex: this.state.currentImageIndex + 1,
      });
    } else {
      this.setState({
        currentImageIndex: 0,
      });
    }
  };

  render() {
    const { open } = this.props;
    const { urls, currentImageIndex } = this.state;
    return (
      <Dialog fullScreen
              onClose={this.handleClose}
              TransitionComponent={Transition}
              open={open}>
        <div className="image-viewer__header-container row no-gutters">
          <div className="col-2-10">
            <button type="button"
                    className="transparentButton center"
                    onClick={this.handleClose}>
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        <div className="image-viewer__image-container">
          {currentImageIndex !== -1 && currentImageIndex !== undefined && (
            <>
              <img src={urls[currentImageIndex].path}
                   alt="Image" />
              {urls.length > 1 && (
                <div className="image-viewer__navigation">
                  <Button type="icon"
                          iconClass="fas fa-chevron-left"
                          color="secondary"
                          onClick={this.onBackClick} />
                  <p>{`${currentImageIndex+1}/${urls.length}`}</p>
                  <Button type="icon"
                          iconClass="fas fa-chevron-right"
                          color="secondary"
                          onClick={this.onNextClick} />
                </div>
              )}
            </>
          )}
        </div>
      </Dialog>
    );
  }
}

export default ImagesViewer;

ImagesViewer.propTypes = {
  urls: PropTypes.array,
  clickedPictureIndex: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
