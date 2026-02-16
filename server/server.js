import http from "http";
import os from "os";
const serverr=http.createServer((req,res)=>{
    const url=req.url;
    const method=req.method;
    if(url=="/" && method=="GET"){
        res.end("HomePage");
    }
    else if(url=="/contact" && method=="GET"){
        res.end("ContactPage");
    }
    else if(url=="/system" && method=="GET"){
        const sysdata={
            platform:os.platform(),
            Arch:os.arch(),
            CPUlength:os.cpus().length,
            totalMemory:os.totalmem(),
            freeMemory:os.freemem()
        }
        res.write("System Info");
        res.end(JSON.stringify(sysdata));
    }
    else if(url=="/senddata" && method=="POST"){
        let body="";
        req.on("data",(chunk)=>{
            body=body+chunk;
        })
        req.on("end",()=>{
            console.log(body,"Data send successfully");
            res.end(body);
        })
    }
})
serverr.listen(5001,()=>{
    console.log(`server is running on port 5001`)
})