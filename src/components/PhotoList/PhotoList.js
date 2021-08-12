import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));


export default function PhotoList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={400} >
        <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{props.author}'s Album</ListSubheader>
        </ImageListItem>
        {props.photos.map((item) => (
          <ImageListItem key={item.url}>
            <img src={item.url} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {props.author}</span>}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
