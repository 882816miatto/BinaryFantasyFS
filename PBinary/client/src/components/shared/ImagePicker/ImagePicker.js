import React           from 'react';
import './ImagePicker.css';
import PropTypes       from 'prop-types';

class ImagePicker extends React.Component {

	constructor(props) {
		super(props);
		// TODO: ho dato per scontato che le immagini siano degli url quando sei in input
		this.state = {
			pictures: props.pictures || [],
			previews: props.pictures || [],
			multiple: true,
			imageOutput: props.imageOutput,
		};

		this.inputRef = React.createRef();
	}

	handleFilesChange = (event) => {
		this.updateImages(Array.from(event.target.files));
	};

	updateImages = (files) => {
		console.log(files)
		const newPreviews = [];
		Array.from(files).forEach(file => {
			if (typeof file !== 'string') {
				newPreviews.push(URL.createObjectURL(file));
			} else {
				newPreviews.push(file);
			}
		});
		this.setState({
			previews: newPreviews,
			pictures: files,
		}, () => {
			console.log(this.state);
			this.state.imageOutput(this.state.pictures);
		});
	}

	removeImage = (imageIndex) => {
		const currentPictures = this.state.pictures.filter((p, i) => i !== imageIndex);
		this.updateImages(currentPictures);
	}

	render() {
		const { previews } = this.state;
		return (
				<div className="image-picker">
					<input type="file" accept="image/*" multiple={true} onChange={this.handleFilesChange} ref={this.inputRef} style={{display: "none"}} />
					<div className="image-picker__opener"
					     onClick={ () => this.inputRef.current.click()}>
						<i className="far fa-image" />
					</div>
					{!!previews && !!previews.length &&
					 <div className="image-picker__gallery">
						 {previews.map((file, i) => (
								 <div className="image-picker__gallery-image" key={i} >
									 <div className="image-picker__remove-img" onClick={() => this.removeImage(i)}>
										 <i className="fas fa-times" />
									 </div>
									 <img src={file} alt="an image" />
								 </div>
						 ))}
					 </div>
					}
				</div>
		);
	}
}

export default ImagePicker;

ImagePicker.propTypes = {
	pictures: PropTypes.array,
	multiple: PropTypes.bool,
	imageOutput: PropTypes.func
};
