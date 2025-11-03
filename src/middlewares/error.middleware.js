const errorMiddleware = async (err, req, res, next) => {
    try {
      let error = {...err}
      
      error.message = err.message;
      console.error(err);
  
      if(error.message == 'CastError'){
          const message = 'Resource not found. Invalid: ' + err.message;
          error = new Error(message);
          error.statusCode = 404;
      }
  
      //mongose duplicate key error
      if(err.code === 11000){
          const message = 'Duplicate field value entered';
          error = new Error(message);
          error.statusCode = 400;
      }
  
      //Mongoose validation error
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map(value => value.message)
          .join(', ');
        error = new Error(message);
        error.statusCode = 400;
      }
  
      res.status(error.statusCode || 500).json({
          success: false,
          message: error.message || 'Internal Server Error'
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  export default errorMiddleware;