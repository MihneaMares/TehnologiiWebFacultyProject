import React, { useState } from 'react';
import { useHistory } from 'react-router';
import SendFeedback from './Forms/SendFeedback';
import Button from './UI/Button';
import styles from './WelcomePage.module.css';

const WelcomePageContent = () => {
	const history = useHistory();
	const [isSendFeedback, setIsSendFeedback] = useState(false);
	const authHandler = () => {
		history.push('/register');
	};

	const showSendFeedback = () => {
		setIsSendFeedback(true);
	};
	const closeSendFeedback = () => {
		setIsSendFeedback(false);
	};

	return (
		<>
			{isSendFeedback && <SendFeedback onClose={closeSendFeedback} />}
			<section className={`${styles.container} ${styles['flex-center']}`}>
				<h1 className={styles['heading-primary']}>
					{'<Welcome to the Continuous Feedback App/>'}
				</h1>
				<h2 className={styles['heading-secondary']}>
					{'<Project made by team 3ToGo/>'}
				</h2>

				<div className={styles['flex-horizontal']}>
					<Button className={styles['secondary-button']} onClick={authHandler}>
						CREATE ACCOUNT
					</Button>
					<span className={styles['small-text']}>OR</span>
					<Button onClick={showSendFeedback}>SEND REACTIONS</Button>
				</div>
			</section>
		</>
	);
};

export default WelcomePageContent;
