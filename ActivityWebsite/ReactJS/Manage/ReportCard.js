import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    badge: {
        paddingLeft: 30,
        paddingBottom: 10
    }
});

export default function MediaCard({report}) {
    const classes = useStyles();

    return (
        <div className="col-md-4 mt-2">
        <Card className={classes.root}>
            <CardActionArea onClick={() => window.location.href=`/club/${report.Club.Slug}`}>
                <CardMedia
                    component="img"
                    alt="Club Image"
                    height="140"
                    image={report.Club.Image}
                    title="Club Image"
                />

                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {report.Club.Name}
                    </Typography>
                    <div className={classes.badge}>
                        {report.Status === 'success' &&
                            <Badge color="secondary" badgeContent='SUCCESS'></Badge>
                        }

                        {report.Status === 'pending' &&
                            <Badge color="error" badgeContent='PENDING'></Badge>
                        }

                    </div>
                    <Typography variant="body1" color="textPrimary" component="p">
                        {report.Reason}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" component="span">Created At {moment(report.CreatedAt).format("LL")}</Typography>
                </CardContent>
            </CardActionArea>
            </Card>
            </div>
    );
}