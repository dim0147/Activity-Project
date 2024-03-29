import React, { Component, forwardRef } from 'react';
import MaterialTable from 'material-table';

import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import RoomIcon from '@material-ui/icons/Room';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ForumIcon from '@material-ui/icons/Forum';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import axios from 'axios';
import moment from 'moment';

interface IData {
    Id: string;
    Slug: string;
    Image: string;
    Title: String;
    Club: {
        Id: number,
        Name: string,
        Slug: string
    };
    Tags: Array<string>,
    Comments: number,
    Author: string,
    CreatedAt: string;
    UpdatedAt: string;
}

interface IState {
    data: Array<IData>;
}

export default class Post extends Component<{}, IState> {
    tableIcons = {
        Add: forwardRef((props, ref: any) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref: any) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref: any) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref: any) => (
            <DeleteOutline {...props} ref={ref} />
        )),
        DetailPanel: forwardRef((props, ref: any) => (
            <ChevronRight {...props} ref={ref} />
        )),
        Edit: forwardRef((props, ref: any) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref: any) => (
            <SaveAlt {...props} ref={ref} />
        )),
        Filter: forwardRef((props, ref: any) => (
            <FilterList {...props} ref={ref} />
        )),
        FirstPage: forwardRef((props, ref: any) => (
            <FirstPage {...props} ref={ref} />
        )),
        LastPage: forwardRef((props, ref: any) => (
            <LastPage {...props} ref={ref} />
        )),
        NextPage: forwardRef((props, ref: any) => (
            <ChevronRight {...props} ref={ref} />
        )),
        PreviousPage: forwardRef((props, ref: any) => (
            <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref: any) => (
            <Clear {...props} ref={ref} />
        )),
        Search: forwardRef((props, ref: any) => (
            <Search {...props} ref={ref} />
        )),
        SortArrow: forwardRef((props, ref: any) => (
            <ArrowDownward {...props} ref={ref} />
        )),
        ThirdStateCheck: forwardRef((props, ref: any) => (
            <Remove {...props} ref={ref} />
        )),
        ViewColumn: forwardRef((props, ref: any) => (
            <ViewColumn {...props} ref={ref} />
        )),
    };

    state: Readonly<IState> = {
        data: [],
    };

    componentDidMount() {
        axios
            .get('/api/post/get-all-post')
            .then((res) => res.data)
            .then((data: Array<IData>) =>
                this.setState({
                    data: data.map((value) => ({
                        ...value,
                        CreatedAt: moment(value.CreatedAt).format('LL'),
                        UpdatedAt: moment(value.CreatedAt).format('LL'),
                    })),
                })
            )
            .catch();
    }

    render() {
        return (
            <div style={{ paddingTop: 100 }}>
                <Grid container direction='row' spacing={3}>
                    <Grid item xs={12}>
                        <Box p={3}>
                            <MaterialTable
                                icons={this.tableIcons as any}
                                columns={[
                                    {
                                        title: 'Id',
                                        field: 'Id',
                                        type: 'string',
                                        hidden: true,
                                    },                                    
                                    {
                                        title: 'Slug',
                                        field: 'Slug',
                                        type: 'string',
                                        hidden: true,
                                    },                                    
                                    {
                                        title: 'Image',
                                        sorting: false,
                                        grouping: false,
                                        render: (row) => (
                                            <img
                                                src={row.Image}
                                                style={{
                                                    width: 40,
                                                    borderRadius: '50%',
                                                }}
                                                alt='avatar'
                                            />
                                        ),
                                    },
                                    {
                                        title: 'Title',
                                        field: 'Title',
                                        render: (row) => <a href={`https://localhost:44377/post/${row.Slug}`}>{row.Title}</a>
                                    },
                                    {
                                        title: 'Club',
                                        field: 'Club',
                                        render: (row) => <a href={`https://localhost:44377/club/${row.Club.Slug}`}>{row.Club.Name}</a>
                                    },
                                    {
                                        title: 'Tags',
                                        field: 'Tags',
                                        render: (row) => row.Tags.join(', ')
                                    },
                                    {
                                        title: 'Comments',
                                        field: 'Comments',
                                    },
                                    {
                                        title: 'Author',
                                        field: 'Author'
                                    },
                                    {
                                        title: 'CreatedAt',
                                        field: 'CreatedAt'
                                    },
                                    {
                                        title: 'UpdatedAt',
                                        field: 'UpdatedAt'
                                    }
                                ]}
                                data={this.state.data}
                                editable={{
                                    onRowDelete: (oldData: IData) =>
                                        new Promise((resolve, reject) => {
                                            axios
                                                .delete(`/api/post/delete/${oldData.Id}`)
                                                .then(() => {
                                                    this.setState({
                                                        data: this.state.data.filter(
                                                            (value) =>
                                                                value.Id !==
                                                                oldData.Id
                                                        ),
                                                    });
                                                    resolve(true);
                                                })
                                                .catch((err) =>
                                                    reject(
                                                        new Error(
                                                            'Cannot delete'
                                                        )
                                                    )
                                                );
                                        }),
                                }}
                                localization={{
                                    body: {
                                        deleteTooltip: 'Delete this post',
                                        editRow: {
                                            deleteText:
                                                'Are you sure want to delete this post?',
                                        },
                                    },
                                }}
                                options={{
                                    grouping: true,
                                }}
                                title='Manage Posts'
                            />
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
