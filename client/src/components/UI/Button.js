import React from 'react';
import styles from './Button.module.css';

const Button = React.memo((props) => {
	return (
		<button
			type={props.type}
			className={`${styles['default-button']} ${props.className}`}
			disabled={props.disabled}
			onClick={props.onClick}>
			{props.children}
		</button>
	);
});

export default Button;
