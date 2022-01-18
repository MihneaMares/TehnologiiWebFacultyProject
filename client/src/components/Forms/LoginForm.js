import React from 'react';
import { useHistory } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import useInput from '../../hooks/use-input';
import Button from '../UI/Button';
import styles from './Form.module.css';
import AuthContext from '../../store/auth-context';
import { useContext } from 'react';
import { isEmail, isValidPassForLogin } from './validators';

const LoginForm = () => {
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
	} = useInput(isValidPassForLogin);

	const { isLoading, error, sendRequest } = useHttp();
	const authCtx = useContext(AuthContext);

	const loginHandler = async ({ email, password }) => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/login',
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json',
				},
				body: {
					email,
					password,
				},
			},
			(data) => {
				authCtx.login(data.authToken.token, data.prof);
				history.replace('/profile');
			}
		);
	};

	let formIsValid = false;

	if (emailIsValid && passIsValid) {
		formIsValid = true;
	}

	const history = useHistory();

	const switchHandler = (event) => {
		event.preventDefault();
		history.push('/register');
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			loginHandler({ email: emailValue, password: passValue });
			if (error) {
				alert(
					error.message ||
						'Something went wrong! Try another email or password!'
				);
			}
		}
		resetEmail();
		resetPass();
	};

	const emailClasses = emailHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];
	const passwordClasses = passHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];

	return (
		<form onSubmit={submitHandler}>
			<div className={styles['control-group']}>
				<h1 className={styles.header}>{`<Login/>`}</h1>
				<div className={emailClasses}>
					<label htmlFor='email'>Email</label>
					<input
						type='text'
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
						<p className={styles['error-text']}>Password is too short!</p>
					)}
				</div>
				<div className={styles['form-controls']}>
					{!isLoading && (
						<Button type='submit' disabled={!formIsValid}>
							{' '}
							Login{' '}
						</Button>
					)}
					{isLoading && <p>Loading...</p>}
					<Button
						className={styles['secondary-button']}
						type='button'
						onClick={switchHandler}>
						Create new account
					</Button>
				</div>
			</div>
		</form>
	);
};

export default LoginForm;
