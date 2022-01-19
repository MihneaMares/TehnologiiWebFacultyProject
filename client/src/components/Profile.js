import { ImUser } from 'react-icons/im';
import { FaUserEdit } from 'react-icons/fa';
import { AiOutlineUserDelete } from 'react-icons/ai';
import Button from './UI/Button';
import Prompt from './UI/Prompt';
import ActivityItem from './ActivityItem';
import classes from './Profile.module.css';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/auth-context';
import useHttp from '../hooks/use-http';
import ActivityList from './ActivityList';
import ActivityFrom from './Forms/ActivityForm';
import EditProfile from './Forms/EditProfile';
import { useHistory } from 'react-router-dom';

const Profile = () => {
	const authContext = useContext(AuthContext);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [description, setDescription] = useState('');
	const [timestamps, setTimestamps] = useState('');
	const [isActivityForm, setIsActivityForm] = useState(false);
	const [isEditProfileForm, setIsEditProfileForm] = useState(false);
	const [areYouSure, setAreYouSure] = useState(false);
	const [activities, setActivities] = useState([]);
	const [sendFeedbacksRefresh, setSendFeedbacksRefresh] = useState({});
	const { sendRequest, error, isLoading } = useHttp();

	const history = useHistory();

	useEffect(() => {
		setName(authContext?.user?.name);
		setEmail(authContext?.user?.email);
	}, [authContext.user]);

	const refreshHandler = () => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/activities',
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => {
				setActivities([...data]);
				setSendFeedbacksRefresh({});
			}
		);
	};

	useEffect(() => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/activities',
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => {
				setActivities(data);
			}
		);
	}, [sendRequest, authContext.token]);

	const logoutAllHandler = () => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/logoutAll',
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => {
				authContext.logout();
				history.replace('/');
			}
		);
	};

	const deleteAccountHandler = () => {
		sendRequest(
			{
				url: 'http://127.0.0.1:3000/me',
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => {
				authContext.logout();
				history.replace('/');
			}
		);
	};

	const newActivityHandler = (activity) => {
		setActivities((prevActivities) => [...prevActivities, activity]);
	};

	const removeActivityHandler = (id) => {
		setActivities((prevActivities) =>
			prevActivities.filter((activity) => activity.id !== id)
		);
	};

	const editActivityHandler = (activity) => {
		setActivities((prevActivities) => {
			const index = prevActivities.findIndex((act) => act.id === activity.id);
			prevActivities[index].name = activity.name;
			prevActivities[index].description = activity.description;
			return [...prevActivities];
		});
	};

	const editProfileHandler = (user) => {
		setName(user.name);
		setEmail(user.email);
	};

	const descriptionHandler = (description) => {
		setDescription(description);
	};

	const timestampsHandler = (timestamps) => {
		const timeList = timestamps.map((time) => (
			<li style={{ fontSize: '1.4rem', listStyle: 'none' }} key={Math.random()}>
				{time}
			</li>
		));
		console.log(timeList);

		setTimestamps(timeList);
	};

	const showActivityForm = () => {
		setIsActivityForm(true);
	};

	const closeActivityFrom = () => {
		setIsActivityForm(false);
	};

	const showEditProfile = () => {
		setIsEditProfileForm(true);
	};

	const closeEditProfile = () => {
		setIsEditProfileForm(false);
	};

	const showAreYouSure = () => {
		setAreYouSure(true);
	};

	const closeAreYouSure = () => {
		setAreYouSure(false);
	};

	return (
		<>
			{isEditProfileForm && (
				<EditProfile
					type='edit'
					onClose={closeEditProfile}
					onEditProfile={editProfileHandler}
				/>
			)}
			{areYouSure && (
				<Prompt
					type='edit'
					onClose={closeAreYouSure}
					onYes={deleteAccountHandler}
				/>
			)}
			<div className={classes['break-line-horizontal']}></div>
			<div className={classes.container}>
				<nav className={classes['user-nav']}>
					<ImUser className={classes['user-icon']} />
					<p className={classes['user-info']}>Welcome, {name}</p>
					<p className={classes['user-info']}>Email: {email}</p>
					<Button className={classes['edit-user']} onClick={showEditProfile}>
						<FaUserEdit className={classes['edit-user-icon']} />
						<p>Edit Profile</p>
					</Button>
					<Button className={classes['edit-user']} onClick={showAreYouSure}>
						<AiOutlineUserDelete className={classes['edit-user-icon']} />
						<p>Delete Account</p>
					</Button>
					<Button
						className={classes['secondary-button']}
						onClick={logoutAllHandler}>
						Logout from all devices
					</Button>
				</nav>
				<menu className={classes['control-panel']}>
					<Button
						className={classes['new-activity-btn']}
						onClick={showActivityForm}>
						New Activity
					</Button>
					{isActivityForm && (
						<ActivityFrom
							type='add'
							onClose={closeActivityFrom}
							onAddActivity={newActivityHandler}
						/>
					)}
				</menu>
				<main className={classes['activity-container']}>
					<div className={classes['activities-container']}>
						{activities.length !== 0 && (
							<ActivityList refresh={refreshHandler}>
								{activities.map((activity) => (
									<ActivityItem
										showDescription={descriptionHandler}
										showTimestamps={timestampsHandler}
										onRemoveActivity={removeActivityHandler}
										key={activity.id}
										activity={activity}
										editActivity={editActivityHandler}
										refresh={sendFeedbacksRefresh}
									/>
								))}
							</ActivityList>
						)}
						{activities.length === 0 && 'You have 0 activities!'}
					</div>
				</main>
				<aside className={classes['activity-description-container']}>
					<p className={classes['profile-heading']}>Activity Description</p>
					<p className={classes.description}>
						{description}

						<p style={{ marginTop: '1rem' }}>Timestamps:</p>
						{timestamps}
					</p>
				</aside>
			</div>
		</>
	);
};

export default Profile;
