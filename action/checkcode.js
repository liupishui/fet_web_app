module.exports = async (context, app, param ,setup)=>{
    context.session.start();
    let svgCaptcha = app.lib['svg-captcha']();
    context.type('svg');
    let captcha = svgCaptcha.create({ignoreChars:'0o1i',color:true});
    context.session.set('captcha',captcha.text);
    return context.res.write(captcha.data);
}