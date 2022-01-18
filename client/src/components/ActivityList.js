import classes from './ActivityList.module.css';
import Button from './UI/Button';
import { BiRefresh } from 'react-icons/bi';

const ActivityList = (props) => {
	const refreshHandler = () => {
		props.refresh();
	};
	return (
		<>
			<Button className={classes['refresh-btn']} onClick={refreshHandler}>
				<BiRefresh />
			</Button>
			<p className={classes['list-heading']}>Activity List</p>
			<div className={classes.activities}>
				<ul>{props.children}</ul>
			</div>
		</>
	);
};

export default ActivityList;
