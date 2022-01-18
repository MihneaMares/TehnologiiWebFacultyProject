import { useContext } from 'react';

import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';
import useHttp from '../../hooks/use-http';

const MainNavigation = () => {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;
	const { isLoading, error, sendRequest } = useHttp();
	const history = useHistory();

	const logoutHandler = () => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/logout',
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + authCtx.token,
				},
			},
			(data) => {
				authCtx.logout();
				history.replace('/');
			}
		);
		if (error) {
			alert(error);
		}
	};

	return (
		<header className={classes.header}>
			<Link to='/'>
				<div className={classes.logo}>3 TOGO</div>
			</Link>
			<nav>
				<ul>
					{!isLoggedIn && (
						<li>
							<Link className={classes['main-button']} to='/login'>
								Login
							</Link>
						</li>
					)}
					{isLoggedIn && (
						<>
							<li>
								<Link to='/profile'>Profile</Link>
							</li>
							<li>
								{!isLoading && (
									<button
										className={classes['main-button']}
										onClick={logoutHandler}>
										Logout
									</button>
								)}
								{isLoading && <p>Loading...</p>}
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
