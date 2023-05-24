import React, { useState } from "react";
import {
  Box,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";
import ReactJson from "react-json-view";

const sizeObjVal = {
  "1M": 1048576,
  "5M": 5242880,
  "50M": 52428800,
  "100M": 104857600,
  "500M": 524288000,
  "1G": 1073741824,
  "2G": 2147483648,
  "4G": 4294967296,
  "8G": 2 * 4294967296,
};

const chunkSizeVal = {
  "8K": 0.125 * 256 * 256,
  "16K": 0.25 * 256 * 256,
  "32K": 0.5 * 256 * 256,
  "64K": 1 * 256 * 256,
  "128K": 1 * 256 * 512,
  "256K": 1 * 256 * 1024,
  "512K": 1 * 512 * 1024,
  "1M": 1 * 1024 * 1024,
  "2M": 2 * 1024 * 1024,
  "4M": 4 * 1024 * 1024,
  "8M": 8 * 1024 * 1024,
  "16M": 16 * 1024 * 1024,
  "32M": 32 * 1024 * 1024,
  "64M": 64 * 1024 * 1024,
  "128M": 128 * 1024 * 1024,
  "256M": 256 * 1024 * 1024,
  "512M": 512 * 1024 * 1024,
  "1G": 1024 * 1024 * 1024,
  "2G": 2 * 1024 * 1024 * 1024,
};

// const chunkSize = 1048576 * 1; // its 1 MB,
// const chunkSize = 5242880; // its 5 MB,
// const chunkSize = 10485760; // its 10 MB,

function App() {
  // var file;
  const [result, setResult] = useState({});
  // const CancelTokenVal = axios.CancelToken.source();

  const [type, setType] = useState("download"); // download/upload/bidirectional
  const [iterations, setIterations] = useState(1); // 1, 2, 3, 4, 5, 6
  const [streamCount, setStreamCount] = useState(6); // 1, 2, 3, 4, 5, 6
  const [size, setSize] = useState("2G"); // 5M, 50M, 100M, 500M, 1G , 2G
  const [chunkSize, setChunkSize] = useState("4M"); // 8k,16K,32K,64K,128K,256K,512K,1M,2M,4M,8M
  const [timeOut, setTimeOut] = useState(30); // in seconds , 5, 10, 15, 20, 30, 40, 45, 60, 90, 120
  const [url, setUrl] = useState("127.0.0.1");

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
  const handleChunkSizeChange = (event) => {
    setChunkSize(event.target.value);
  };
  const handletimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  function v4() {
    let uuid = "",
      i,
      random;
    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
        16
      );
    }
    return uuid;
  }
  function getRandomData(bufferSize = 64 * 1024) {
    const buffer = new Float32Array(new ArrayBuffer(bufferSize));
    for (let index = 0; index < buffer.length; index++) {
      buffer[index] = Math.random();
    }
    return buffer;
  }

  const bufferVal = getRandomData();

  function getRandomBlob(size) {
    const data = [];
    for (let i = 0; i < size / bufferVal.byteLength; i++) {
      data.push(bufferVal);
    }
    return new Blob(data, {
      type: "application/octet-stream",
    });
  }

  let speedValueHttpDownload = [];
  let speedValueHttpUpload = [];
  let myInterval = null;

  function callSetIntervalFunc() {
    const startTimeInterval = Date.now();
    myInterval = setInterval(() => {
      // const lengthSpeedValArray = speedValueHttp.length
      //   console.log(
      //     "myInterval speedValueHttpDownload = ",
      //     JSON.stringify(speedValueHttpDownload, null, 4)
      //   );
      const lengthSpeedValArrayDownload = speedValueHttpDownload.length;
      const lengthSpeedValArrayUpload = speedValueHttpUpload.length;
      let finalSpeedValArr = [];
      let finalSpeedValArrUpd = [];
      if (lengthSpeedValArrayDownload > 0) {
        for (const prop of speedValueHttpDownload) {
          if (prop && Object.keys(prop).length !== 0) {
            finalSpeedValArr.push(prop);
          }
        }
      }
      if (finalSpeedValArr.length > 0) {
        let average_bps = 0;
        finalSpeedValArr.forEach((item) => {
          average_bps += item.speed_bps_num;
        });
        // finalSpeedValArr.forEach((item) => {
        //   // average_bps += item.speed_bps_num;
        //   console.log(" item.timeDiffArVal = ", item.timeDiffArVal);
        //   console.log(" chunkSizeVal[chunkSize] = ", chunkSizeVal[chunkSize]);
        //   // const sum = item.timeDiffArVal.reduce((a, b) => a + b, 0);
        //   // const avg = sum / item.timeDiffArVal.length || 0;
        //   let avg = Math.min.apply(null, item.timeDiffArVal);
        //   console.log(" bps = ", (chunkSizeVal[chunkSize] / avg) * 1000);
        //   average_bps += (chunkSizeVal[chunkSize] / avg) * 1000 * 8;
        // });
        // const average_starttime = (
        //   finalSpeedValArr.reduce((a, b) => a + b.timeDiff_sec_num, 0) /
        //   finalSpeedValArr.length
        // ).toFixed(4);
        const average_starttime = (
          (Date.now() - startTimeInterval) /
          1000
        ).toFixed(4);
        let httpdataCheck = "";
        httpdataCheck += `HTTP Download:-  average_Mbps = ${(
          average_bps / 1000000
        ).toFixed(4)} , average_starttime ${average_starttime} \n`;
        console.log(httpdataCheck);
        // speedValueHttpDownload = new Array(lengthSpeedValArrayDownload).fill(
        //   {}
        // );
        finalSpeedValArr = [];
      }

      if (lengthSpeedValArrayUpload > 0) {
        for (const prop of speedValueHttpUpload) {
          if (prop && Object.keys(prop).length !== 0) {
            finalSpeedValArrUpd.push(prop);
          }
        }
      }
      if (finalSpeedValArrUpd.length > 0) {
        let average_bps = 0;
        finalSpeedValArrUpd.forEach((item) => {
          average_bps += item.speed_bps_num;
        });
        const average_starttime = (
          finalSpeedValArrUpd.reduce((a, b) => a + b.timeDiff_sec_num, 0) /
          finalSpeedValArrUpd.length
        ).toFixed(4);
        let httpdataCheck = "";
        httpdataCheck += `HTTP Upload:-  average_Mbps = ${(
          average_bps / 1000000
        ).toFixed(4)} , average_starttime ${average_starttime} \n`;
        console.log(httpdataCheck);
        // speedValueHttp = new Array(lengthSpeedValArray).fill({})
        speedValueHttpUpload = new Array(lengthSpeedValArrayUpload).fill({});
        finalSpeedValArrUpd = [];
      }
    }, 1000);
  }

  function oneMoreTime() {
    // const lengthSpeedValArray = speedValueHttp.length
    //   console.log(
    //     "myInterval speedValueHttpDownload = ",
    //     JSON.stringify(speedValueHttpDownload, null, 4)
    //   );
    const lengthSpeedValArrayDownload = speedValueHttpDownload.length;
    const lengthSpeedValArrayUpload = speedValueHttpUpload.length;
    let finalSpeedValArr = [];
    let finalSpeedValArrUpd = [];
    if (lengthSpeedValArrayDownload > 0) {
      for (const prop of speedValueHttpDownload) {
        if (prop && Object.keys(prop).length !== 0) {
          finalSpeedValArr.push(prop);
        }
      }
    }
    if (finalSpeedValArr.length > 0) {
      let average_bps = 0;
      finalSpeedValArr.forEach((item) => {
        average_bps += item.speed_bps_num;
      });
      // finalSpeedValArr.forEach((item) => {
      //   // average_bps += item.speed_bps_num;
      //   console.log(" item.timeDiffArVal = ", item.timeDiffArVal);
      //   console.log(" chunkSizeVal[chunkSize] = ", chunkSizeVal[chunkSize]);
      //   // const sum = item.timeDiffArVal.reduce((a, b) => a + b, 0);
      //   // const avg = sum / item.timeDiffArVal.length || 0;
      //   let avg = Math.min.apply(null, item.timeDiffArVal);
      //   console.log(" bps = ", (chunkSizeVal[chunkSize] / avg) * 1000);
      //   average_bps += (chunkSizeVal[chunkSize] / avg) * 1000 * 8;
      // });
      // const average_starttime = (
      //   finalSpeedValArr.reduce((a, b) => a + b.timeDiff_sec_num, 0) /
      //   finalSpeedValArr.length
      // ).toFixed(4);
      let httpdataCheck = "";
      httpdataCheck += `HTTP Download final:-  average_Mbps = ${(
        average_bps / 1000000
      ).toFixed(4)}  \n`;
      console.log(httpdataCheck);
      // speedValueHttpDownload = new Array(lengthSpeedValArrayDownload).fill(
      //   {}
      // );
      finalSpeedValArr = [];
    }

    if (lengthSpeedValArrayUpload > 0) {
      for (const prop of speedValueHttpUpload) {
        if (prop && Object.keys(prop).length !== 0) {
          finalSpeedValArrUpd.push(prop);
        }
      }
    }
    if (finalSpeedValArrUpd.length > 0) {
      let average_bps = 0;
      finalSpeedValArrUpd.forEach((item) => {
        average_bps += item.speed_bps_num;
      });
      const average_starttime = (
        finalSpeedValArrUpd.reduce((a, b) => a + b.timeDiff_sec_num, 0) /
        finalSpeedValArrUpd.length
      ).toFixed(4);
      let httpdataCheck = "";
      httpdataCheck += `HTTP Upload:-  average_Mbps = ${(
        average_bps / 1000000
      ).toFixed(4)} , average_starttime ${average_starttime} \n`;
      console.log(httpdataCheck);
      // speedValueHttp = new Array(lengthSpeedValArray).fill({})
      speedValueHttpUpload = new Array(lengthSpeedValArrayUpload).fill({});
      finalSpeedValArrUpd = [];
    }
  }

  function uploadHandleAsync(iterVal, streamVal) {
    return new Promise((resolve) => {
      const val = `upload-iteration-${iterVal + 1},Stream:-${streamVal + 1}`;
      console.log(val, "uploadHandleAsync progress started");
      const startTime = Date.now();

      const obj = {
        type: "upload",
        protocol: "http",
        IterationCount: iterVal,
        StreamCount: streamVal,
        StartTime: startTime,
        dataLengthUpload_bytes: null,
        progressPercent: null,
        EndTime: null,
        timeDiff_ms: null,
        uploadSpeed_Mbps: null,
        speed_bps_num: null,
        timeDiff_sec_num: null,
        uplinkVal: true,
      };
      //   const formData = new FormData();
      // const blob = new Blob(file.data, { type: file.type })
      //   formData.append("file", JSON.stringify(file.data), file.name);

      let request = new XMLHttpRequest();

      setTimeout(function () {
        request.abort();
        // clearInterval(myInterval);
      }, timeOut * 1000);

      let progress = 0;
      // var counterUpload = 500;
      // const counterUpload = sizeObjVal[size] / chunkSize;
      const counterUpload = sizeObjVal[size] / chunkSizeVal[chunkSize];
      console.log(val, "uploadHandleAsync counterUpload = ", counterUpload);

      function getAxiosLoop() {
        request = null;
        request = new XMLHttpRequest();
        // request.open("POST", `http://${url}:3001/publish`);
        // request.setRequestHeader('content-type', 'multipart/form-data')
        // request.send(formData)
        // request.setRequestHeader("Content-Type", "application/octet-stream");
        // request.send(binaryImage);

        ///new///
        // request.timeout = 10000;
        // request.open("POST", `http://${url}:3001/upload_new?${v4()}`, true);
        request.open(
          "POST",
          `http://${url}:3001/upload_new?nocache=${v4()}&streamVal=${streamVal}`,
          true
        );
        request.setRequestHeader("Content-Encoding", "identity");
        request.send(getRandomBlob(chunkSizeVal[chunkSize]));
        ///new///

        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status === 200) {
            // eslint-disable-next-line no-unused-expressions
            url !== "127.0.0.1"
              ? console.log(
                  val,
                  "uploadHandleAsync progress finished progress = ",
                  progress
                )
              : null;

            const endTime = Date.now();
            obj.EndTime = endTime;
            obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
            obj.progressPercent = `${((progress / counterUpload) * 100).toFixed(
              2
            )} %`;
            // obj.dataLengthUpload_bytes = (counterUpload / progress) * chunkSize
            // obj.dataLengthUpload_bytes = sizeObjVal[sizevalue]
            // obj.dataLengthUpload_bytes = progress * chunkSize;
            obj.dataLengthUpload_bytes = progress * chunkSizeVal[chunkSize];
            obj.uploadSpeed_Mbps = `${(
              (obj.dataLengthUpload_bytes /
                (1024 * 1024) /
                ((endTime - startTime) / 1000)) *
              8
            ).toFixed(4)} Mbps`;
            obj.speed_bps_num = Number(
              (
                (obj.dataLengthUpload_bytes / ((endTime - startTime) / 1000)) *
                8
              ).toFixed(4)
            );
            obj.timeDiff_sec_num = Number(
              ((endTime - startTime) / 1000).toFixed(4)
            );
            speedValueHttpUpload[streamVal] = obj;
            if (progress === counterUpload) {
              //   clearInterval(myInterval);
              resolve(obj);
            } else {
              progress += 1;
              getAxiosLoop();
            }
          } else {
            console.log(val, progress, "uploadHandleAsync progress error = ");
            const endTime = Date.now();
            obj.EndTime = endTime;
            obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
            obj.progressPercent = `${((progress / counterUpload) * 100).toFixed(
              2
            )} %`;
            // obj.dataLengthUpload_bytes = progress * chunkSize;
            obj.dataLengthUpload_bytes = progress * chunkSizeVal[chunkSize];
            obj.uploadSpeed_Mbps = `${(
              (obj.dataLengthUpload_bytes /
                (1024 * 1024) /
                ((endTime - startTime) / 1000)) *
              8
            ).toFixed(4)} Mbps`;
            obj.speed_bps_num = Number(
              (
                (obj.dataLengthUpload_bytes / ((endTime - startTime) / 1000)) *
                8
              ).toFixed(4)
            );
            obj.timeDiff_sec_num = Number(
              ((endTime - startTime) / 1000).toFixed(4)
            );
            speedValueHttpUpload[streamVal] = obj;
            // clearInterval(myInterval);
            resolve(obj);
          }
        };
      }
      getAxiosLoop();
    });
  }
  // function downloadHandleAsync(iterVal, streamVal) {
  //   return new Promise((resolve) => {
  //     const val = `download-iteration-${iterVal + 1},Stream:-${streamVal + 1}`;
  //     console.log(val, "downloadHandleAsync progress started url = ", url);

  //     const obj = {
  //       type: "download",
  //       protocol: "http",
  //       IterationCount: iterVal,
  //       StreamCount: streamVal,
  //       // StartTime: startTime,
  //       StartTime: null,
  //       ChunkSizeVal: chunkSize,
  //       dataLengthDownload_bytes: null,
  //       progressPercent: null,
  //       EndTime: null,
  //       timeDiff_ms: null,
  //       downloadSpeed_Mbps: null,
  //       speed_bps_num: null,
  //       timeDiff_sec_num: null,
  //       uplinkVal: false,
  //     };

  //     let request = new XMLHttpRequest();

  //     setTimeout(function () {
  //       request.abort();
  //       // clearInterval(myInterval);
  //     }, timeOut * 1000);

  //     let progress = 0;
  //     // var counterUpload = 500;
  //     // const counterDownload = sizeObjVal[size] / chunkSize;
  //     const counterDownload = sizeObjVal[size] / chunkSizeVal[chunkSize];
  //     console.log(
  //       val,
  //       "downloadHandleAsync counterDownload = ",
  //       counterDownload
  //     );
  //     let startTime;

  //     function getAxiosLoop() {
  //       request = null;
  //       request = new XMLHttpRequest();
  //       // request.open('GET', `http://${url}:3001/download_inf?size=download_1M`)
  //       // url === "106.51.104.242"
  //       //   ? request.open("GET", `http://${url}:5001/download?size=download_1M`)
  //       //   : request.open("GET", `http://${url}:3001/download?size=download_1M`);

  //       //New///
  //       // request.timeout = 10000;
  //       // request.open(
  //       //   "GET",
  //       //   `http://${url}:8080/download?nocache=${v4()}&&streamVal=${streamVal}size=${
  //       //     chunkSizeVal[chunkSize]
  //       //   }`,
  //       //   true
  //       // );
  //       // request.open("GET", `http://${url}:3001/download_new?${v4()}`, true);
  //       request.open(
  //         "GET",
  //         `http://${url}:3001/download_new_size?nocache=${v4()}&streamVal=${streamVal}&size=${
  //           chunkSizeVal[chunkSize]
  //         }`,
  //         true
  //       );

  //       request.send(null);

  //       if (progress === 0) {
  //         startTime = Date.now();
  //         obj.StartTime = startTime;
  //       }
  //       //New///

  //       //   request.open("GET", `http://${url}:3001/download?size=download_1M`);
  //       // request.send();
  //       request.onreadystatechange = (e) => {
  //         if (request.readyState !== 4) {
  //           return;
  //         }

  //         if (request.status === 200) {
  //           // eslint-disable-next-line no-unused-expressions
  //           url !== "127.0.0.1"
  //             ? console.log(
  //                 val,
  //                 "downloadHandleAsync progress finished progress = ",
  //                 progress
  //               )
  //             : null;
  //           const endTime = Date.now();
  //           obj.EndTime = endTime;
  //           obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
  //           obj.progressPercent = `${(
  //             (progress / counterDownload) *
  //             100
  //           ).toFixed(2)} %`;
  //           // obj.dataLengthDownload_bytes = (counterDownload / progress) * chunkSize
  //           //   obj.dataLengthDownload_bytes = sizeObjVal[size];
  //           // obj.dataLengthDownload_bytes = progress * chunkSize;
  //           obj.dataLengthDownload_bytes = progress * chunkSizeVal[chunkSize];
  //           obj.downloadSpeed_Mbps = `${(
  //             (obj.dataLengthDownload_bytes /
  //               (1024 * 1024) /
  //               ((endTime - startTime) / 1000)) *
  //             8
  //           ).toFixed(4)} Mbps`;
  //           obj.speed_bps_num = Number(
  //             (
  //               (obj.dataLengthDownload_bytes /
  //                 ((endTime - startTime) / 1000)) *
  //               8
  //             ).toFixed(4)
  //           );
  //           obj.timeDiff_sec_num = Number(
  //             ((endTime - startTime) / 1000).toFixed(4)
  //           );
  //           speedValueHttpDownload[streamVal] = obj;
  //           if (progress === counterDownload) {
  //             //   clearInterval(myInterval);
  //             resolve(obj);
  //           } else {
  //             progress += 1;
  //             getAxiosLoop();
  //             // cancelTokenCheckLoop()
  //           }
  //         } else {
  //           console.log(val, progress, "downloadHandleAsync progress error = ");
  //           const endTime = Date.now();
  //           obj.EndTime = endTime;
  //           obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
  //           obj.progressPercent = `${(
  //             (progress / counterDownload) *
  //             100
  //           ).toFixed(2)} %`;
  //           // obj.dataLengthDownload_bytes = progress * chunkSize;
  //           obj.dataLengthDownload_bytes = progress * chunkSizeVal[chunkSize];
  //           obj.downloadSpeed_Mbps = `${(
  //             (obj.dataLengthDownload_bytes /
  //               (1024 * 1024) /
  //               ((endTime - startTime) / 1000)) *
  //             8
  //           ).toFixed(4)} Mbps`;
  //           obj.speed_bps_num = Number(
  //             (
  //               (obj.dataLengthDownload_bytes /
  //                 ((endTime - startTime) / 1000)) *
  //               8
  //             ).toFixed(4)
  //           );
  //           obj.timeDiff_sec_num = Number(
  //             ((endTime - startTime) / 1000).toFixed(4)
  //           );
  //           speedValueHttpDownload[streamVal] = obj;
  //           // clearInterval(myInterval);
  //           resolve(obj);
  //         }
  //       };
  //     }
  //     getAxiosLoop();
  //   });
  // }

  function downloadHandleAsync(iterVal, streamVal) {
    return new Promise((resolve) => {
      const val = `download-iteration-${iterVal + 1},Stream:-${streamVal + 1}`;
      console.log(val, "downloadHandleAsync progress started url = ", url);

      // const startTime = Date.now();
      const obj = {
        type: "download",
        protocol: "http",
        IterationCount: iterVal,
        StreamCount: streamVal,
        // StartTime: startTime,
        StartTime: null,
        ChunkSizeVal: chunkSize,
        dataLengthDownload_bytes: null,
        progressPercent: null,
        EndTime: null,
        timeDiff_ms: null,
        downloadSpeed_Mbps: null,
        speed_bps_num: null,
        timeDiff_sec_num: null,
        uplinkVal: false,
        timeDiffArVal: [],
      };

      let request = new XMLHttpRequest();

      setTimeout(function () {
        request.abort();
        // clearInterval(myInterval);
      }, timeOut * 1000);

      let progress = 0;
      // var counterUpload = 500;
      // const counterDownload = sizeObjVal[size] / chunkSize;
      const counterDownload = sizeObjVal[size] / chunkSizeVal[chunkSize];
      console.log(
        val,
        "downloadHandleAsync counterDownload = ",
        counterDownload
      );

      let startTime;
      // let loadStartTime, loadEndTime;
      let valueForAbort;
      function handleEvent(e) {
        // console.log(
        //   e.type,
        //   val,
        //   progress,
        //   new Date().toISOString(),
        //   `: ${e.loaded} bytes transferred\n`
        // );
        if (e.type !== "abort") {
          valueForAbort = e.loaded;
        }

        if (e.loaded > e.size / 20 && Date.now() - startTime > 0) {
          obj.speed_bps_num = Number(
            ((e.loaded / ((Date.now() - startTime) / 1000)) * 8).toFixed(4)
          );
          obj.timeDiff_sec_num = Number(
            ((Date.now() - startTime) / 1000).toFixed(4)
          );
          speedValueHttpDownload[streamVal] = obj;

          // if (
          //   speedValueHttpDownload[streamVal] &&
          //   speedValueHttpDownload[streamVal].speed_bps_num < obj.speed_bps_num
          // ) {
          // } else speedValueHttpDownload[streamVal] = obj;
        }
        if (e.type === "abort") {
          console.log("abort valueForAbort = ", valueForAbort);
          const endTime = Date.now();
          obj.EndTime = endTime;
          obj.timeDiffArVal.push(endTime - startTime);
          obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
          obj.progressPercent = `${((progress / counterDownload) * 100).toFixed(
            2
          )} %`;
          // obj.dataLengthDownload_bytes = progress * chunkSize;
          obj.dataLengthDownload_bytes =
            progress * chunkSizeVal[chunkSize] + valueForAbort;
          obj.downloadSpeed_Mbps = `${(
            (valueForAbort / (1024 * 1024) / ((endTime - startTime) / 1000)) *
            8
          ).toFixed(4)} Mbps`;
          obj.speed_bps_num = Number(
            ((valueForAbort / ((endTime - startTime) / 1000)) * 8).toFixed(4)
          );
          obj.timeDiff_sec_num = Number(
            ((endTime - startTime) / 1000).toFixed(4)
          );
          speedValueHttpDownload[streamVal] = obj;
          // clearInterval(myInterval);
          setTimeout(() => {
            resolve(obj);
          }, 1000);
        }

        // if (e.type === "loadstart") {
        //   loadStartTime = Date.now();
        //   console.log(val, progress, "loadStartTime = ", loadStartTime);
        // }
        // if (e.type === "loadend") {
        //   loadEndTime = Date.now();
        //   console.log(val, progress, "loadEndTime = ", loadEndTime);
        //   console.log(
        //     val,
        //     progress,
        //     "diff time = ",
        //     loadEndTime - loadStartTime
        //   );
        //   obj.timeDiffArValFromLoad.push(loadEndTime - loadStartTime);
        // }
      }
      function getAxiosLoop() {
        request = null;
        request = new XMLHttpRequest();
        request.addEventListener("loadstart", handleEvent);
        request.addEventListener("load", handleEvent);
        request.addEventListener("loadend", handleEvent);
        request.addEventListener("progress", handleEvent);
        request.addEventListener("error", handleEvent);
        request.addEventListener("abort", handleEvent);
        // request.open('GET', `http://${url}:3001/download_inf?size=download_1M`)
        // url === "106.51.104.242"
        //   ? request.open("GET", `http://${url}:5001/download?size=download_1M`)
        //   : request.open("GET", `http://${url}:3001/download?size=download_1M`);

        //New///
        // request.timeout = 10000;
        // request.open(
        //   "GET",
        //   `http://${url}:8080/download?nocache=${v4()}&streamVal=${streamVal}&size=${
        //     chunkSizeVal[chunkSize]
        //   }`,
        //   true
        // );
        // request.open("GET", `http://${url}:3001/download_new?${v4()}`, true);
        request.open(
          "GET",
          `http://${url}:3001/download_new_size?nocache=${v4()}&streamVal=${streamVal}&size=${
            chunkSizeVal[chunkSize]
          }`,
          true
        );

        request.send(null);
        startTime = Date.now();
        // console.log(val, progress, "startTime = ", startTime);
        //New///

        //   request.open("GET", `http://${url}:3001/download?size=download_1M`);
        // request.send();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status === 200) {
            // eslint-disable-next-line no-unused-expressions
            // url !== "127.0.0.1"
            //   ? console.log(
            //       val,
            //       "downloadHandleAsync progress finished progress = ",
            //       progress
            //     )
            //   : null;
            progress += 1;
            const endTime = Date.now();
            obj.EndTime = endTime;
            // console.log(val, progress, "endTime = ", endTime);
            // console.log(val, progress, "sep diff time = ", endTime - startTime);

            obj.timeDiffArVal.push(endTime - startTime);

            obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
            obj.progressPercent = `${(
              (progress / counterDownload) *
              100
            ).toFixed(2)} %`;
            // obj.dataLengthDownload_bytes = (counterDownload / progress) * chunkSize
            //   obj.dataLengthDownload_bytes = sizeObjVal[size];
            // obj.dataLengthDownload_bytes = progress * chunkSize;
            obj.dataLengthDownload_bytes = progress * chunkSizeVal[chunkSize];
            obj.downloadSpeed_Mbps = `${(
              (chunkSizeVal[chunkSize] /
                (1024 * 1024) /
                ((endTime - startTime) / 1000)) *
              8
            ).toFixed(4)} Mbps`;
            obj.speed_bps_num = Number(
              (
                (chunkSizeVal[chunkSize] / ((endTime - startTime) / 1000)) *
                8
              ).toFixed(4)
            );
            obj.timeDiff_sec_num = Number(
              ((endTime - startTime) / 1000).toFixed(4)
            );
            speedValueHttpDownload[streamVal] = obj;
            if (progress >= counterDownload) {
              //   clearInterval(myInterval);
              setTimeout(() => {
                oneMoreTime();
                resolve(obj);
              }, 1000);
            } else {
              // progress += 1;
              getAxiosLoop();
              // cancelTokenCheckLoop()
            }
          } else {
            console.log(val, progress, "downloadHandleAsync progress error = ");
          }
        };
      }
      getAxiosLoop();
    });
  }

  function downloadHandleAsync1(iterVal, streamVal) {
    return new Promise((resolve) => {
      const val = `download-iteration-${iterVal + 1},Stream:-${streamVal + 1}`;
      console.log(val, "downloadHandleAsync progress started url = ", url);
      const startTime = Date.now();
      const obj = {
        type: "download",
        protocol: "http",
        IterationCount: iterVal,
        StreamCount: streamVal,
        StartTime: startTime,
        ChunkSizeVal: "not used",
        dataLengthDownload_bytes: null,
        progressPercent: null,
        EndTime: null,
        timeDiff_ms: null,
        downloadSpeed_Mbps: null,
        speed_bps_num: null,
        timeDiff_sec_num: null,
        uplinkVal: false,
      };

      let request = new XMLHttpRequest();

      setTimeout(function () {
        request.abort();
        // clearInterval(myInterval);
        resolve(obj);
      }, timeOut * 1000);

      //   let progress = 0;
      // var counterUpload = 500;
      const counterDownload = sizeObjVal[size] / chunkSize;
      console.log(
        val,
        "downloadHandleAsync counterDownload = ",
        counterDownload
      );
      function handleEvent(e) {
        console.log(`${e.type}: ${e.loaded} bytes transferred of ${e.total}\n`);
        const endTime = Date.now();
        obj.EndTime = endTime;
        obj.timeDiff_ms = `${endTime - startTime} milliseconds`;
        obj.progressPercent = `${((e.loaded / e.total) * 100).toFixed(2)} %`;
        obj.dataLengthDownload_bytes = e.loaded;
        obj.downloadSpeed_Mbps = `${(
          (obj.dataLengthDownload_bytes /
            (1024 * 1024) /
            ((endTime - startTime) / 1000)) *
          8
        ).toFixed(4)} Mbps`;
        obj.speed_bps_num = Number(
          (
            (obj.dataLengthDownload_bytes / ((endTime - startTime) / 1000)) *
            8
          ).toFixed(4)
        );
        obj.timeDiff_sec_num = Number(
          ((endTime - startTime) / 1000).toFixed(4)
        );
        speedValueHttpDownload[streamVal] = obj;
      }

      request = null;
      request = new XMLHttpRequest();
      request.overrideMimeType("text/plain");
      request.addEventListener("progress", handleEvent);
      request.open("GET", `http://${url}:3001/download?size=download_${size}`);
      request.send();
      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          //   clearInterval(myInterval);
          resolve(obj);
        }
      };
    });
  }

  function uploadEacIterationHandle(iterVal) {
    return new Promise((resolve) => {
      const promises = [];
      for (let i = 0; i < streamCount; ++i) {
        promises.push(uploadHandleAsync(iterVal, i));
      }
      Promise.all(promises)
        .then((results) => {
          // console.log("All done", results);
          resolve(results);
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
        promises.push(downloadHandleAsync(iterVal, i));
      }
      Promise.all(promises)
        .then((results) => {
          // console.log("All done", results);
          resolve(results);
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
      for (let i = 0; i < streamCount; ++i) {
        promises.push(uploadHandleAsync(iterVal, i));
        promises.push(downloadHandleAsync(iterVal, i));
      }
      Promise.all(promises)
        .then((results) => {
          console.log("All done", results);
          resolve(results);
        })
        .catch((e) => {
          // Handle errors here
          // Promise.resolve(e)
        });
    });
  }

  async function uploadStreamIterationHandle() {
    console.log("uploadStreamIterationHandle");
    const iterationCounterArray = Array.from(Array(Number(iterations)).keys());
    console.log(
      "uploadStreamIterationHandle iterationCounterArray = ",
      iterationCounterArray
    );

    for (const prop of iterationCounterArray) {
      var resultObj = await uploadEacIterationHandle(prop);
      console.log("uploadStreamIterationHandle prop = ", resultObj);
      clearInterval(myInterval);
      // eslint-disable-next-line no-loop-func
      setResult((resultCurrent) => {
        const updateresult = resultCurrent;
        updateresult.iterations[prop] = resultObj;
        console.log(
          "uploadStreamIterationHandle update result = ",
          JSON.stringify(updateresult, null, 4)
        );
        return { ...updateresult };
      });
    }
  }

  async function downloadStreamIterationHandle() {
    console.log("downloadStreamIterationHandle");
    const iterationCounterArray = Array.from(Array(Number(iterations)).keys());
    console.log(
      "downloadStreamIterationHandle iterationCounterArray = ",
      iterationCounterArray
    );

    for (const prop of iterationCounterArray) {
      var resultObj = await downloadEacIterationHandle(prop);
      // console.log("downloadStreamIterationHandle prop = ", resultObj);
      clearInterval(myInterval);
      // eslint-disable-next-line no-loop-func
      setResult((resultCurrent) => {
        const updateresult = resultCurrent;
        updateresult.iterations[prop] = resultObj;
        // console.log(
        //   "downloadStreamIterationHandle update result = ",
        //   JSON.stringify(updateresult, null, 4)
        // );
        return { ...updateresult };
      });
    }
  }

  async function bidirectionalStreamIterationHandle() {
    console.log("bidirectionalStreamIterationHandle");
    const iterationCounterArray = Array.from(Array(Number(iterations)).keys());
    console.log(
      "bidirectionalStreamIterationHandle iterationCounterArray = ",
      iterationCounterArray
    );

    for (const prop of iterationCounterArray) {
      var resultObj = await bidirectionalEacIterationHandle(prop);
      console.log("bidirectionalEacIterationHandle prop = ", resultObj);
      clearInterval(myInterval);
      // eslint-disable-next-line no-loop-func
      setResult((resultCurrent) => {
        const updateresult = resultCurrent;
        updateresult.iterations[prop] = resultObj;
        console.log(
          "bidirectionalEacIterationHandle update result = ",
          JSON.stringify(updateresult, null, 4)
        );
        return { ...updateresult };
      });
    }
  }

  const SubmitHandle = (event) => {
    console.log("SubmitHandle type = ", type);
    console.log("SubmitHandle iterations = ", iterations);
    console.log("SubmitHandle streamCount = ", streamCount);
    console.log("SubmitHandle size = ", size);
    console.log("SubmitHandle timeOut = ", timeOut);

    let streams = new Array(streamCount).fill({});
    let iterationArray = new Array(iterations).fill({ streams });

    var objUpd = {
      type: type,
      iterationsCount: iterations,
      streamsCount: streamCount,
      timeOut: timeOut,
      size: size,
      iterations: iterationArray,
    };

    setResult(objUpd);

    // if (type === "upload") {
    //   uploadStreamIterationHandle();
    // } else if (type === "bidirectional") {
    //   bidirectionalStreamIterationHandle();
    // } else if (type === "download") {
    //   downloadStreamIterationHandle();
    // }
    if (type === "download") {
      callSetIntervalFunc();
      downloadStreamIterationHandle();
    }
    if (type === "upload") {
      callSetIntervalFunc();
      uploadStreamIterationHandle();
    }

    if (type === "bidirectional") {
      callSetIntervalFunc();
      bidirectionalStreamIterationHandle();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }} my={2}>
      <Grid
        container
        spacing={{ xs: 2, md: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={handletypeChange}>
                <MenuItem value={"download"}>Download</MenuItem>
                <MenuItem value={"upload"}>Upload</MenuItem>
                <MenuItem value={"bidirectional"}>Bi-Directional</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
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
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
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
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select value={size} label="Size" onChange={handlesizeChange}>
                <MenuItem value={"1M"}>1 MB</MenuItem>
                <MenuItem value={"5M"}>5 MB</MenuItem>
                <MenuItem value={"50M"}>50 MB</MenuItem>
                <MenuItem value={"100M"}>100 MB</MenuItem>
                <MenuItem value={"500M"}>500 MB</MenuItem>
                <MenuItem value={"1G"}>1 GB</MenuItem>
                <MenuItem value={"2G"}>2 GB</MenuItem>
                <MenuItem value={"4G"}>4 GB</MenuItem>
                <MenuItem value={"8G"}>8 GB</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel>Chunk Size</InputLabel>
              <Select
                value={chunkSize}
                label="ChunkSIze"
                onChange={handleChunkSizeChange}
              >
                <MenuItem value={"8K"}>8 KB</MenuItem>
                <MenuItem value={"16K"}>16 KB</MenuItem>
                <MenuItem value={"32K"}>32 KB</MenuItem>
                <MenuItem value={"64K"}>64 KB</MenuItem>
                <MenuItem value={"128K"}>128 KB</MenuItem>
                <MenuItem value={"256K"}>256 KB</MenuItem>
                <MenuItem value={"512K"}>512 KB</MenuItem>
                <MenuItem value={"1M"}>1 MB</MenuItem>
                <MenuItem value={"2M"}>2 MB</MenuItem>
                <MenuItem value={"4M"}>4 MB</MenuItem>
                <MenuItem value={"8M"}>8 MB</MenuItem>
                <MenuItem value={"16M"}>16 MB</MenuItem>
                <MenuItem value={"32M"}>32 MB</MenuItem>
                <MenuItem value={"64M"}>64 MB</MenuItem>
                <MenuItem value={"128M"}>128 MB</MenuItem>
                <MenuItem value={"256M"}>256 MB</MenuItem>
                <MenuItem value={"512M"}>512 MB</MenuItem>
                <MenuItem value={"1G"}>1 GB</MenuItem>
                <MenuItem value={"2G"}>2 GB</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
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
            <FormControl fullWidth>
              <InputLabel>URL Select</InputLabel>
              <Select
                value={url}
                label="URL pointing"
                onChange={handleUrlChange}
              >
                <MenuItem value={"127.0.0.1"}>127.0.0.1</MenuItem>
                <MenuItem value={"198.255.103.2"}>
                  198.255.103.2-CAL_PFX
                </MenuItem>
                <MenuItem value={"3.111.130.233"}>
                  3.111.130.233-MUM_AWS
                </MenuItem>
                <MenuItem value={"106.51.104.242"}>
                  106.51.104.242-BNG_SRV
                </MenuItem>
                <MenuItem value={"3.101.31.163"}>3.101.31.163-CAL_AWS</MenuItem>
                <MenuItem value={"138.199.12.80"}>
                  138.199.12.80-SEA-PFX
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4} md={2} lg={2} my={2}>
        <Box ml={2}>
          <Button variant="contained" onClick={SubmitHandle}>
            Submit
          </Button>
        </Box>
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
