const { response } = require('express');
const { buscarZonaCercanaPost } = require('../middlewares/buscar-zona');
const Order=  require('../models/orders');
const Usuario = require('../models/usuario');
const Driver = require('../models/driver');

const postUbicacion = async(req, res = response) => {

   
    const { miId, estado, ubicacion } = req.body;   
 
    try {

        const usuarioDb    = await Usuario.findOne({miId});
       
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'la Ubicacion no puede ser registrada'
            });
        }
       

        const imput = {
            miId: miId,
            estado: estado,            
            ubicacion: {type: "Point", coordinates: ubicacion},
            mensaje:   { type: "Point",coordinates: [  [-58.984374,-27.451225]  ]}
          
            
        }        
  
        const dist = await buscarZonaCercanaPost(ubicacion);      
        
       
        if(dist <= 2000){
           
            const order = new Order(imput);         
       
            const result = await order.save();
            const coords = result.mensaje.coordinates;
            const points =  coords[coords.length -1];
            const types = result.mensaje.type;


            const data = {
                id: result._id,
                miId: result.miId,
                estado: result.estado,
                ubicacion: result.ubicacion,
                mensaje: { type: types, coordinates: points},
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
            
            return res.status(200).json({data});

        } else{
            
            const data = {
                
                miId: null
            }
            return res.status(201).json({ data});;
        }

        

    } catch (error) {
       
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const removeOrder = async(req = request, res = response) => {   
           
    const {order, miId,  } = req.body;    
       
   try {
    
    
      const UserOrder = await Order.findOneAndUpdate({miId: miId}, {$unset: {miId: "", estado: ""}});                          
     

       if (!UserOrder){
        return res.status(400).json({
           ok: false,
           msg: 'El pedido no puede ser cancelado'
       });
     } 
     
     
     const idDriver = UserOrder.idDriver;        

        await Order.findOneAndUpdate({idDriver: idDriver}, {$unset:{idDriver: ""}});
        await Driver.findOneAndUpdate({_id: idDriver},
             {$set: 
                { order: order,
                    status: 'disponible',
                      upsert: true ,
                       }} );  

      

       const data = {
        UserOrder,                
       } 
                       
       res.json({
           data
       });
   
       } catch (error) {
          
           res.status(500).json({
               ok: false,
               msg: 'Hable con el administrador'
           });
   }
         
}

const finishTravelUser = async(req, res = response) => {

    
    const  idDriver  = req.body.idDriver;
    const  order     = req.body.order; 
 
     try {
 
        const UserOrder = await Order.findOneAndUpdate({idDriver: idDriver},{ $unset: { idDriver: "" }} );
                            await Driver.findOneAndUpdate({_id: idDriver}, {$set: { order: order,  upsert: true }} );                       
       if (!UserOrder){
        return res.status(400).json({
           ok: false,
           msg: 'El conductor no puede ser eliminado'
       });
     }   
     const data = {
        UserOrder,                
    } 
 
         res.json({            
            data
         });
 
     } catch (error) {
        
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         });
     }
 }
 



const getUbicaciones = async(req, res = response) => {
    
    try {

        const orders = await Order.find({ $and: [{ _id: { $ne: req._id }}, {estado: true}]})
        .sort({createdAt: 'asc'})
        
        if (!orders) {
            return res.status(404).json({
                ok: false,
                msg: 'las ordenes no puede ser halladas'
            });
        }       
        

        res.json({            
            
            orders

        });

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const getUbicacionesAutomatic = async(res= response ) => {
    
        const idAdmin = '6439d6398dbdb6d5224e0bd6';
        const idOrderNull =  [{miId: "1"}];
    try {

        const data = await Order.find({ $and: [{ _id: { $ne: idAdmin }}, {estado: true}]})
        .sort({createdAt: 'asc'})
        .limit(20)       
        
         const obj = await comprobarNull(data);        
        
         if (obj === null) {           
        
            return idOrderNull ;
        } else {
            return obj;
        }      
        
        

    } catch (error) {
       
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const comprobarNull = async (resultado) => {

    let result = [];
    const idOrderNull =  [{miId: "1"}];    
    let len = resultado.length;

    if(len !== 0){

    for(let i= 0; i < len; i++){

        if(resultado[i].length !== 0 ){

            const obj = resultado[i];            
            result.push(obj)
            
        }
        
    } 
    return result;
} else{
    return idOrderNull;
}
    
    
}


module.exports = {
    postUbicacion,
    getUbicaciones,
    finishTravelUser,
    removeOrder,
    getUbicacionesAutomatic
}

