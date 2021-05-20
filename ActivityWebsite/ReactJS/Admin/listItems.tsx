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
            <ListItem button onClick={() => history.push('/admin/')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
            </ListItem>

            <ListItem button onClick={() => history.push('/admin/user')}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Users' />
            </ListItem>

            <ListItem button onClick={() => history.push('/admin/club')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary='Clubs' />
            </ListItem>

            <ListItem button onClick={() => history.push('/admin/post')}>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary='Posts' />
            </ListItem>

            <ListItem button onClick={() => history.push('/admin/report')}>
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
            <ListItem button onClick={() => history.push('/admin/moderator')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Moderator' />
            </ListItem>

            <ListItem button onClick={() => history.push('/admin/category')}>
                <ListItemIcon>
                    <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary='Category' />
            </ListItem>
        </div>
    );
};
