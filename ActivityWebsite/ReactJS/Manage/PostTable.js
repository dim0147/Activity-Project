import React, { forwardRef, useState, useEffect } from 'react';
import MaterialTable from "material-table";

import { deletePost } from '../API/Post';

import Tooltip from '@material-ui/core/Tooltip';
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
import ReactStars from "react-rating-stars-component";
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import RoomIcon from '@material-ui/icons/Room';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ForumIcon from '@material-ui/icons/Forum';
import SnackBars from '../Components/SnackBars';




export default function Table({ posts }) {
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    const searchTerm = new URLSearchParams(window.location.search).get('search');

    const [data, setData] = useState();
    const [snackBar, setSnackBar] = useState({
        open: false,
        key: 0,
        type: '',
        message: ''
    });


    useEffect(() => {
        const shapeData = posts.map(p => {
            return {
                id: p.Id,
                slug: p.Slug,
                headerImg: p.Image,
                title: p.Title,
                club: p.Club,
                tags: p.Tags.map(tag => tag.name),
                rate: {
                    average: p.Rate.Avegare ?? 0,
                    total: p.Rate.Total
                },
                comments: p.Comments,
                author: p.Author,
                createdAt: p.CreatedAt,
                updatedAt: p.UpdatedAt
            }
        });

        setData(shapeData);
    }, [posts])



    return (
        <>
            <MaterialTable
                icons={tableIcons}
                columns={[
                    {
                        title: "Id", field: "id", type: 'numeric', hidden: true
                    },
                    {
                        title: "Slug", field: "slug", hidden: true
                    },
                    {
                        title: "Image", field: "headerImg", sorting: false, grouping: false, render: row => <img src={row.headerImg} style={{ width: 40, borderRadius: '20%' }} />
                    },
                    {
                        title: 'Title', field: 'title', render: row => <div style={{ minWidth: "150px"}}><a href={`/post/${row.slug}`}>{row.title}</a></div>
                    },
                    {
                        title: "Club", field: "club", grouping: false, customFilterAndSearch: (term, rowData) => rowData.club.Slug.toLowerCase().includes(term.toLowerCase()) || rowData.club.Name.toLowerCase().includes(term.toLowerCase()), render: row => <a href={`/club/${row.club.Slug}`}>{row.club.Name}</a>
                    },
                    {
                        title: 'Tags', field: 'tags', cellStyle: { width: '30%' }, grouping: false, sorting: false, render: row => (<div style={{ minWidth: "250px", paddingLeft: "10px" }}>  {row.tags.join(', ')}  </div>)
                    },
                    {
                        title: 'Rate', field: 'rate', grouping: false, customSort: (a, b) => Number(a.rate.average) - Number(b.rate.average), render: row => (
                            <div style={{ minWidth: "100px", paddingLeft: "10px" }}>
                                <ReactStars
                                    value={row.rate.average}
                                    size={20}
                                    edit={false}
                                /> ({row.rate.total} rating)
                            </div>
                        ),
                    },
                    {
                        title: 'Comments', field: 'comments', type: 'numeric'
                    },
                    {
                        title: 'Author', field: 'author', grouping: false, customSort: (a, b) => ('' + a.author.Name).localeCompare(b.author.Name), render: row => <p>{row.author.Name}</p>
                    },
                    {
                        title: 'Created At', field: 'createdAt', type: "datetime"
                    },
                    {
                        title: 'Updated At', field: 'updatedAt', type: "datetime"
                    },
                ]}
                data={data}

                editable={{

                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {

                            deletePost(oldData.id, (err, response) => {

                                if (err) {
                                    setSnackBar({
                                        open: true,
                                        key: snackBar.key + 1,
                                        type: 'error',
                                        message: `Delete Post ${oldData.title} Failed!`
                                    });
                                }
                                else {
                                    const newArray = data.filter(post => {
                                        return post.id !== oldData.id
                                    });

                                    setData(newArray);

                                    setSnackBar({
                                        open: true,
                                        key: snackBar.key + 1,
                                        type: 'success',
                                        message: `Success Delete Post ${oldData.name}`
                                    });
                                }
                                resolve();
                            });
                        })
                }}

                actions={[
                    {
                        icon: () => <VisibilityIcon color='action' />,
                        tooltip: 'See post',
                        onClick: (event, row) => window.open(`/post/${row.slug}`)
                    },
                    {
                        icon: () => <Edit color='action' />,
                        tooltip: 'Edit post',
                        onClick: (event, row) => window.open(`/post/${row.slug}/edit`)
                    },
                    {
                        icon: () => <AddBox />,
                        tooltip: 'Create new post',
                        isFreeAction: true,
                        onClick: (event) => window.open("/post/create")
                    },
                ]}
                localization={{
                    body: {
                        deleteTooltip: 'Delete this post',
                        editRow: {
                            deleteText: 'Are you sure want to delete this post?'
                        }
                    }
                }}
                options={{
                    grouping: true,
                    searchText: searchTerm
                }}
                title="Manage Posts"
            />

            {snackBar.open &&
                <SnackBars
                    key={snackBar.key}
                    type={snackBar.type}
                    message={snackBar.message}
                />
            }

        </>
    )

}