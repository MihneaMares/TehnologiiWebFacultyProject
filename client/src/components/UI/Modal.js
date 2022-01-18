import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

const Backdrop = (props) => {
	return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
	return (
		<div className={classes.modal}>
			<div className={classes.content} style={props.style ? props.style : {}}>
				{props.children}
			</div>
		</div>
	);
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
	return (
		<>
			{ReactDOM.createPortal(
				<Backdrop onClose={props.onClose} />,
				portalElement
			)}
			{ReactDOM.createPortal(
				<ModalOverlay style={props.style}>{props.children}</ModalOverlay>,
				portalElement
			)}
		</>
	);
};

export default Modal;
