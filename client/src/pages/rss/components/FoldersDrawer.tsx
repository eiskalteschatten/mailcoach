import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';

import {
  createStyles,
  Theme,
  makeStyles,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import ArchiveIcon from '@material-ui/icons/Archive';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

import ComponentLoader from '../../../components/ComponentLoader';

import { State } from '../../../store';
import { folderGetAllWithFeeds } from '../../../store/actions/rss/folderActions';
import { IntlContext } from '../../../intl/IntlContext';
import { SerializedModel as Folder } from '../../../../../interfaces/rss/Folder';

const drawerWidth = 325;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth
      }
    },
    drawerPaper: {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth
      }
    },
    toolbar: theme.mixins.toolbar,
    folderList: {
      flex: 'auto'
    },
    listItem: {
      '&:hover': {
        '& $listItemDelete': {
          display: 'inline !important'
        }
      }
    },
    listItemDelete: {
      display: 'none'
    }
  })
);

const FolderDrawer: React.FC = () => {
  const classes = useStyles();
  const { messages } = useContext(IntlContext);
  const folders = useSelector((state: State) => state.rss.folder.folders) as Folder[];
  const leftDrawerOpen = useSelector((state: State) => state.app.leftDrawerOpen);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!folders || folders.length === 0) {
      setIsLoading(true);
      dispatch(folderGetAllWithFeeds());
    }
  }, [folders, dispatch]);

  return (<Drawer
    className={clsx({
      [classes.root]: leftDrawerOpen
    })}
    variant='persistent'
    anchor='left'
    open={leftDrawerOpen}
    classes={{
      paper: classes.drawerPaper
    }}
  >
    <ComponentLoader isLoading={isLoading} />

    <div className={classes.toolbar} />

    <List>
      <ListItem button>
        <ListItemIcon>
          <RssFeedIcon />
        </ListItemIcon>
        <ListItemText primary={messages.allItems} />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <NewReleasesIcon />
        </ListItemIcon>
        <ListItemText primary={messages.unreadItems} />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <ArchiveIcon />
        </ListItemIcon>
        <ListItemText primary={messages.archive} />
      </ListItem>
    </List>

    <Divider />

    <div className={classes.folderList}>
      <List>
        {folders.map((folder: Folder) => (
          <span className={classes.listItem} key={folder.id}>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={folder.name} />
              <ListItemSecondaryAction  className={classes.listItemDelete}>
                <IconButton edge='end'>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </span>
        ))}
      </List>
    </div>

    <List>
      <ListItem button>
        <ListItemIcon>
          <CreateNewFolderIcon />
        </ListItemIcon>
        <ListItemText primary={messages.addFolder} />
      </ListItem>
    </List>
  </Drawer>);
}

export default FolderDrawer;