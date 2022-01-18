import React, { useState } from 'react';

const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	user: {},
	login: (token) => {},
	logout: () => {},
});

const retriveStoredToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedUser = JSON.parse(localStorage.getItem('user'));
	return {
		token: storedToken,
		user: storedUser,
	};
};

export const AuthContextProvider = (props) => {
	const data = retriveStoredToken();
	let initialToken;
	let initialUser;
	if (data) {
		initialToken = data.token;
		initialUser = data.user;
	}
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(!!initialToken);

	const [token, setToken] = useState(initialToken);
	const [user, setUser] = useState(initialUser);

	const logoutHandler = () => {
		setToken(null);
		setUser(null);
		setUserIsLoggedIn(false);
		localStorage.clear();
	};

	const loginHandler = (token, user) => {
		setToken(token);
		setUser(user);
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		setUserIsLoggedIn(true);
	};

	const updateUserHandler = (updates) => {
		user.name = updates.name;
		user.email = updates.email;
		localStorage.setItem('user', JSON.stringify(user));
	};

	const contextVal = {
		token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
		updateUser: updateUserHandler,
		user,
	};

	return (
		<AuthContext.Provider value={contextVal}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
