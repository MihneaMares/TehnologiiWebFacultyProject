import './App.css';
import './index.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/UI/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AuthContext from './store/auth-context';
import { useContext } from 'react';

function App() {
	const authContext = useContext(AuthContext);
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					{authContext.isLoggedIn && <Redirect to='/profile' />}
					{!authContext.isLoggedIn && <HomePage />}
					<HomePage />
				</Route>
				{!authContext.isLoggedIn && (
					<Route path='/login'>
						<LoginPage />
					</Route>
				)}
				{!authContext.isLoggedIn && (
					<Route path='/register'>
						<RegisterPage />
					</Route>
				)}
				<Route path='/profile'>
					{authContext.isLoggedIn && <ProfilePage />}
					{!authContext.isLoggedIn && <Redirect to='/login' />}
				</Route>
				)
				<Route path='*'>
					<Redirect to='/' />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
