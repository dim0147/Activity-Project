import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from 'axios';

function preventDefault(event: any) {
    event.preventDefault();
}

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

interface IResponse {
    total: number;
}

export default function Deposits() {
    const classes = useStyles();
    const [totalClubs, setTotal] = useState<Number>(0);

    useEffect(() => {
        axios
            .get('/api/club/get-club-month')
            .then((res) => res.data)
            .then((data: IResponse) => setTotal(data.total))
            .catch();
    }, []);

    return (
        <React.Fragment>
            <Title>Recent Clubs Create On This Month</Title>
            <Typography component='p' variant='h4'>
                {totalClubs}
            </Typography>
        </React.Fragment>
    );
}
