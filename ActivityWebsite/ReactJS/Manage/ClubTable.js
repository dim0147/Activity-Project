﻿import React, { forwardRef, useState, useEffect } from 'react';
import MaterialTable from "material-table";

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


export default function Table({ clubs }) {
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

    const [data, setData] = useState();

    useEffect(() => {
        const shapeData = clubs.map(c => {
            return {
                id: c.Id,
                headerImg: c.Image,
                name: c.Name,
                address: {
                    name: c.Address,
                    lat: c.Lat,
                    lng: c.Lng
                },
                operationHours: c.OperationHours,
                categories: c.Category.map(cate => cate.Name),
                follow: c.UserFollows,
                posts: c.Posts,
                rate: {
                    average: c.Rate.Average ?? 0,
                    total: c.Rate.Total
                },
                establishedAt: c.EstablishAt,
                createdAt: c.CreatedAt
            }
        });

        setData(shapeData);
    }, [clubs])


    return (
        <MaterialTable
            icons={tableIcons}
            columns={[
                {
                    title: "Id", field: "id", type: 'numeric', hidden: true
                },
                {
                    title: "Image", sorting: false, grouping: false, field: "headerImg", render: row => <img src={row.headerImg} style={{ width: 40, borderRadius: '50%' }} />
                },
                {
                    title: 'Name', field: 'name'
                },
                {
                    title: 'Address', field: 'address', grouping: false, sorting: false, render: row => (
                        <div style={{ minWidth: "250px", paddingLeft: "10px" }}>
                            <a style={{ color: 'green' }} target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${row.address.lat},${row.address.lng}`}><RoomIcon />{row.address.name}</a>
                        </div>
                    ) 
                },
                {
                    title: 'Operation Hours', field: 'operationHours'
                },
                {
                    title: 'Categories', field: 'categories', cellStyle: { width: '30%' }, grouping: false, sorting: false, render: row => (<div style={{ minWidth: "250px", paddingLeft: "10px" }}>  {row.categories.join(', ')}  </div>)
                },
                {
                    title: 'User Follows', field: 'follow', type: 'numeric', grouping: false, render: row => <span>{row.follow}<RssFeedIcon color="action" /></span>
                },
                {
                    title: 'Posts', field: 'posts', type: 'numeric', grouping: false, render: row => (<><span>{row.posts}</span> <a href="#"><Tooltip title="See all posts"><CallMissedOutgoingIcon color="primary" /></Tooltip></a></>)
                },
                {
                    title: 'Rate', field: 'rate', grouping: false, customSort: (a, b) => Number(a.rate.average) - Number(b.rate.average), render: row => (
                        <>
                            <ReactStars
                                value={row.rate.average}
                                size={20}
                                edit={false}
                            /> (Total {row.rate.total} rating)
                        </>
                    ),                 
                },
                {
                    title: 'Established at', field: 'establishedAt', type: "date"
                },  
                {
                    title: 'Created At', field: 'createdAt', type: "datetime"
                },
            ]}
            data={data}

            editable={{

                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {

                            resolve();
                        }, 1000);
                    })
            }}

            actions={[
                {
                    icon: () => <Edit color='action' />,
                    tooltip: 'Edit club',
                    onClick: (event) => alert("You want to edit club")
                },
                {
                    icon: () => <AddBox />,
                    tooltip: 'Create new club',
                    isFreeAction: true,
                    onClick: (event) => alert("You want to add a new row")
                },
            ]}
            localization={{
                body: {
                    deleteTooltip: 'Delete this club',
                    editRow: {
                        deleteText: 'Are you sure want to delete this club?'
                    }
                }
            }}
            options={{
                grouping: true,
                searchText: "Sport Club"
            }}
            title="Manage Clubs"
        />
    )

}