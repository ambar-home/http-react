import React, {useState} from 'react';
import {Box, Grid, Select, FormControl, InputLabel, MenuItem,
  Button} from '@mui/material';
import axios from 'axios';
import ReactJson from 'react-json-view'

var sizeObjVal = {
    "5M" : 5242880,
    "50M" : 52428800,
    "100M" : 104857600,
    "500M" : 524288000,
    "1G" : 1073741824,
    "2G" : 2147483648
  };

function App() {

    var file;
    const [result,setResult] = useState({});
    // const CancelTokenVal = axios.CancelToken.source();

    const [type, setType] = useState('download'); // download/upload/bidirectional
    const [iterations, setIterations] = useState(1); // 1, 2, 3, 4, 5, 6 
    const [streamCount, setStreamCount] = useState(4); // 1, 2, 3, 4, 5, 6 
    const [size, setSize] = useState('50M'); // 5M, 50M, 100M, 500M, 1G , 2G
    const [timeOut, setTimeOut] = useState(5); // in seconds , 5, 10, 15, 20, 30, 40, 45, 60, 90, 120

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

    function emptyObjHandleAsync () {
      return new Promise((resolve) => {

        var config = {
          method: 'get',
          url: 'http://13.57.187.111:3000/',
          headers: { }
        };
        
        axios(config)
          .then(function (response) {
            setTimeout(() => {
              resolve({
                type:"empty"
              });
            }, timeOut*500);
          })
          .catch(function (error) {
            setTimeout(() => {
              resolve({
                type:"empty"
              });
            }, timeOut*500);
          });

      });

    }
    function uploadHandleAsync (iterVal,streamVal) {
        return new Promise((resolve) => {
            var val = "upload-iteration-"+(iterVal+1)+",Stream:-"+(streamVal+1);
            // console.log(val,"uploadHandleAsync progress started file = ",file);
            var startTime = Date.now();

            var obj = {
              type: "upload",
              protocol: "http",
              IterationCount: iterVal,
              StreamCount: streamVal,
              StartTime: startTime
            }

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
                console.log(val,'uploadHandleAsync progressEvent data = ',progressEvent);
                obj.dataLengthUpload_bytes = progressEvent.loaded;
                obj.progressPercent = ((progressEvent.progress*100).toFixed(2)) + "%";
              }
            }).then(response => {
              console.log(val,'uploadHandleAsync progress finished');
              var endTime = Date.now();
              obj.EndTime = endTime;
              obj.timeDiff_ms = (endTime-startTime) + " milliseconds";
              obj.uploadSpeed_Mbps = ((obj.dataLengthUpload_bytes/(1024*1024))/((endTime-startTime)/1000)) * 8 + " Mbps";
              // resolve(val);
              resolve(obj);
            }).catch(function (error) {
              console.log(val,'uploadHandleAsync progress error = ',error);
              var endTime = Date.now();
              obj.EndTime = endTime;
              obj.timeDiff_ms = (endTime-startTime) + " milliseconds";
              obj.uploadSpeed_Mbps = ((obj.dataLengthUpload_bytes/(1024*1024))/((endTime-startTime)/1000)) * 8 + " Mbps";
              // resolve(val);
              resolve(obj);
            });
        });
    }

    function downloadHandleAsync (iterVal,streamVal) {
        return new Promise((resolve) => {
            var val = "download-iteration-"+(iterVal+1)+",Stream:-"+(streamVal+1);
            console.log(val,"downloadHandleAsync progress started");

            var startTime = Date.now();

            var obj = {
              type: "download",
              protocol: "http",
              IterationCount: iterVal,
              StreamCount: streamVal,
              StartTime: startTime
            }
    
            const CancelTokenVal = axios.CancelToken.source();
    
            setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);
        
            axios({
              url: 'http://13.57.187.111:3000/download?size=download_'+size,
              method: "get",
              cancelToken:CancelTokenVal.token,
              onDownloadProgress(progressEvent) {
                console.log(val,'downloadHandleAsync progressEvent data = ',progressEvent);
                obj.dataLengthDownload_bytes = progressEvent.loaded;
                obj.progressPercent = ((progressEvent.progress*100).toFixed(2)) + "%";
              }
            }).then(response => {
              console.log(val,'downloadHandleAsync progress finished');
              var endTime = Date.now();
              obj.EndTime = endTime;
              obj.timeDiff_ms = (endTime-startTime) + " milliseconds";
              obj.downloadSpeed_Mbps = ((obj.dataLengthDownload_bytes/(1024*1024))/((endTime-startTime)/1000)) * 8 + " Mbps";
              // resolve(val);
              resolve(obj);
            }).catch(function (error) {
              console.log(val,'downloadHandleAsync progress error = ',error);
              var endTime = Date.now();
              obj.EndTime = endTime;
              obj.timeDiff_ms = (endTime-startTime) + " milliseconds";
              obj.downloadSpeed_Mbps = ((obj.dataLengthDownload_bytes/(1024*1024))/((endTime-startTime)/1000)) * 8 + " Mbps";
              // resolve(val);
              resolve(obj);
            });
        });
    
    }

    function uploadEacIterationHandle(iterVal) {
        return new Promise((resolve) => {
            const promises = [];
            for (let i = 0; i < streamCount; ++i) {
                promises.push(uploadHandleAsync(iterVal,i));
            }
            Promise.all(promises)
                .then((results) => {
                    // console.log("All done", results);
                    resolve(results)
                })
                .catch((e) => {
                    // Handle errors here
                    // Promise.resolve(e)
                });
        });
    }

    function downloadEacIterationHandle(iterVal) {
        return new Promise((resolve) => {
            const promises = [];
            for (let i = 0; i < streamCount; ++i) {
                promises.push(downloadHandleAsync(iterVal,i));
            }
            Promise.all(promises)
                .then((results) => {
                    console.log("All done", results);
                    resolve(results)
                })
                .catch((e) => {
                    // Handle errors here
                    // Promise.resolve(e)
                });
        });
    }

    function bidirectionalEacIterationHandle(iterVal) {
        return new Promise((resolve) => {
            const promises = [];
            promises.push(emptyObjHandleAsync());
            for (let i = 0; i < streamCount; ++i) {
                promises.push(uploadHandleAsync(iterVal,i));
                promises.push(downloadHandleAsync(iterVal,i));
            }
            Promise.all(promises)
                .then((results) => {
                    console.log("All done", results);
                    resolve(results)
                })
                .catch((e) => {
                    // Handle errors here
                    // Promise.resolve(e)
                });
        });
    }

    async function uploadStreamIterationHandle() {
        console.log("uploadStreamIterationHandle");
        var iterationCounterArray = Array.from(Array(Number(iterations)).keys())
        console.log("uploadStreamIterationHandle iterationCounterArray = ",iterationCounterArray);
       
    
        for (const prop of iterationCounterArray) {
            var resultObj = await uploadEacIterationHandle(prop)
            console.log("uploadStreamIterationHandle prop = ",resultObj);
            // eslint-disable-next-line no-loop-func
            setResult(resultCurrent => {
              var updateresult = resultCurrent;
              var newArray = resultObj.filter(function(item)
                {
                  return item.type !== "empty";
                });
              // updateresult.iterations[prop] = resultObj;
              updateresult.iterations[prop] = newArray;
              console.log("uploadStreamIterationHandle updateresult = ",updateresult);
              return {...updateresult};
            });
        }
    }

    async function downloadStreamIterationHandle() {
        console.log("downloadStreamIterationHandle");
        var iterationCounterArray = Array.from(Array(Number(iterations)).keys())
        console.log("downloadStreamIterationHandle iterationCounterArray = ",iterationCounterArray);
    
        for (const prop of iterationCounterArray) {
            var resultObj = await downloadEacIterationHandle(prop);
            console.log("downloadStreamIterationHandle prop = ",resultObj);
            // eslint-disable-next-line no-loop-func
            setResult(resultCurrent => {
              var updateresult = resultCurrent;
              var newArray = resultObj.filter(function(item)
                {
                  return item.type !== "empty";
                });
              // updateresult.iterations[prop] = resultObj;
              updateresult.iterations[prop] = newArray;
              console.log("downloadStreamIterationHandle updateresult = ",updateresult);
              return {...updateresult};
            });
        }
    }

    async function bidirectionalStreamIterationHandle() {
        console.log("bidirectionalStreamIterationHandle");
        var iterationCounterArray = Array.from(Array(Number(iterations)).keys())
        console.log("bidirectionalStreamIterationHandle iterationCounterArray = ",iterationCounterArray);
    
        for (const prop of iterationCounterArray) {
            var resultObj = await bidirectionalEacIterationHandle(prop)
            console.log("bidirectionalEacIterationHandle prop = ",resultObj);
            // eslint-disable-next-line no-loop-func
            setResult(resultCurrent => {
              var updateresult = resultCurrent;
              var newArray = resultObj.filter(function(item)
                {
                  return item.type !== "empty";
                });
              // updateresult.iterations[prop] = resultObj;
              updateresult.iterations[prop] = newArray;
              console.log("bidirectionalEacIterationHandle updateresult = ",updateresult);
              return {...updateresult};
            });
        }
    }

    const SubmitHandle = (event) => {
        console.log("SubmitHandle type = ",type);
        console.log("SubmitHandle iterations = ",iterations);
        console.log("SubmitHandle streamCount = ",streamCount);
        console.log("SubmitHandle size = ",size);
        console.log("SubmitHandle timeOut = ",timeOut);

        let streams = new Array(streamCount).fill({ });
        let iterationArray = new Array(iterations).fill({ streams });


        var objUpd = {
          type: type,
          iterationsCount: iterations,
          streamsCount: streamCount,
          timeOut : timeOut,
          size: size,
          iterations: iterationArray,
        }


        setResult(objUpd);


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
            if(type === "upload") {
                uploadStreamIterationHandle();
            } else if(type === "bidirectional"){
                bidirectionalStreamIterationHandle();
            }
            
          } else if (type === "download") {
            downloadStreamIterationHandle()
            // downloadStreamIterationHandleTest1();
            // downloadStreamIterationHandleTest2();
            // downloadStreamIterationHandleTest3();
            // getGithubData();
          }
    }

    const getGithubData = () => {
      let endpoints = [
        'http://13.57.187.111:3000/download?size=download_'+size,
        'http://13.57.187.111:3000/download?size=download_'+size,
        'http://13.57.187.111:3000/download?size=download_'+size,
        'http://13.57.187.111:3000/download?size=download_'+size,
      ];
      Promise.all(endpoints.map((endpoint,index) => axios.get(endpoint,{
        onDownloadProgress(progressEvent) {
          console.log(index,' getGithubData progressEvent data = ',progressEvent);
        }
      }))).then(([{data: user}, {data: repos}, {data: followers}, {data: followings}] )=> {
        // console.log('user ',user);
        // console.log('repos ',repos);
        // console.log('followings ',followings);
        // console.log('followings ',followings);
      });
    }

    function downloadStreamIterationHandleTest1() {

      const CancelTokenVal = axios.CancelToken.source();
    
      setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

      console.log('promise1 started');
      axios({
        url: 'http://13.57.187.111:3000/download?size=download_'+size,
        method: "get",
        cancelToken:CancelTokenVal.token,
        onDownloadProgress(progressEvent) {
          console.log('promise1 downloadHandleAsync progressEvent data = ',progressEvent);
        }
      }).then((val)=>{
        console.log('promise1 downloadHandleAsync then');
      }).catch((error) => {
        console.log('promise1 downloadHandleAsync catch');
      }) 

      // console.log('promise2 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise2 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise3 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise2 downloadHandleAsync catch');
      // }) 

      // console.log('promise3 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise3 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise3 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise3 downloadHandleAsync catch');
      // }) 

      // Promise.all([promise1, promise2, promise3])
      //   .then((responses) => {
      //       console.log("responses = ",responses);
      //       // do something
      //   })
      //   .catch((error)=>{
      //     console.log("error = ",error);
      //   });
    }

    function downloadStreamIterationHandleTest2() {

      const CancelTokenVal = axios.CancelToken.source();
    
      setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

      // console.log('promise1 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise1 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise1 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise1 downloadHandleAsync catch');
      // }) 

      console.log('promise2 started');
      axios({
        url: 'http://13.57.187.111:3000/download?size=download_'+size,
        method: "get",
        cancelToken:CancelTokenVal.token,
        onDownloadProgress(progressEvent) {
          console.log('promise2 downloadHandleAsync progressEvent data = ',progressEvent);
        }
      }).then((val)=>{
        console.log('promise2 downloadHandleAsync then');
      }).catch((error) => {
        console.log('promise2 downloadHandleAsync catch');
      }) 

      // console.log('promise3 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise3 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise3 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise3 downloadHandleAsync catch');
      // }) 

      // Promise.all([promise1, promise2, promise3])
      //   .then((responses) => {
      //       console.log("responses = ",responses);
      //       // do something
      //   })
      //   .catch((error)=>{
      //     console.log("error = ",error);
      //   });
    }

    function downloadStreamIterationHandleTest3() {

      const CancelTokenVal = axios.CancelToken.source();
    
      setTimeout(function(){ CancelTokenVal.cancel(); }, timeOut*1000);

      // console.log('promise1 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise1 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise1 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise1 downloadHandleAsync catch');
      // }) 

      // console.log('promise2 started');
      // axios({
      //   url: 'http://13.57.187.111:3000/download?size=download_'+size,
      //   method: "get",
      //   cancelToken:CancelTokenVal.token,
      //   onDownloadProgress(progressEvent) {
      //     console.log('promise2 downloadHandleAsync progressEvent data = ',progressEvent);
      //   }
      // }).then((val)=>{
      //   console.log('promise3 downloadHandleAsync then');
      // }).catch((error) => {
      //   console.log('promise2 downloadHandleAsync catch');
      // }) 

      console.log('promise3 started');
      axios({
        url: 'http://13.57.187.111:3000/download?size=download_'+size,
        method: "get",
        cancelToken:CancelTokenVal.token,
        onDownloadProgress(progressEvent) {
          console.log('promise3 downloadHandleAsync progressEvent data = ',progressEvent);
        }
      }).then((val)=>{
        console.log('promise3 downloadHandleAsync then');
      }).catch((error) => {
        console.log('promise3 downloadHandleAsync catch');
      }) 

      // Promise.all([promise1, promise2, promise3])
      //   .then((responses) => {
      //       console.log("responses = ",responses);
      //       // do something
      //   })
      //   .catch((error)=>{
      //     console.log("error = ",error);
      //   });
    }

    return (
        <Box sx={{ flexGrow: 1 }} my={2}>
          <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
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
          <Grid>
            Results
            <Box mx={2} my={2}>
              <ReactJson src={result} />
            </Box>
          </Grid>
        </Box>
      );
}

export default App;
