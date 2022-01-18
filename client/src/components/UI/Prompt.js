import Modal from '../UI/Modal';
import Button from '../UI/Button';
import classes from './Prompt.module.css';

const Prompt = (props) => {
	return (
		<Modal
			onClose={props.onClose}
			style={{ maxHeight: 'fit-content !important', padding: '0rem' }}>
			<div className={classes['prompt-container']}>
				<p>Are you sure you want to delete your account?</p>
				<div className={classes['btn-container']}>
					<Button className={classes['yes-btn']} onClick={props.onYes}>
						Yes
					</Button>
					<Button className={classes['no-btn']} onClick={props.onClose}>
						No
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default Prompt;
