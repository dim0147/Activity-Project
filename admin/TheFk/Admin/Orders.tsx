import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from 'axios';

interface IData {
    username: string;
    name: string;
    email: string;
    authenticate: string;
    createdAt: string;
}

interface IResponseData {
    Id: string;
    Username: string;
    Name: string;
    Email: string;
    Authenticate: string;
    CreatedAt: string;
}

// Generate Order Data
function createData(
    id: number,
    date: string,
    name: string,
    shipTo: string,
    paymentMethod: string,
    amount: number
) {
    return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
    createData(
        0,
        '16 Mar, 2019',
        'Elvis Presley',
        'Tupelo, MS',
        'VISA ⠀•••• 3719',
        312.44
    ),
    createData(
        1,
        '16 Mar, 2019',
        'Paul McCartney',
        'London, UK',
        'VISA ⠀•••• 2574',
        866.99
    ),
    createData(
        2,
        '16 Mar, 2019',
        'Tom Scholz',
        'Boston, MA',
        'MC ⠀•••• 1253',
        100.81
    ),
    createData(
        3,
        '16 Mar, 2019',
        'Michael Jackson',
        'Gary, IN',
        'AMEX ⠀•••• 2000',
        654.39
    ),
    createData(
        4,
        '15 Mar, 2019',
        'Bruce Springsteen',
        'Long Branch, NJ',
        'VISA ⠀•••• 5919',
        212.79
    ),
];

function preventDefault(event: any) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function Orders() {
    const classes = useStyles();
    const [data, setData] = useState<Array<IData>>([]);

    useEffect(() => {
        axios
            .get('/api/user/get-recent-user')
            .then((res) => res.data)
            .then((data: Array<IResponseData>) =>
                setData(
                    data.map((value) => ({
                        username: value.Username,
                        name: value.Name,
                        email: value.Email,
                        authenticate: value.Authenticate.toUpperCase(),
                        createdAt: moment(value.CreatedAt).format('LL'),
                    }))
                )
            );
    }, []);

    return (
        <React.Fragment>
            <Title>Recent Users</Title>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Authenticate</TableCell>
                        <TableCell align='right'>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.username}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.authenticate}</TableCell>
                            <TableCell align='right'>{row.createdAt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore}>
                <Link color='primary' href='#' onClick={preventDefault}>
                    See more users
                </Link>
            </div>
        </React.Fragment>
    );
}
