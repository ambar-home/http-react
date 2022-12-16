import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import {Box, Paper, Grid, Select, FormControl, InputLabel, MenuItem,
  Button} from '@mui/material';
import axios from 'axios';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

var sizeObjVal = {
  "5M" : 5242880,
  "50M" : 52428800,
  "100M" : 104857600,
  "500M" : 524288000,
  "1G" : 1073741824,
  "2G" : 2147483648
};

export default function App() {

  var file;
  const CancelTokenVal = axios.CancelToken.source();
  
  const [type, setType] = useState('download'); // download/upload/bidirectional
  const [iterations, setIterations] = useState(3); // 1, 2, 3, 4, 5, 6 
  const [streamCount, setStreamCount] = useState(3); // 1, 2, 3, 4, 5, 6 
  const [size, setSize] = useState('50M'); // 5M, 50M, 100M, 500M, 1G , 2G
  const [timeOut, setTimeOut] = useState(5); // in seconds , 5, 10, 15, 20, 30, 40, 45, 60, 90, 120
  var streamDone = 0;

  const handletypeChange = (event) => {
    setType(event.target.value);
  };
  const handleiterationsChange = (event) => {
    setIterations(event.target.value);
  };
  const handlestreamCountChange = (event) => {
    setStreamCount(event.target.value);
  };
  const handlesizeChange = (event) => {
    setSize(event.target.value);
  };
  const handletimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };

  const SubmitHandle123 = (event) => {
    console.log("SubmitHandle type = ",type);
    console.log("SubmitHandle iterations = ",iterations);
    console.log("SubmitHandle streamCount = ",streamCount);
    console.log("SubmitHandle size = ",size);
    console.log("SubmitHandle timeOut = ",timeOut);

    if((type === "bidirectional" || type === "upload") && size !== "") {

      console.log("SubmitHandle file size in bytes = ",sizeObjVal[size]);
      console.log("SubmitHandle file name = ","upload_"+size);
      
      if(file === undefined || file === null) {

        console.log("Create file for Upload started");

        const LEN = sizeObjVal[size];
        const arr = new Array(LEN).fill(0);  
        console.log("Create file for Upload going on");

        var txtFile = "upload_"+size;
        file = new File(arr, txtFile,{
          type: "text/plain",
        });
        console.log("Create file for Upload Completed");
      }
    } else if (type === "download") {
      downloadHandle();
    }
  };


  const downloadHandle = async () => {
    var iterationCounterArray = Array.from(Array(Number(iterations)).keys())
    console.log("downloadHandle iterationCounterArray = ",iterationCounterArray);

    for (const prop of iterationCounterArray) {
      console.log("download number = ",prop+1)
      console.log(await downloadtestIter(prop+1))
    }
  }

  const downloadtestIter = (val) => {
    return new Promise(resolve => {
      const promises = [];
      console.log("downloadtestIter val = ",val);
      var streamCountCounterArray = Array.from(Array(Number(streamCount)).keys())
      for (const streamNum of streamCountCounterArray) {
        // downloadTest123("Iterations-"+val+",StreamNumber-"+streamNum+" :-");
        var streamNumVal = streamNum + 1;
        promises.push(downloadTest123("Iterations-"+val+",StreamNumber-"+streamNumVal+" :-"));
      }


      Promise.all(promises)
      .then((results) => {
          console.log("All done", results);
          resolve(val);
      })
      .catch((e) => {
          // Handle errors here
      });
     
    });
  }

  function downloadTest123(val) {
    return new Promise((resolve) => {
      console.log(val,"download progress started");

      setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

      axios({
        url: 'http://13.57.187.111:3000/download?size=download_'+size,
        cancelToken:CancelTokenVal.token,
        onDownloadProgress(progressEvent) {
          console.log(val,'download progressEvent data = ',progressEvent);
        }
      }).then(response => {
        console.log(val,'download progress finished');
        resolve(val);
      }).catch(function (error) {
        console.log(val,'download progress error = ',error);
        resolve(val);
      });
    });
  }


  function doSomethingAsync(val) {
    return new Promise((resolve) => {
      console.log("doSomethingAsync doSomethingAsync " + val);

      setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

      axios({
        url: 'http://13.57.187.111:3000/download?size=download_'+size,
        cancelToken:CancelTokenVal.token,
        onDownloadProgress(progressEvent) {
          console.log(val,'download progressEvent data = ',progressEvent);
        }
      }).then(response => {
        console.log(val,'download progress finished');
        resolve(val)
      }).catch(function (error) {
        console.log(val,'download progress error = ',error);
        resolve(val)
      });
    });
  }
  
  function test() {
      const promises = [];
      
      for (let i = 0; i < 5; ++i) {
          promises.push(doSomethingAsync(i));
      }
      
      Promise.all(promises)
          .then((results) => {
              console.log("All done", results);
          })
          .catch((e) => {
              // Handle errors here
          });
  }


  function downloadTestxyx (val) {
    console.log(val,"download progress started");

    setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

    axios({
      url: 'http://13.57.187.111:3000/download?size=download_'+size,
      cancelToken:CancelTokenVal.token,
      onDownloadProgress(progressEvent) {
        console.log(val,'download progressEvent data = ',progressEvent);
      }
    }).then(response => {
      console.log(val,'download progress finished');
    }).catch(function (error) {
      console.log(val,'download progress error = ',error);
    });

  }


  function downloadTest12345 () {
    downloadTestxyx("stream1");
    downloadTestxyx("stream2");
    downloadTestxyx("stream3");
    downloadTestxyx("stream4");
  }


  const SubmitHandle = (event) => {
    // uploadTest();
    downloadTest12345();
    // test();
  }



  function uploadTest () {

    console.log('uploadTest');

    if(file === undefined || file === null) {
      const LEN = sizeObjVal[size];
      const arr = new Array(LEN).fill(0);  
      console.log("Create file for Upload going on");
  
      var txtFile = "upload_"+size;
      file = new File(arr, txtFile,{
        type: "text/plain",
      });
      console.log("Create file for Upload Completed");
    }


    uploadTest123("stream1");
    uploadTest123("stream2");
    uploadTest123("stream3");
    uploadTest123("stream4");
  }

  function uploadTest123 (streamVal) {

    console.log(streamVal,"upload progress started file = ",file);

    const CancelTokenVal = axios.CancelToken.source();

    setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    axios({
      url: 'http://13.57.187.111:3000/publish',
      method: "post",
      headers:{
        'content-type': 'multipart/form-data',
      },
      data: formData,
      cancelToken:CancelTokenVal.token,
      onUploadProgress(progressEvent) {
        console.log(streamVal,'upload progressEvent data = ',progressEvent);
      }
    }).then(response => {
      console.log(streamVal,'upload progress finished');
    }).catch(function (error) {
      console.log(streamVal,'upload progress error = ',error);
    });

  }

  return (
    <Box sx={{ flexGrow: 1 }} my={2}>
      <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
        {/* <Grid item xs={12} sm={6} md={6} lg={6} my={2}>
          <Item onClick={downloadTest}>Download HTTP Test Case</Item>
        </Grid>
        <Grid item xs={12} sm={6}  md={6} lg={6} my={2}>
          <Item onClick={uploadTest}>Upload HTTP Test Case</Item>
        </Grid> */}
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={handletypeChange}
              >
                <MenuItem value={"upload"}>Upload</MenuItem>
                <MenuItem value={"download"}>Download</MenuItem>
                <MenuItem value={"bidirectional"}>Bi-Directional</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2} >
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Iterations</InputLabel>
              <Select
                value={iterations}
                label="Iterations"
                onChange={handleiterationsChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2} >
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Stream Count</InputLabel>
              <Select
                value={streamCount}
                label="Stream Count"
                onChange={handlestreamCountChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2} >
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                label="Size"
                onChange={handlesizeChange}
              >
                <MenuItem value={"5M"}>5 MB</MenuItem>
                <MenuItem value={"50M"}>50 MB</MenuItem>
                <MenuItem value={"100M"}>100 MB</MenuItem>
                <MenuItem value={"500M"}>500 MB</MenuItem>
                <MenuItem value={"1G"}>1 GB</MenuItem>
                <MenuItem value={"2G"}>2 GB</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2} >
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Time-Out in Seconds</InputLabel>
              <Select
                value={timeOut}
                label="Time-Out in Seconds"
                onChange={handletimeOutChange}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={45}>45</MenuItem>
                <MenuItem value={60}>60</MenuItem>
                <MenuItem value={90}>90</MenuItem>
                <MenuItem value={120}>120</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
          <Box ml={2}>
            <Button variant="contained" onClick={SubmitHandle}>Submit</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

 // function downloadHandle (val) {
    //     console.log(val,"downloadHandle progress started");
    
    //     const CancelTokenVal = axios.CancelToken.source();

    //     setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);
    
    //     axios({
    //       url: 'http://13.57.187.111:3000/download?size=download_'+size,
    //       cancelToken:CancelTokenVal.token,
    //       onDownloadProgress(progressEvent) {
    //         console.log(val,'downloadHandle progressEvent data = ',progressEvent);
    //       }
    //     }).then(response => {
    //       console.log(val,'downloadHandle progress finished');
    //     }).catch(function (error) {
    //       console.log(val,'downloadHandle progress error = ',error);
    //     });
    
    // }

    // function uploadHandle (streamVal) {

    //     console.log(streamVal,"uploadHandle progress started file = ",file);
    
    //     const CancelTokenVal = axios.CancelToken.source();
    
    //     setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);
    
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('fileName', file.name);
    
    //     axios({
    //       url: 'http://13.57.187.111:3000/publish',
    //       method: "post",
    //       headers:{
    //         'content-type': 'multipart/form-data',
    //       },
    //       data: formData,
    //       cancelToken:CancelTokenVal.token,
    //       onUploadProgress(progressEvent) {
    //         console.log(streamVal,'uploadHandle progressEvent data = ',progressEvent);
    //       }
    //     }).then(response => {
    //       console.log(streamVal,'uploadHandle progress finished');
    //     }).catch(function (error) {
    //       console.log(streamVal,'uploadHandle progress error = ',error);
    //     });
    
    // }