//create  node clusters to multiprocess our applications
const clusters = require('cluster');
const os = require('os').cpus().length;

//if the master cluster is running
if (clusters.isMaster){
    console.log(`process ${process.pid} is currently running`)

    //fork the workers
    for (var i =0; i < os;i++){
        clusters.fork();
    }

    clusters.on('exit',(worker, code, signal) => {
        console.error(`worker ${worker.process.pid} died`);
      });

} else { 
        const app = require('./app');
        
        const port=process.env.PORT

        app.listen(port, ()=> {
            console.log(`server running  on port ${port}`)

        })
        
        console.log(`worker ${process.pid} has started`)



}
