const { Schema, model } = require('mongoose');


// [
//     {
     
//     "productos": [
//       {
//       "id": "lpldsf5148dpl",
//       "tipoCarga": "Carga refrigerada",
//       "peso": {
//         "peso": 1,
//         "unidadPeso": "Toneladas" 
//       },
//       "tamaño":  {
//         "alto": 15,
//         "ancho": 50,
//         "profundidad": 50
//       },
//       "ubicacion": {
//           "calle": "Avenida Chaco",
//           "altura": 1900,
//           "Provincia": "Chaco",
//           "Ciudad": "Resistencia"        
//         },
//       "prioridad": "alta",
//       "estadoSubasta": "abierto"
//     },
//     {
//       "id": "plijmsjhejn2514kdjdj",
//       "tipoCarga": "Carga explosiva",
//       "peso": {
//         "peso": 20,
//         "unidadPeso": "Toneladas" 
//       },
//       "tamaño": {
//         "alto": 15,
//         "ancho": 50,
//         "profundidad": 12
//       },
//       "ubicacion": {
//           "calle": "Avenida Chaco",
//           "altura": 1900,
//           "Provincia": "Chaco",
//           "Ciudad": "Resistencia"        
//         },
//       "prioridad": "baja",
//       "estadoSubasta": "abierto"
//     },
//     {
//       "id": "mbhrosnucv52648kdijjs",
//       "tipoCarga": "Carga vehiculos",
//       "peso": {
//         "peso": 15,
//         "unidadPeso": "Toneladas" 
//       },
//       "tamaño": {
//         "alto": 15,
//         "ancho": 50,
//         "profundidad": 12
//       },
//       "ubicacion": {
//           "calle": "Avenida Chaco",
//           "altura": 1900,
//           "Provincia": "Chaco",
//           "Ciudad": "Resistencia"        
//         },
//       "prioridad": "Media",
//       "estadoSubasta": "abierto"
//     },
//     {
//       "id": "fbcvdol34628pñkah",
//       "tipoCarga": "Carga mascotas",
//       "peso": {
//         "peso": 5,
//         "unidadPeso": "Toneladas" 
//       },
//       "tamaño": {
//         "alto": 15,
//         "ancho": 50,
//         "profundidad": 12
//       },
//       "ubicacion": {
//           "calle": "Avenida Chaco",
//           "altura": 1900,
//           "Provincia": "Chaco",
//           "Ciudad": "Resistencia"        
//         },
//       "prioridad": "Baja",  
//       "estadoSubasta": "abierto"
//     }
//   ],
//     "ofertas": [
//       {
//         "idProducto": "lpldsf5148dpl",
//         "name": "Pablo E. Robledo",
//         "domicilio": {
//           "calle": "Avenida Chaco",
//           "altura": 1900,
//           "Provincia": "Chaco",
//           "Ciudad": "Resistencia"        
//         },
//         "licencia": "Licencia Profesional",
//         "precio": {
//           "moneda": "ARS",
//           "valor": "850.000"
//         },
//         "vehiculo": "Mercedez Benz",
//         "patente": "FG842LM",
//         "modelo": "Modelo 2018",
//         "capacidadDeCarga": {
//           "peso": 5.500,
//           "unidadPeso": "Toneladas" 
//         }
//       },
//       {
//         "idProducto": "lpldsf5148dpl",
//         "name": "Manuel D. Quintana",
//         "domicilio": {
//           "calle": "Avenida 9 de julio",
//           "altura": 3900,
//           "Provincia": "Mendoza",
//           "Ciudad": "capital"        
//         },
//         "licencia": "Licencia Profesional",
//         "precio": {
//           "moneda": "ARS",
//           "valor": "350.000"
//         },
//         "vehiculo": "Mercedez Benz",
//         "patente": "QW768BV",
//         "modelo": "Modelo 2003",
//         "capacidadDeCarga": {
//           "peso": 80.500,
//           "unidadPeso": "Toneladas" 
//         }
//       },
//       {
//         "idProducto": "plijmsjhejn2514kdjdj",
//         "name": "Roque M. Rodriguez",
//         "domicilio": {
//          "calle": "Avenida 3 de Abril",
//           "altura": 3900,
//           "Provincia": "Corrientes",
//           "Ciudad": "capital"        
//         },
//         "licencia": "Licencia Profesional",
//         "precio": {
//          "moneda": "ARS",
//           "valor": "450.000"
//         },
//         "vehiculo": "Mercedez Benz HW",
//         "patente": "AA325OP",
//         "modelo": "Modelo 2024",
//         "capacidadDeCarga": {
//           "peso": 80.500,
//           "unidadPeso": "Toneladas" 
//         }
//       }
//     ]
//   }
//   ]

const OrderSchema = Schema({

    miId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false,
    },

    idDriver: {
        type: Schema.Types.ObjectId, 
        ref: 'Driver',      
        required: false
        
    },    

    estado:{
        type: Boolean,
        required: false
    },

    ubicacion: { 
        type:{
            type: String,            
            enum: ['Point'], 
            required: true,
        },          
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'          
    },  
        
   },

    driverLocation: {

        type:{
            type: String,            
            enum: ['Point'], 
            default: 'Point',
            
        },  
        coordinates: {
            type: Array,
            required: false   
    },    
       
   }, 
    
}, 

{
    timestamps: true
});

OrderSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();    
    return object;
})

module.exports = model('Order', OrderSchema);