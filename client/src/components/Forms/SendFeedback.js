import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import useInput from '../../hooks/use-input';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import styles from './Form.module.css';
import classes from './SendFeedback.module.css';
import { AiOutlineClose } from 'react-icons/ai';
const SendFeedback = (props) => {
	const [hasSentCode, setHasSentCode] = useState(false);
	const [codeInvalid, setCodeInvalid] = useState(false);
	const [emoji, setEmoji] = useState('');
	const [showSentMessage, setShowSentMessage] = useState(false);
	const {
		value: codeValue,
		isValid: codeIsValid,
		hasError: codeHasError,
		valueChangeHandler: codeChangeHandler,
		inputBlurHandler: codeBlurHandler,
		reset: resetCode,
	} = useInput((value) => value.length === 6);

	const { isLoading, error, sendRequest } = useHttp();

	let formIsValid = false;

	if (codeIsValid) {
		formIsValid = true;
	}

	const checkActivity = (code) => {
		sendRequest(
			{
				url: `http://127.0.0.1:3000/activity/${code}`,
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json',
				},
			},
			(data) => {
				setHasSentCode(true);
			}
		);
	};

	const sendFeedbackHandler = (feedback) => {
		sendRequest(
			{
				url: `http://127.0.0.1:3000/activity/${codeValue}/${feedback}`,
				method: 'POST',
			},
			(data) => {
				switch (data.feedback.feedback) {
					case '1': {
						setEmoji('🙂');
						break;
					}
					case '-1': {
						setEmoji('😕');
						break;
					}
					case '0': {
						setEmoji('😮');
						break;
					}
					case '?': {
						setEmoji('🤔');
						break;
					}
					default: {
						setEmoji('');
						break;
					}
				}
				setShowSentMessage(true);
				setTimeout(() => setShowSentMessage(false), 1000);
			}
		);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		checkActivity(codeValue);
		if (error) {
			setCodeInvalid(true);
		}
	};

	const codeClasses = codeHasError
		? `${styles['form-control']} ${styles['invalid']}`
		: styles['form-control'];

	const sendCodeComponenet = (
		<form onSubmit={submitHandler}>
			<div className={`${styles['control-group']} ${styles['smaller-form']}`}>
				<h1 className={styles.header}>{`<Enter activity code/>`}</h1>
				<div className={codeClasses}>
					<label style={{ marginTop: '-1rem' }} htmlFor='code'>
						Code:
					</label>
					<input
						type='text'
						id='code'
						value={codeValue}
						onChange={codeChangeHandler}
						onBlur={codeBlurHandler}
					/>
					{(codeHasError || codeInvalid) && (
						<p className={styles['error-text']}>Invalid Code</p>
					)}
				</div>
				<div className={styles['form-controls']}>
					{!isLoading && (
						<Button
							style={{ marginTop: '-2rem' }}
							type='submit'
							disabled={!formIsValid}>
							Send
						</Button>
					)}
					{isLoading && <p>Loading...</p>}
				</div>
			</div>
		</form>
	);

	const sendFeedbackComponent = (
		<>
			{showSentMessage && <p className={classes['sent']}>Sent! {emoji}</p>}
			<div className={classes['container']}>
				<button onClick={() => sendFeedbackHandler('1')}>😕</button>
				<button onClick={() => sendFeedbackHandler('-1')}>🙂</button>
				<button onClick={() => sendFeedbackHandler('0')}>😮</button>
				<button onClick={() => sendFeedbackHandler('%3F')}>🤔</button>
			</div>
		</>
	);
	return (
		<Modal onClose={props.onClose}>
			<>
				<button className={styles['x-btn']} onClick={props.onClose}>
					<AiOutlineClose />
				</button>
				{!hasSentCode && sendCodeComponenet}
				{hasSentCode && sendFeedbackComponent}
			</>
		</Modal>
	);
};

export default SendFeedback;
