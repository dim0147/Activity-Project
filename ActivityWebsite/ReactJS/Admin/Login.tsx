import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { IUser } from './store/user/types';
import { setUser } from './store/user/actions';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
    return (
        <Typography variant='body2' color='textSecondary' align='center'>
            {'Copyright © '}
            <Link color='inherit' href='https://material-ui.com/'>
                Sport Club DashBoard
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface IRespondGetUser {
    success: boolean;
    user: IUser;
}

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const userOrEmailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = userOrEmailRef.current?.value;
        const password = passwordRef.current?.value;
        setError('');
        setLoading(true);

        axios
            .post('/api/user/login', {
                UsernameOrEmail: username,
                Password: password,
                RememberMe: rememberMe,
            })
            .then((res) => {
                async function getUser() {
                    const response = await axios
                        .get<IRespondGetUser>('/api/user')
                        .then((response) => response.data)
                        .catch((err) => null);
                    setLoading(false);
                    if (response === null) {
                        setError("Cannot get user information")
                        return;
                    }
                    const { user } = response;

                    dispatch(setUser(user));
                    history.push('/');
                }

                setError('');
                getUser();

                // history.push('/');
            })
            .catch((err) => {
                setError(err.response.data);
                setLoading(false);
            });
    };

    const handleRememberCheckBox = (
        event: React.ChangeEvent<{}>,
        checked: boolean
    ) => {
        setRememberMe(checked);
    };

    return (
        <Grid container component='main' className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Sign in
                    </Typography>
                    {error !== '' && <Alert severity='error'>{error}</Alert>}
                    <form
                        onSubmit={handleSubmitForm}
                        className={classes.form}
                        noValidate
                    >
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Username Or Email'
                            name='email'
                            autoComplete='email'
                            autoFocus
                            inputRef={userOrEmailRef}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                            inputRef={passwordRef}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox value='remember' color='primary' />
                            }
                            onChange={handleRememberCheckBox}
                            label='Remember me'
                        />
                        {loading ? (
                            <Box
                                width='auto'
                                display='flex'
                                justifyContent='center'
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                        )}

                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
