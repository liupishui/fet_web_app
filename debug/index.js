const { spawn } = require('child_process');

// 指定 Fet 应用程序的路径
let homedir = require('os').homedir();
const FetPath = `${homedir}/Desktop/fet-win32-x64/Fet.exe`;

// 创建一个子进程并运行 Fet 应用程序
const FetProcess = spawn(FetPath,[`--inspect=9229`,`--remote-debugging-port=9230`]);

// 监听子进程的输出
FetProcess.stdout.on('data', (data) => {
  console.log(`Fet output: ${data}`);
});

// 监听子进程的错误
FetProcess.stderr.on('data', (data) => {
  console.error(`Fet : ${data}`);
});

// 监听子进程的退出事件
FetProcess.on('close', (code) => {
  console.log(`Electron exited with code $${code}`);
});

// 在需要时可以发送消息到 Fet 应用程序
FetProcess.stdin.write('Hello Electron!\n');
FetProcess.stdin.end();