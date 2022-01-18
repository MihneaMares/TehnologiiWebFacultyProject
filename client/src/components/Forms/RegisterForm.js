import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import useInput from '../../hooks/use-input';
import AuthContext from '../../store/auth-context';
import Button from '../UI/Button';
import styles from './Form.module.css';
import { isEmail, isValidPassForRegister } from './validators';

const RegisterForm = () => {
	const {
		value: nameValue,
		isValid: nameIsValid,
		hasError: nameHasErrors,
		valueChangeHandler: nameChangeHandler,
		inputBlurHandler: nameBlurHandler,
		reset: resetName,
	} = useInput((value) => value.length > 2);

	const {
		value: emailValue,
		isValid: emailIsValid,
		hasError: emailHasError,
		valueChangeHandler: emailChangeHandler,
		inputBlurHandler: emailBlurHandler,
		reset: resetEmail,
	} = useInput(isEmail);

	const {
		value: passValue,
		isValid: passIsValid,
		hasError: passHasError,
		valueChangeHandler: passChangeHandler,
		inputBlurHandler: passBlurHandler,
		reset: resetPass,
	} = useInput(isValidPassForRegister);

	let formIsValid = false;
	if (emailIsValid && passIsValid && nameIsValid) {
		formIsValid = true;
	}

	const { isLoading, error, sendRequest } = useHttp();
	const authContext = useContext(AuthContext);

	const registerProf = async ({ name, email, password }) => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/register',
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json',
				},
				body: {
					name,
					email,
					password,
				},
			},
			(data) => {
				authContext.login(data.authToken.token, data.prof);
				history.replace('/profile');
			}
		);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			registerProf({ name: nameValue, password: passValue, email: emailValue });
			if (error) {
				alert(error.message || 'Something went wrong!');
			}
		}
		resetEmail();
		resetName();
		resetPass();
	};
	const history = useHistory();

	const switchHandler = (event) => {
		event.preventDefault();
		history.push('/login');
	};

	const emailClasses = emailHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];
	const passwordClasses = passHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];
	const nameClasses = nameHasErrors
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];

	return (
		<form onSubmit={submitHandler}>
			<div className={styles['control-group']}>
				<h1 className={styles.header}>{`<Register/>`}</h1>
				<div className={nameClasses}>
					<label htmlFor='name'>Name</label>
					<input
						type='name'
						id='name'
						value={nameValue}
						onChange={nameChangeHandler}
						onBlur={nameBlurHandler}
					/>
					{nameHasErrors && (
						<p className={styles['error-text']}>Please enter a valid name!</p>
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
					/>
					{emailHasError && (
						<p className={styles['error-text']}>Please enter a valid email!</p>
					)}
				</div>
				<div className={passwordClasses}>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={passValue}
						onChange={passChangeHandler}
						onBlur={passBlurHandler}
					/>
					{passHasError && (
						<div>
							<p className={styles['error-text']}>
								Password should be at least 8 characters long
							</p>
							<p className={styles['error-text']}>
								Minimum 1 lowercase and 1 uppercase
							</p>
							<p className={styles['error-text']}>Minimum 1 number</p>
							<p className={styles['error-text']}>Minimum 1 symbol</p>
						</div>
					)}
				</div>
				<div className={styles['form-controls']}>
					{!isLoading && (
						<Button disabled={!formIsValid} type='submit'>
							Register Account
						</Button>
					)}
					{isLoading && <p>Loading...</p>}
					<Button
						className={styles['secondary-button']}
						type='button'
						onClick={switchHandler}>
						Login with existing account
					</Button>
				</div>
			</div>
		</form>
	);
};

export default RegisterForm;
