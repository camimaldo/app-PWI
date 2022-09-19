
const express = require('express');

require('dotenv').config(); // ejecuta la funcion 
 // busca los procesos    
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const async = require('hbs/lib/async');
const app = express();
const PORT = process.env.PORT || 8080;
     
                
                                               
// Conexion a la Base de Datos 
 const conexion = mysql.createConnection({
   
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}); 

       
//Hacer funcionar
 
conexion.connect(function(err){
    if (err){
        console.log(`Error en la Conexion  !!! ${err.stack} `);
        return;
    }
    console.log(`Conectado a la Base de Datos ${process.env.DATABASE} `);
}) 



// Configurar Middelwares -- esto siempre va adelante del app. use get set (rutas)
app.use(express.json()); 
app.use(express.urlencoded({extended:false})); 
app.use(express.static(path.join(__dirname, 'public')));
  
// Configuracion del Motor de Plantillas 
app.set('view engine', 'hbs'); 
app.set('views' ,path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res ,next) =>{
    res.render('index', { 
        titulo: 'Bienvenidos a Snopy'
    } )
} )    
    
app.get('/somos', (req, res) =>{
    res.render('somos',{
        titulo: 'Quienes Somos..',
      
    })
} ); 
 

app.get('/suscripcion', (req, res)=>{
    res.render('suscripcion', {
        titulo: 'Formulario de Suscripcion'
    });   
})

app.post('/suscripcion', (req, res) =>{
    
    const{ nombre, email } = req.body;
 
     
 
    if(nombre == '' || email == '' ){

        let validacion = 'Rellene los campos vacios...';
    
        res.render('suscripcion', {
            titulo: 'Formulario de Suscripcion',
            validacion
        });
       }else{   
          console.log(nombre);
          console.log(email);
 
           
         async function envioMail(){ 
            let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',   
            port: 465, 
            secure: true, 
            auth: { 
                user: process.env.USEREMAIL,  
                pass: process.env.PASS 
            }
           });                
         
 
         let envio = await transporter.sendMail({
            from: process.env.USEREMAIL, 
            to: `${email}`, 
            subject: 'Gracias por suscribirse a nuestro Blog Snopy', 
            html: 'Muchas gracias por contactar con nosostros, estaremos enviando su novedades a la brevedad. <br> Todas nuestras promociones ya estan a su disposicion' // CUERPO DEL MENSJ, se puede enviar fotos pero habria que enviarles un object no un subject
         }) 

          res.render('enviado',{
            titulo: 'Mail Enviado',
            nombre,
            email  
          })
         }
         envioMail(); // lo ejecuto
        }
})  

app.get('/adopcion', (req, res)=>{
    res.render('adopcion', {
        titulo: 'Formulario de Adopcion'
    });   
})

 app.post('/adopcion' , (req, res)=>{
    
   

    const {nombre, mascota} = req.body;
  
   console.log(nombre,  mascota);

   if(nombre == '' || mascota == '' ){

    let validacion = 'Rellene los campos vacios...';

    res.render('adopcion', {
        titulo: 'Formulario de Adopcion',
        validacion
    });
   }else{
     let datos =  {
        nombre: nombre, 
        mascota: mascota
     }; 

     let sql = 'INSERT INTO adopcion SET ?'; 
      
     conexion.query(sql,datos,(err,result)=>{ 
        if(err) throw err;
        res.render('adopcion', {
            titulo: 'Formulario para Adopcion'
        }); 
     });

      res.render('adopcion' , { 
         titulo: 'Formulario para Adopcion',
         style: 'style.css'

      });
    } 
}); 
 
app.get('/adopciones', (req, res) =>{ 

    res.render('adopciones', {
        titulo: 'Animales Adoptados'
    }); 
    let sql = 'SELECT * FROM adopcion';  
      
      conexion.query(sql,(err,result)=>{ 
       
        if(err) throw err;
        res.render('adopciones', {
            titulo: 'Animales Adoptados',
           results: result,    
        });  
     }
     ) 
} )

 

app.get('/caniche', (req, res) =>{
    res.render('caniche',{
        titulo: 'Caniche ',
      
    }) 
} ); 
   
app.get('/siames', (req, res) =>{
    res.render('siames',{
        titulo: 'Siames ',
      
    })
} ); 

app.get('/hamster', (req, res) =>{
    res.render('hamster',{
        titulo: 'Hamster  ',
      
    })
} ); 

app.get('/golden', (req, res) =>{
    res.render('golden',{
        titulo: 'Golden  ',
      
    })
} );   

app.get('/pug', (req, res) =>{
    res.render('pug',{
        titulo: 'Pug  ', 
      
    }) 
} ); 

app.get('/sanbernardo', (req, res) =>{
    res.render('sanbernardo',{
        titulo: 'San Bernardo  ',
      
    }) 
} ); 

app.listen(PORT, () => {
    console.log(`El servidor esta trabajando en el Puerto ${PORT}`
     );
} );



  