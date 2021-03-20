import React from 'react';
import { useHistory } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';

export const MainListItems = () => {
    const history = useHistory();

    return (
        <div>
            <ListItem button onClick={() => history.push('/')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
            </ListItem>

            <ListItem button onClick={() => history.push('/user')}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Users' />
            </ListItem>

            <ListItem button onClick={() => history.push('/club')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary='Clubs' />
            </ListItem>

            <ListItem button onClick={() => history.push('/post')}>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary='Posts' />
            </ListItem>

            <ListItem button onClick={() => history.push('/report')}>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary='Reports' />
            </ListItem>
        </div>
    );
};

export const SecondaryListItems = () => {
    const history = useHistory();
    return (
        <div>
            <ListSubheader inset>Manage</ListSubheader>
            <ListItem button onClick={() => history.push('/moderator')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Moderator' />
            </ListItem>

            <ListItem button onClick={() => history.push('/category')}>
                <ListItemIcon>
                    <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary='Category' />
            </ListItem>
        </div>
    );
};
