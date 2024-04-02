
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography, Grid, CardContent, Card, Dialog, DialogContent,TextField, Alert} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import MyIcon from './assets/imageIcon.png'
import { styled } from '@mui/material/styles';
import { Bars} from 'react-loader-spinner'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ReactPlayer from 'react-player'
import { auto } from '@popperjs/core';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [analizeResult, setAnalizeResult] = useState('');
  const [progress, setProgress] = useState(false);
  const [progressAnalize, setProgressAnalize] = useState(false);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });



  const addFile = async (e) => {
    if (e.target.files[0]) {
      setTranscription('')
      setProgress(true);  
      console.log('entro el audio')
      const file = e.target.files[0];
      setAudioFile(file);
      

      const formData = new FormData();
      formData.append('audiofile', e.target.files[0]);

      const response = await axios.post('http://127.0.0.1:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async ({ data }) => { 
        console.log(data)
        setTranscription(data.transcription)
        setProgress(false); 
       })
        .catch((err) => console.log({ err }))
    }
  };


  const addAnalizer = async () => {
    setAnalizeResult('')
    setTranscription('')
    setProgressAnalize(true);  
    await axios.get('http://127.0.0.1:5000/analize').then(({data1}) => {
      console.log(data1.result)
      setAnalizeResult(data1.result)
      
      setProgressAnalize(false);
    } ) 
  } 

  return (
    <Box sx={{ maxWidth: '100%' }}>

      <header>
        <AppBar position="static">
          <Toolbar variant="dense" style={{backgroundColor:'#313053', height:'70px'}}>
            <IconButton edge="start" color="inherit" aria-label="menu" >
            <img src={MyIcon} alt="My Icon" style={{ width: '60px', height: '60px' }} />
            </IconButton>
            <Typography variant="h6" color="#fff" component="div">
              DEP
            </Typography>
          </Toolbar>
        </AppBar>
      </header>

      <Container sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>  
        <Grid container justifyContent={'center'} alignContent={'center'}>      
          <Grid item xs={12} md={12} justifyContent={'center'} alignContent={'center'} textAlign={'center'}>
            <Box sx={{ display: 'flex', justifyContent: 'center', m: 1 }} >
              <Typography variant='h3' color="GrayText">
              Detection of emotions in PQRS
              </Typography>
            </Box>
            <Box sx={{mt: 5}}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload audio file
              <VisuallyHiddenInput type="file" onChange={addFile} />
            </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} >
            {
              audioFile ? 
                <Box sx={{display:'flex', justifyContent: 'center', mt: 4, mb:4}}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        File information
                      </Typography>
                      <Typography variant="h5" component="div">
                        {audioFile.name}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {(audioFile.size  / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                      <Typography variant="body2">
                      {audioFile.type}    
                      </Typography>
                      {audioFile && <ReactPlayer url={URL.createObjectURL(audioFile)} controls={true}  height={100} width={auto} />}
                    </CardContent>
                  </Card>
                </Box>         
              :
              <></>
            }
            {
              transcription && (
                <Box sx={{display:'flex', justifyContent: 'center', mt: 5}}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<ManageSearchIcon />}
                  onClick={addAnalizer} 
                >
                  Analize
                  
                </Button>
                </Box>
              )
            }
          </Grid>
          <Grid item xs={12} md={6} >  
          {progress && (
              <Box sx={{textAlign: 'center', marginTop:'31px'}}>
                <Bars
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  wrapperStyle={{justifyContent:'center'}}
                  wrapperClass=""
                  visible={true}
                  />
                <Typography>Transcribing...</Typography>
              </Box>
          )}
            {
              transcription && (<>
              <Card sx={{height:'auto', marginLeft:'10px', marginTop:'31px'}}>
                  <CardContent sx={{height:'auto', backgroundColor: '#d4edda'}}>
                    <Box className="transcription" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                      <Typography variant='h4'>Transcripción:</Typography>
                      <Typography>{transcription}</Typography>
                    </Box>  
                  </CardContent>
                </Card>
                
              </>
                
                
              )
              
            } 
            {progressAnalize && (
              <Box sx={{textAlign: 'center', marginTop:'31px'}}>
                <Bars
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  wrapperStyle={{justifyContent:'center'}}
                  wrapperClass=""
                  visible={true}
                  />
                <Typography>Analyzing...</Typography>
              </Box>
          )}
            {
              analizeResult && (<>
              <Card sx={{height:'auto', marginLeft:'10px', marginTop:'31px'}}>
                  <CardContent sx={{height:'auto', backgroundColor: '#d4edda'}}>
                    <Box className="transcription" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                      <Typography variant='h4'>Informe:</Typography>
                      <Typography>{analizeResult}</Typography>
                    </Box>  
                  </CardContent>
                </Card>
                
              </>
                
                
              )
              
            } 

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
