import Button from './UI/Button';
import ActivityFrom from './Forms/ActivityForm';
import classes from './ActivityItem.module.css';
import { AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';
import { RiShareForwardLine } from 'react-icons/ri';
import useHttp from '../hooks/use-http';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../store/auth-context';
import ActivityLink from './ActivityLink';

const ActivityItem = (props) => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [isActivityForm, setIsActivityForm] = useState(false);
	const [isShareModal, setIsShareModal] = useState(false);
	const showDescriptionHandler = () => {
		props.showDescription(props.activity.description);
		props.showTimestamps(feedbacks['timestamps']);
	};

	const { sendRequest, error, isLoading } = useHttp();
	const authContext = useContext(AuthContext);

	useEffect(() => {
		sendRequest(
			{
				url: `http://127.0.0.1:3000/activity/${props.activity.id}/feedbacks`,
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => setFeedbacks(data)
		);
	}, [sendRequest, authContext, props.activity.id, props.refresh]);

	const deleteActivityHandler = () => {
		sendRequest(
			{
				url: `http://127.0.0.1:3000/activity/${props.activity.id}`,
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + authContext.token,
				},
			},
			(data) => props.onRemoveActivity(data.id)
		);
	};

	const showActivityForm = () => {
		setIsActivityForm(true);
	};

	const closeActivityFrom = () => {
		setIsActivityForm(false);
	};

	const shareActivityHandler = () => {
		setIsShareModal(true);
	};

	const closeShareModal = () => {
		setIsShareModal(false);
	};

	return (
		<>
			{isShareModal && (
				<ActivityLink onClose={closeShareModal} code={props.activity.id} />
			)}
			{isActivityForm && (
				<ActivityFrom
					type='edit'
					activity={props.activity}
					onClose={closeActivityFrom}
					onEditActivity={props.editActivity}
				/>
			)}
			<li className={classes.activity}>
				<div>
					<h3>{props.activity.name}</h3>
				</div>
				<p>Feedbacks &rarr;</p>
				<div className={classes.reactions}>
					<p>🙂: {feedbacks[1]}</p>
					<p>😕: {feedbacks[-1]}</p>
					<p>😮: {feedbacks[0]}</p>
					<p>🤔: {feedbacks['?']}</p>
				</div>
				<div className={classes.controls}>
					<Button
						className={classes['activity-controls']}
						onClick={showActivityForm}>
						<AiOutlineEdit />
					</Button>
					<Button
						className={classes['activity-controls']}
						onClick={showDescriptionHandler}>
						<AiOutlineSearch />
					</Button>
					<Button
						className={`${classes['activity-controls']} ${classes['share']}`}
						onClick={shareActivityHandler}>
						<RiShareForwardLine />
					</Button>
					<Button
						className={`${classes['activity-controls']} ${classes['delete']}`}
						onClick={deleteActivityHandler}>
						<FiTrash />
					</Button>
				</div>
			</li>
		</>
	);
};

export default ActivityItem;
