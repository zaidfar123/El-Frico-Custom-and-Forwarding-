import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';

function Media() {

  return (
    <Card sx={{ maxWidth: 345 }}>
    <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      <CardContent style={{margin: 0 , padding : "8px" }}>
            <Skeleton animation="wave" height={50} />
      </CardContent>
    </Card>
  );
}

export default function CardSkeleton() {
  return (
    <div>
      <Media />
    </div>
  );
}