import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import axios from 'axios';

// Generate Sales Data
function createData(time: any, amount: any) {
    return { time, amount };
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00', undefined),
];

interface IData {
    time: number;
    amount: number;
}

interface IResponse {
    Month: number;
    Total: number;
}

export default function Chart() {
    const theme = useTheme();
    const [dataView, setData] = useState<Array<IData>>([]);

    useEffect(() => {
        axios
            .get('/api/post/get-by-time')
            .then((res) => res.data)
            .then((data: Array<IResponse>) =>
                setData(
                    data.map((value) => ({
                        time: value.Month,
                        amount: value.Total,
                    }))
                )
            )
            .catch();
    }, []);

    return (
        <React.Fragment>
            <Title>Recent Posts</Title>
            <ResponsiveContainer>
                <LineChart
                    data={dataView}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey='time'
                        stroke={theme.palette.text.secondary}
                    />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position='left'
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                            }}
                        >
                            Total
                        </Label>
                    </YAxis>
                    <Line
                        type='monotone'
                        dataKey='amount'
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
