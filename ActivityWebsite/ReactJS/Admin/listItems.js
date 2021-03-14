import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import DescriptionIcon from '@material-ui/icons/Description';
import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

export const mainListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button>
            <ListItemIcon>
                <PermIdentityIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
        </ListItem>

        <ListItem button>
            <ListItemIcon>
                <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Clubs" />
        </ListItem>

        <ListItem button>
            <ListItemIcon>
                <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Posts" />
        </ListItem>

        <ListItem button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Manager</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <AccessibleForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Moderator" />
        </ListItem>
       </div>
);
