import { useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {

  const [transcription, setTranscription] = useState('');

  const addFile = async (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('audiofile', e.target.files[0]);

      const response = await axios.post('http://127.0.0.1:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(async ({ data }) => { 
        console.log(data)
        setTranscription(data.transcription)
       })
        .catch((err) => console.log({ err }))
    }

  };

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <input type="file" onChange={addFile} />

      </div>
      {transcription && (
        <div className="transcription">
          <h2>Transcripción:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </>
  );
}

export default App;
