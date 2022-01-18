import Button from '../UI/Button';
import Modal from '../UI/Modal';
import useInput from '../../hooks/use-input';
import useHttp from '../../hooks/use-http';

import styles from './Form.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { isEmail } from './validators';

const EditProfile = (props) => {
	const authContext = useContext(AuthContext);
	const {
		value: nameValue,
		isValid: nameIsValid,
		hasError: nameHasError,
		valueChangeHandler: nameChangeHandler,
		inputBlurHandler: nameBlurHandler,
		reset: resetName,
	} = useInput((value) => value.length > 3, authContext.user.name);

	const {
		value: emailValue,
		isValid: emailIsValid,
		hasError: emailHasError,
		valueChangeHandler: emailChangeHandler,
		inputBlurHandler: emailBlurHandler,
		reset: resetEmail,
	} = useInput((value) => isEmail(value), authContext.user.email);

	const { isLoading, error, sendRequest } = useHttp();
	let formIsValid = false;

	if (nameIsValid && emailIsValid) {
		formIsValid = true;
	}
	const nameClasses = nameHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];
	const emailClasses = emailHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];

	const editProfileHandler = (body) => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/me',
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${authContext.token}`,
					Accept: 'application/json',
					'Content-type': 'application/json',
				},
				body,
			},
			(data) => {
				console.log(data);
				props.onEditProfile(data);
				authContext.updateUser({ name: data.name, email: data.email });
			}
		);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			editProfileHandler({ name: nameValue, email: emailValue });
			if (error) {
				alert(error.message || 'Something went wrong!');
			}
		}
		resetName();
		resetEmail();
		props.onClose();
	};

	return (
		<Modal onClose={props.onClose}>
			{' '}
			<form onSubmit={submitHandler}>
				<div className={`${styles['control-group']} ${styles['smaller-form']}`}>
					<h1 className={styles.header}>{`<Edit Profile/>`}</h1>
					<div className={nameClasses}>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							id='name'
							value={nameValue}
							onChange={nameChangeHandler}
							onBlur={nameBlurHandler}
							placeholder={props?.activity?.name}
						/>
						{nameHasError && (
							<p className={styles['error-text']}>
								Name should be at least 3 characters!
							</p>
						)}
					</div>
					<div className={emailClasses}>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							id='email'
							value={emailValue}
							onChange={emailChangeHandler}
							onBlur={emailBlurHandler}
							placeholder={props?.activity?.description}
						/>
						{emailHasError && (
							<p className={styles['error-text']}>Invalid email!</p>
						)}
					</div>
					<div className={styles['form-controls']}>
						{!isLoading && (
							<Button type='submit' disabled={!formIsValid}>
								Save
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

export default EditProfile;
