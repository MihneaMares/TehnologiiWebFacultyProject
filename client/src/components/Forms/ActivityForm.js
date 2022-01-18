import Button from '../UI/Button';
import Modal from '../UI/Modal';
import useInput from '../../hooks/use-input';
import useHttp from '../../hooks/use-http';

import { useEffect } from 'react';
import styles from './Form.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';

const ActivityFrom = (props) => {
	const {
		value: nameValue,
		isValid: nameIsValid,
		hasError: nameHasError,
		valueChangeHandler: nameChangeHandler,
		inputBlurHandler: nameBlurHandler,
		reset: resetName,
	} = useInput((value) => value.length > 3, props?.activity?.name);

	const {
		value: descriptionValue,
		isValid: descriptionIsValid,
		hasError: descriptionHasError,
		valueChangeHandler: descriptionChangeHandler,
		inputBlurHandler: descriptionBlurHandler,
		reset: resetDescription,
	} = useInput((value) => value.length > 10, props?.activity?.description);

	useEffect(() => {
		if (props.type === 'add') {
			resetDescription();
			resetName();
		}
	}, [props.type]);

	console.log(nameValue);

	const authContext = useContext(AuthContext);

	const { isLoading, error, sendRequest } = useHttp();
	let formIsValid = false;

	if (nameIsValid && descriptionIsValid) {
		formIsValid = true;
	}
	const nameClasses = nameHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];
	const descriptionClasses = descriptionHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];

	const submitFormHandler = (body) => {
		sendRequest(
			{
				url:
					(props.type === 'add' && 'http://127.0.0.1:3000/activity') ||
					(props.type === 'edit' &&
						`http://127.0.0.1:3000/activity/${props.activity.id}`),
				method:
					(props.type === 'add' && 'POST') ||
					(props.type === 'edit' && 'PATCH'),
				headers: {
					Authorization: 'Bearer ' + authContext.token,
					Accept: 'application/json',
					'Content-type': 'application/json',
				},
				body,
			},
			(data) => {
				props.type === 'add' &&
					props.onAddActivity({
						id: data.id,
						name: data.name,
						description: data.description,
					});
				props.type === 'edit' &&
					props.onEditActivity({
						id: data.id,
						name: data.name,
						description: data.description,
					});
			}
		);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			submitFormHandler({ name: nameValue, description: descriptionValue });
			if (error) {
				alert(error.message || 'Something went wrong!');
			}
		}
		resetName();
		resetDescription();
		props.onClose();
	};

	return (
		<Modal onClose={props.onClose}>
			<form onSubmit={submitHandler}>
				<div className={`${styles['control-group']} ${styles['smaller-form']}`}>
					<h1 className={styles.header}>
						{props.type === 'add' && `<Add Activity/>`}
						{props.type === 'edit' && `<Edit Activity/>`}
					</h1>
					<div className={nameClasses}>
						<label htmlFor='email'>Name</label>
						<input
							type='text'
							id='name'
							value={nameValue}
							onChange={nameChangeHandler}
							onBlur={nameBlurHandler}
						/>
						{nameHasError && (
							<p className={styles['error-text']}>
								Name should be at least 3 characters!
							</p>
						)}
					</div>
					<div className={descriptionClasses}>
						<label htmlFor='description'>Description</label>
						<textarea
							type='textarea'
							id='description'
							value={descriptionValue}
							onChange={descriptionChangeHandler}
							onBlur={descriptionBlurHandler}
						/>
						{descriptionHasError && (
							<p className={styles['error-text']}>
								Enter a longer description (10+ characters)
							</p>
						)}
					</div>
					<div className={styles['form-controls']}>
						{!isLoading && (
							<Button type='submit' disabled={!formIsValid}>
								{props.type === 'add' && 'Add Activity'}
								{props.type === 'edit' && 'Save'}
							</Button>
						)}
						{isLoading && <p>Loading...</p>}
						<Button onClick={props.onClose}>Cancel</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
};
export default ActivityFrom;
