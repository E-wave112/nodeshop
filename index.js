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
    //declare the required modules
        const app = require('./app');
        const port=process.env.PORT;
        const mongoose = require('mongoose');

        const connectDB = async () =>{
            try {
                const connect = await mongoose.connect(process.env.dbURI, 
                {useCreateIndex:true,
                useUnifiedTopology:true,
                useNewUrlParser:true
            },
            console.log('connected to db'))
            
            } catch (err) {
                console.error(err)
                process.exit(1)
            }
        }
        connectDB()

        app.listen(port, ()=> {
            console.log(`server running  on port ${port}`)

        })
        
        console.log(`worker ${process.pid} has started`)

}
