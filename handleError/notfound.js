const notFoundMiddleWare = (err, req, res, next)=>{
    console.log(err);
    return res.status(404).json({msg: "Page not found!"})
    next(err)
}

module.exports = notFoundMiddleWare