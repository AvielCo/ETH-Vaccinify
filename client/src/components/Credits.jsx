import React from 'react';
import { Avatar, Typography, makeStyles } from '@material-ui/core';
import github from '../assets/logo-github.svg';
import linkedin from '../assets/logo-linkedin.svg';
import { IconButton, ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const creators = [
  {
    firstLetter: 'A',
    name: 'Aviel Cohen',
    pic: 'https://media-exp1.licdn.com/dms/image/C4E35AQHZcHS1EEl50w/profile-framedphoto-shrink_400_400/0/1613863085197?e=1613952000&v=beta&t=sExre_x_-dmlz2dHSmqyu9qD9ot7umgfbc0ik0n6-LI',
    github: 'AvielCo',
    linkedin: 'AvielCo',
  },
  {
    firstLetter: 'V',
    name: 'Vitaly Nechayuk',
    pic: 'https://media-exp1.licdn.com/dms/image/C5635AQGgXnL3VF_wGg/profile-framedphoto-shrink_400_400/0/1605199904598?e=1613952000&v=beta&t=hNt-PneycXvRI6WWT2GpKcVfsOAu5Xuh1vi8cr_EMQQ',
    github: 'VitNecha',
    linkedin: 'vitaly-nechayuk',
  },
];

export default function Credits() {
  const classes = useStyles();
  return (
    <div>
      <div className="container mt-2">
        <div className="row">
          {creators.map((creator) => {
            return (
              <div className="border border-dark rounded p-1 mr-2 mb-2">
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <div>
                    <Avatar alt={creator.name} src={creator.pic} className={classes.large}>
                      {creator.firstLetter}
                    </Avatar>
                  </div>
                  <div className="pt-2 pl-1">
                    <Typography variant="h6">{creator.name}</Typography>
                    <ButtonGroup variant="text" disableElevation>
                      <IconButton href={`https://github.com/${creator.github}`} size="small">
                        <Avatar src={github} className={classes.small} />
                      </IconButton>
                      <IconButton href={`https://linkedin/in/${creator.linkedin}`} size="small">
                        <Avatar src={linkedin} className={classes.small} />
                      </IconButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-2">
          <label className="credits"> © AviVit Technologies Inc. </label>
        </div>
      </div>
    </div>
  );
}
