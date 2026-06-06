import setRateLimit from 'express-rate-limit';

const rateLimitMiddleware = setRateLimit({
        windowMs: 1 * 60 * 1000, 
        max: 2,
        message: "Hold on their, maybe get a life instead of spamming my api.",
        standardHeaders: true,
        legacyHeaders: true, 
        skipFailedRequests: true
      });
    


  
//   const rateLimitMiddleware = (req, res, next) => {
  
//    setRateLimit({
//         windowMs: 1 * 60 * 1000, 
//         max: 2,
//         message: "Hold on their, maybe get a life instead of spamming my api.",
//         standardHeaders: true,
//         legacyHeaders: true, 
//         skipFailedRequests: true
//       });
    
       
   
  
//   }
  
  
  export default rateLimitMiddleware
  
  
  