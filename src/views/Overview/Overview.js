import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import AutocompleteSelect from "../../components/AutocompleteSelect/AutocompleteSelect";
import PhotoList from "../../components/PhotoList/PhotoList";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import Snackbar from "../../components/Snackbar/Snackbar";

import * as albumContext from "../../api/album/albumApiCalls";
import * as photoContext from "../../api/photo/photoApiCalls";
import * as userContext from "../../api/user/userApiCalls";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 50
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Overview() {
    const classes = useStyles();

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userOptions, setUserOptions] = useState([]);
    const [albumOptions, setAlbumOptions] = useState([]);

    const [selectedAlbum, setSelectedAlbum] = useState();
    const [selectedAlbumValue, setSelectedAlbumValue] = useState("");
    const [selectedUser, setSelectedUser] = useState();

    const [albumSelectOpen, setAlbumSelectOpen] = useState(false);
    const [userSelectOpen, setUserSelectOpen] = useState(false);

    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");

    useEffect(() => {
        let active = true;

        (async () => {
            const response = await userContext.getAllUsers();

            // should be handled, may be send via toaster
            if (!response.ok) {
                handleAlert('Something went wrong!');
            }
            const users = await response.json();

            if (active) {
                setUserOptions(users);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const onUserSelectOpen = () => {
        setUserSelectOpen(true);
    }

    const onAlbumSelectOpen = async () => {   
        if(!selectedUser){
            handleAlert('User is not selected!');
            return;
        }

        setAlbumSelectOpen(true);

        const response = await albumContext.getAlbumByUserId(selectedUser.id);

        // should be handled
        if (!response.ok) {
            handleAlert('Something went wrong!');
        }

        const userAlbums = await response.json();
        setAlbumOptions(userAlbums);
        setSelectedAlbumValue(userAlbums[0]);
    }

    const onAlbumSelectedHandler = (album) => {
        setSelectedAlbum(album);
        setPhotos([]);
    }

    const onUserSelectedHandler = (user) => {
        setSelectedUser(user);
      
        setSelectedAlbumValue("");
        setAlbumOptions([]);
        setPhotos([]);
    }

    const onButtonClick = async () => {
        if(!selectedAlbum){
            handleAlert('Please select the album!');
            return;
        }

        setLoading(true);
        const response = await photoContext.getPhotosByAlbumId(selectedAlbum.id);

        // should be handled, may be send via toaster
        if (!response.ok) {
            handleAlert('Something went wrong!');
        }

        const albumPhotos = await response.json();
        setPhotos(albumPhotos);
        setLoading(false);
    }

    const handleAlert = (message) => {
        setOpenSnackBar(true);
        setSnackBarMessage(message);
    }

    const onSnackBarClose = () => {
        setOpenSnackBar(false);
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>

                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}> After selecting the user, user albums will be filled </Paper>
                </Grid>

                <Grid item xs={5}>
                    <AutocompleteSelect
                        label="Users"
                        options={userOptions}
                        getOptionLabel={(option) => option.name}
                        onSelect={onUserSelectedHandler}
                        open={userSelectOpen}
                        onClose={() => setUserSelectOpen(false)}
                        onOpen={onUserSelectOpen}
                    />
                </Grid>
                <Grid item xs={5}>
                    <AutocompleteSelect
                        label="User Albums"
                        options={albumOptions}
                        getOptionLabel={(option) => option.title}
                        onSelect={onAlbumSelectedHandler}
                        open={albumSelectOpen}
                        onClose={() => setAlbumSelectOpen(false)}
                        onOpen={onAlbumSelectOpen}
                        value={selectedAlbumValue}
                    />
                </Grid>
                <Grid item xs={2}>
                    <LoaderButton handleButtonClick={onButtonClick} loading={loading}>
                        Get Photos
                    </LoaderButton>
                </Grid>

                <Grid item xs={12}>
                    {
                        photos.length !== 0 ? (
                            <PhotoList
                            photos={photos}
                            author={selectedUser.name}
                        />
                        ):
                        <Paper className={classes.paper} elevation={3}> There are no photos to show! </Paper>
                    }
                </Grid>

            </Grid>

            <Snackbar 
                open={openSnackBar}
                message={snackBarMessage}
                autoHideDuration={3000}
                handleClose={onSnackBarClose}
                severity="error"
            />
        </Container>

    );
}
