module.exports = async (context,app,param)=>{
    let os = app.require('os');
    let sysinfo = {};
    // console.log(process.memoryUsage());
    if(app.LRU && app.LRU.has('sysinfo')){
        sysinfo = app.LRU.get('sysinfo');
    }else{
        sysinfo.port = app.server.address().port;
        sysinfo.cpuModel = os.cpus()[0].model;
        sysinfo.cpuNum = os.cpus().length;
        sysinfo.hostname = os.hostname();
        let networkInterfaces = os.networkInterfaces();
        for(let x in networkInterfaces){
            for(let i=0;i<networkInterfaces[x].length;i++){
                if(typeof(sysinfo.ipAddress)==='undefined'){
                    if(networkInterfaces[x][i].family==='IPv4'){
                        sysinfo.ipAddress = networkInterfaces[x][i].address;
                        sysinfo.mac = networkInterfaces[x][i].mac;
                    }    
                }
            }
        }
        sysinfo.machine = os.machine();
        sysinfo.totalmem = os.totalmem();
        sysinfo.freemem = os.freemem();
        sysinfo.version = os.version();
        sysinfo.uptime = os.uptime();
        sysinfo.userinfo = os.userInfo().username;
        sysinfo.appmemu = process.memoryUsage().heapTotal;
        app.LRU.set('sysinfo',sysinfo);
    }
    // https://nodejs.cn/api/os.html#os_os_homedir
    // CPU型号 os.cpus()[0].model
    // cup核心个数 os.cpus().length;
    // 其编译 Node.js 二进制文件的操作系统 CPU 架构 64位/32位 os.arch()
    // 返回程序应使用的默认并行度的估计值 os.availableParallelism();
    //主机名 os.hostname();
    //服务ip地址和mac地址
    // let networkInterfaces = os.networkInterfaces();
    // let ipAddress = '';
    // let mac='';
    // for(let x of networkInterfaces){
    //     for(let i=0;i<x.length;i++){
    //         if(x[i].family==='IPv4'){
    //             ipAddress = x[i].address;
    //             mac = x[i].mac;
    //         }
    //     }
    // }
    // 机器类型,例如 arm、arm64、aarch64、mips、mips64、ppc64、ppc64le、s390、s390x、i386、i686、x86_64
    // os.machine()
    //总内存 os.totalmem()
    //可用内存 os.freemem();
    //操作系统版内部本号 os.release();
    // 操作系统 os.version();
    // 操作系统正常运行时间 os.uptime()小时
    // 登录操作系统的用户名 os.userInfo().username;
    //进程占用内存 process.memoryUsage().rss/1024/1024 M
    let domainInfo = app.tables.domain.get(context.session.get('user').domain_id)[0];
    sysinfo.myDomain = 'http://'+domainInfo.domain_inside+'.qk6080.com';
    return context.render('/view/admin/sysinfo.ejs',sysinfo);
}