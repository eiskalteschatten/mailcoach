import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  createStyles,
  Theme,
  makeStyles,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import { State } from '../../../store';
import { SerializedModel as Article } from '../../../../../interfaces/rss/Article';
import { articleMarkReadUnread } from '../../../store/actions/rss/articleActions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogPaper: {
      [theme.breakpoints.up('sm')]: {
        minWidth: 550
      }
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1)
    },
    feedName: {
      opacity: '.7'
    },
    articlePubDate: {
      opacity: '.7',
      fontSize: '.9em'
    },
    articleContent: {
      marginTop: theme.spacing(3)
    },
    grow: {
      flexGrow: 1
    }
  })
);

interface Props {
  open: boolean;
  handleClose: any;
  articleIndex: number;
}

const ArticleView: React.FC<Props> = (props) => {
  const {
    open,
    handleClose,
    articleIndex
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const article = useSelector((state: State) => state.rss.article.articles && state.rss.article.articles[articleIndex]) as Article;
  const [manuallyMarked, setManuallyMarked] = useState<boolean>(false);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  const handleOpenArticle = (link: string) => {
    window.open(link, '_blank');
  };

  const handleMarkAsReadOrUnread = (read: boolean) => {
    dispatch(articleMarkReadUnread(article.id, read, articleIndex));
    setManuallyMarked(true);
  };

  const memoizedMarkAsReadOrUnread = useCallback(
    () => dispatch(articleMarkReadUnread(article.id, true, articleIndex)),
    [article, articleIndex, dispatch]
  );

  useEffect(() => {
    if (!article.read && !manuallyMarked) {
      setTimeout(() => memoizedMarkAsReadOrUnread, 750);
    }
  }, [article, memoizedMarkAsReadOrUnread, manuallyMarked]);

  return (<Dialog
    open={open}
    onClose={handleClose}
    classes={{
      paper: classes.dialogPaper
    }}
    fullScreen={isMobile}
    fullWidth
    maxWidth='md'
  >
    <DialogTitle>
      {article.title}

      <IconButton className={classes.closeButton} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent>
      {article.feed && article.feed.name && (
        <div className={classes.feedName}>{article.feed.name}</div>
      )}

      <div className={classes.articlePubDate}>
        {new Date(article.pubDate).toLocaleString(undefined, dateOptions)}
      </div>

      <div className={classes.articleContent}>
        {article.content}
      </div>
    </DialogContent>

    <DialogActions>
      {article.read ? (
        <Button onClick={() => handleMarkAsReadOrUnread(false)}>
          <FormattedMessage id='rssFeeds.markAsUnread' />
        </Button>
      ) : (
        <Button onClick={() => handleMarkAsReadOrUnread(true)}>
          <FormattedMessage id='rssFeeds.markAsRead' />
        </Button>
      )}

      <div className={classes.grow} />

      <Button onClick={() => handleOpenArticle(article.link)} color='primary'>
        <FormattedMessage id='rssFeeds.openArticle' />
      </Button>
    </DialogActions>
  </Dialog>);
}

export default ArticleView;