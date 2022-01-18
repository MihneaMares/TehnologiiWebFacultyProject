import Modal from './UI/Modal';
import Button from './UI/Button';
import classes from './ActivityLink.module.css';

const ActivityLink = (props) => {
	const copyHandler = () => {
		navigator.clipboard.writeText(props.code);
		props.onClose();
	};
	return (
		<Modal
			onClose={props.onClose}
			style={{ maxHeight: 'fit-content !important', padding: '0rem' }}>
			<div className={classes['link-container']}>
				<p>Share this code!</p>
				<p className={classes['code']}>{props.code}</p>
				<Button className={classes['copy-btn']} onClick={copyHandler}>
					Copy
				</Button>
			</div>
		</Modal>
	);
};

export default ActivityLink;
