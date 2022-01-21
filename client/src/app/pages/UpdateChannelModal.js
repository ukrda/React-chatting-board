import React, { useEffect, useState } from "react";
import { Button, makeStyles, TextField, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import { createBrowserHistory } from "history";

import { Modal, Box, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar, Link } from '@material-ui/core';
import { Popover } from '@material-ui/core';
import { toAbsoluteUrl, toImageUrl } from "../../_metronic/_helpers";
import SVG from 'react-inlinesvg';
import clsx from "clsx";

import editIcon from '../assets/editIcon.png';
import addUserIcon from '../assets/addUserIcon.png';
import imageIcon from '../assets/imageIcon.png';
import {GetChannel} from './_redux/chatCrud';

const history = createBrowserHistory();

const useStyles = makeStyles((theme) => ({
    group_option: {
        '& .modal-dialog': {
            '& .modal-content': {
                backgroundColor: '#3F5060',
            }
        }
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 435,
        backgroundColor: 'white',
        color: "#b6ceff",
    },
    modalHeader: {
        padding: 20,
        display: "flex",
        backgroundColor: "#112233",
        justifyContent: "space-between",
        '& .MuiBox-root': {
            fontSize: 15,
            '& button': {
                color: "#b6ceff",
                marginRight: 10,
                padding: 'unset',
                minWidth: 'unset',
                verticalAlign: 'middle'
            }
        }
    },
    modalContent: {
        backgroundColor: '#3F5060',
        minHeight: 500,
    },
    menuIcon: {
        color: "#b6ceff",
        padding: 'unset',
        minWidth: 'unset'
    },
    menuContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#93999F',
        '& .MuiButton-root': {
            padding: '10px 20px 10px 10px',
            width: '100%',
            borderBottom: '1px solid black',
            '& img': {
                marginRight: 20,
            },
            '& .MuiButton-label': {
                justifyContent: 'unset',
            }
        }
    },
    largeIcon: {
        width: 60,
        height: 60
    },
    search: {
        width: "100%",
        height: 65,
        padding: "20px 20px 20px 25px",
        "& > .MuiInput-underline, & > .MuiInput-underline:after": {
            borderBottom: '1px solid #fff',
        },
        "& input": {
            color: '#fff'
        }
    },
    userList: {
        '& :hover': {
            cursor: 'pointer',
            backgroundColor: "white",
        }
    
    },
    paper: {
        '& .MuiPaper-root': {
            boxShadow: 'unset !important'
        },
        '& .MuiButton-root:hover': {
            backgroundColor: 'white',
        }
    },
    input:{
        '& .MuiInputBase-root':{
            color: 'white',
        },
        "& > .MuiInput-underline": {
            borderBottom: '1px solid #fff',
        },
    },
    avatarContainer:{
        width: 454,
        padding:'10px',
        display: 'flex',
        justifyContent:'space-between',
        flexWrap: 'wrap',
        '& button:hover':{
            border:'1px solid red',
        }
    },
    border:{
        border:'1px solid blue',
    },
    noborder:{
        border:'none',
    }
}));
export default function UpdateChannelModal({
    show,
    onHide,
    onUpdateChannel,
    groupId,
    avatars
}) {
    const classes = useStyles();
    const [newGroupName, setNewGroupName] = useState(null);
    const [editGroupName, setEditGroupName] = useState(false);
    const [selected, setSelected] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [anchorE3, setAnchorE3] = useState(null);

    const openMenu = Boolean(anchorEl);
    const id = openMenu ? 'simple-popover' : undefined;

    const [openedAction, setOpenedAction] = useState(null);
    const actionId = openedAction ? 'simple-popover' : undefined;

    const openedAvatar = Boolean(anchorE3);
    const avatarId = openedAvatar ? 'simple-popover' : undefined;

    const [channels, setChannels] = useState([]);
    const [users, setUsers] = useState(null);
    const [groupname, setGroupName] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState([]);
    
    const [update, setUpdate] = useState(0);

    const getChannel = async () => {
        try {
            const { data } = await GetChannel();
            setChannels(data);
            // return data;
        } catch (error) {
            console.error(error);
        }
    }
    const refreshChannel = () =>{
        getChannel();
        channels.map((group, i)=>{
            if(groupId == i){
                setGroupName(group.name);
                setUsers(group.users);
            }
        })
    }
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleAvatarOpen = (event) =>{
        setAnchorE3(event.currentTarget);
    }

    
    const handleActionOpen = (event, id, user) => {
        setAnchorE2(event.currentTarget);
        setOpenedAction(id);
        setSelected(user);
    };
    
    useEffect(()=>{
        setUpdate(update+1);   
        refreshChannel();
        console.log("duplicated");
    }, [onUpdateChannel, groupname, users, updateAvatar]);
    const handleActionClose = () => {
        setAnchorEl(null);
        setAnchorE2(null);
        setAnchorE3(null);
        setOpenedAction(null);
        setSelected(null);
    };
    
    const onCloseModal = () => {
        handleActionClose();
        setEditGroupName(false);
        onHide();
    }
    
    const [searchTerm, setSearchTerm] = useState("");
    const handleSetSearchText = e => {
        setSearchTerm(e.target.value);
    };
    
    function search() {
        return users ? users.filter(person =>
            person.username.toLowerCase().includes(searchTerm)
        ) : [];
    }
        
    const handleEdit = () =>{
        setEditGroupName(true);
        setAnchorEl(null);
    }
    const updateGroupName = () => {
        const data = {
            name: groupname,
            newGroupName: newGroupName
        }
        onUpdateChannel("updateGroupName", data);
        setEditGroupName(false);
        setGroupName(newGroupName);
        console.log(groupname, "changed");
    }
    const updateAvatar = (avatarName, id) =>{
        setSelectedAvatar({id:id, avatarName:avatarName});
        handleActionClose();
        const data = {
            name: groupname,
            newAvatarName: avatarName
        }
        onUpdateChannel("updateGroupAvatar", data);
    }

    const addUser = (e) => {
    }
    const deleteUser = (deleteUser) => {
        const data = {
            name: groupname,
            deleteUser: deleteUser
        }
        handleActionClose();
        onUpdateChannel("deleteUser", data);
        channels.map((group, i)=>{
            if(groupId == i){
                setGroupName(group.name);
                setUsers(group.users);
            }
        })
    }

    const accessUserProfile = (user) => {
        onHide();
        history.push(`/user-profile/profile-overview/${selected.username}`)
        window.location.reload();
    }

    return (
        <Modal
            open={show}
            onClose={onCloseModal}
            className={classes.group_option}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalContainer}>
                <Box className={classes.modalHeader}>
                    <Box>
                        <IconButton onClick={onHide}><CloseIcon fontSize="large" /></IconButton>
                        {editGroupName === false 
                            ? 
                                <font>{groupname}</font>
                            :   
                                <TextField 
                                    className={classes.input} 
                                    onChange={(e)=>setNewGroupName(e.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.key== 'Enter')
                                            updateGroupName();
                                    }}
                                    defaultValue={groupname}
                                />
                        }
                    </Box>
                    <IconButton className={classes.menuIcon} onClick={handleMenuOpen}><MenuIcon fontSize='large' /></IconButton>
                    <Popover
                        id={id}
                        open={openMenu}
                        anchorEl={anchorEl}
                        onClose={handleActionClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        className={classes.paper}
                    >
                        <Box className={classes.menuContainer}>
                            <Button onClick={handleEdit}><img src={editIcon} />Renommer le groupe</Button>
                            <Button onClick={handleAvatarOpen}><img src={imageIcon} />Changer I'image</Button>
                            <Button onClick={addUser}><img src={addUserIcon} />Ajouter un participant</Button>
                        </Box>
                        <Popover
                            id={avatarId}
                            open={openedAvatar}
                            anchorEl={anchorE3}
                            onClose={handleActionClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            className={classes.paper}
                        >
                            <Box className={classes.avatarContainer}>
                                {avatars.map((avatarName, i) => (
                                    <IconButton key={i} className={clsx(selectedAvatar.id == i ? classes.border : classes.noborder)} onClick={()=>updateAvatar(avatarName, i)}>
                                        <Avatar src={`${toImageUrl('avatar/')}${avatarName}`}/>
                                    </IconButton>
                                ))}
                            </Box>
                        </Popover>
                    </Popover>
                </Box>
                <Box className={classes.modalContent}>
                    <TextField
                        className={classes.search}
                        id="input-with-icon-textfield"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="svg-icon">
                                        <SVG
                                            src={toAbsoluteUrl(
                                                "/media/svg/icons/General/Search.svg"
                                            )}
                                        />
                                    </span>
                                </InputAdornment>
                            ),
                        }}
                        value={searchTerm}
                        onChange={handleSetSearchText}
                    />
                    <List className={classes.userList}>
                        {search().map((user, i) => (
                            <ListItem key={user._id} onClick={(e) => handleActionOpen(e, i, user)} onMouseUp={handleActionClose}>
                                <ListItemAvatar className="symbol symbol-circle">
                                    <>
                                        <Avatar className="symbol-label" alt={user.username} src={toImageUrl(user.avatar)} />
                                        <i className={clsx("symbol-badge symbol-badge-bottom", { "bg-success": user.socketId, "bg-gray-700": !user.socketId })}></i>
                                    </>

                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {user.subname}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                        { selected &&
                            <Popover
                                id={actionId}
                                open={openedAction !== null}
                                anchorEl={anchorE2}
                                onClose={handleActionClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                className={classes.paper}
                            >
                                <Box className={classes.menuContainer}>
                                    <Button onClick={() => {deleteUser(selected)}}>Soustraire</Button>    
                                        <Link to={`/user-profile/profile-overview/${selected.username}`}>
                                    <Button onClick={()=>accessUserProfile(selected)}>
                                        Accéder au profil de {selected.username}
                                    </Button>
                                        </Link>
                                    <Button>Rendre administrateur</Button>
                                    <Button>Envoyez un message à {selected.username}</Button>
                                </Box>
                            </Popover>
                        }   
                    </List>
                </Box>
            </Box>
        </Modal>
    );
}