let indexClass = require('../../core/indexClass');
class Ajax extends indexClass {
    // constructor (context,app,param,setup){
    //     super(context,app,param,setup);
    // }
    async run(context,app,param,setup){
        return context.toSTRING('hello world');
    }
}
module.exports = Ajax;

// /* The above class is an example of a JavaScript class that uses async/await to perform asynchronous
// initialization. */
// class MyClass {
//     test=23
//     constructor() {}
//     static async create(context,app) {
//       this.prototype._value = this.asyncInit(context,app);
//       this.prototype.context = context,
//       this.prototype.app = app;
//       return this;
//     }
//     static async asyncInit() {
//       // 执行异步初始化操作
//       console.log(this,arguments);
//       return new Promise(resolve => setTimeout(() => resolve(42), 1000));
//     }
//   }
//   class YouClass extends MyClass{
//     names = 25
//     static async create(a,b){
//         await super.create(a,b);
//         return this;
//     }
//   }
//   (async () => {
//     const myObj = await YouClass.create(1,2);
//     console.log(myObj instanceof MyClass);
//     console.log(myObj); // 输出：MyClass { _value: 42 }
//   })();
  
