const { default: axios } = require('axios');
const { Router , json} = require('express');
const {Pokemon, Tipo} = require('../db.js');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(json());




router.get('/', async function(request, response){
    try {

        let resDB = await Pokemon.findAll({
            include: Tipo,
        });
        let res = await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=80');
        const {data} = res;
        //console.log(data.results);
        const datosCards = [];
        console.log(datosCards.length>0?datosCards:'loading');


        // for (let index = 0; index < data.results.length; index++) {
        //     await axios.get(data.results[index].url).then(x=>{
        //         let vida;
        //         let fuerza;
        //         let velocidad;
        //         let defensa;
        //         x.data.stats.forEach(element => {
        //             if(element.stat.name === 'hp') vida = element.base_stat;
        //             if(element.stat.name === 'defense') defensa = element.base_stat;
        //             if(element.stat.name === 'speed') velocidad = element.base_stat;
        //             if(element.stat.name === 'attack') fuerza = element.base_stat;
        //         });
        //         datosCards.push({
        //         id:x.data.id,
        //         nombre: x.data.name,
        //         vida: vida,
        //         fuerza: fuerza,
        //         velocidad: velocidad,
        //         defensa: defensa,
        //         altura: x.data.height,
        //         peso: x.data.weight,
        //         tipos: x.data.types.map(x=>x.type.name),
        //         image:x.data.sprites.other['official-artwork'].front_default
        //         })
        //     })
        // }


        //  console.log(resDB);
        const dataToPromise = data.results.map(x=>axios.get(x.url));
        dataResolved = await Promise.all(dataToPromise)
        dataToShow = dataResolved.map(x=>{
            return{
                id: x.data.id,
                nombre: x.data.name,
                altura: x.data.height,
                peso: x.data.weight,
                tipos: x.data.types.map(x=>x.type.name),
                image:x.data.sprites.other['official-artwork'].front_default,
                vida: x.data.stats[0].base_stat,
                fuerza: x.data.stats[1].base_stat,
                defensa: x.data.stats[2].base_stat,
                velocidad: x.data.stats[5].base_stat

            }
        })
        // console.log(dataToShow);
        // response.json(datosCards.concat(resDB));
        response.json(dataToShow.concat(resDB))
    } catch (error) {
        response.send('no ingresaste correctamente lo que buscas');
    }
})


router.get('/pokemons', async(request, response)=>{
    console.log(request.query)
    if(request.query.name){
        try {
            console.log(`https://pokeapi.co/api/v2/pokemon/${request.query.name}`);
            let resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${request.query.name}`);
            //console.log(resp);
            let vida;
            let fuerza;
            let velocidad;
            let defensa;
            resp.data.stats.forEach(element => {
                 if(element.stat.name === 'hp') vida = element.base_stat;
                 if(element.stat.name === 'defense') defensa = element.base_stat;
                 if(element.stat.name === 'speed') velocidad = element.base_stat;
                 if(element.stat.name === 'attack') fuerza = element.base_stat;
            });
            const obj = {
                id: resp.data.id,
                name:resp.data.name,
                peso: resp.data.weight,
                altura:resp.data.height,
                tipo: resp.data.types.map(x=>x.type.name),
                vida:vida,
                fuerza:fuerza,
                velocidad:velocidad,
                defensa:defensa,
                image:resp.data.sprites.other['official-artwork'].front_default
    
            }
            console.log(obj);
            response.json(obj);
    
        } catch (error) {
            response.json('no se encontró un pokemon con este nombre');
        }
    }
    response.send('debés inserir una query')
   
})

router.get('/pokemons/:id', async(request, response)=>{
    try {
        if(request.params.id.length < 10){
            console.log(`https://pokeapi.co/api/v2/pokemon/${request.params.id}`);
            let resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${request.params.id}`);
            //console.log(resp);
            let vida;
            let fuerza;
            let velocidad;
            let defensa;
            resp.data.stats.forEach(element => {
                if(element.stat.name === 'hp') vida = element.base_stat;
                if(element.stat.name === 'defense') defensa = element.base_stat;
                if(element.stat.name === 'speed') velocidad = element.base_stat;
                if(element.stat.name === 'attack') fuerza = element.base_stat;
            });
            const obj = {
                id: resp.data.id,
                name:resp.data.name,
                peso: resp.data.weight,
                altura:resp.data.height,
                tipo: resp.data.types.map(x=>x.type.name),
                vida:vida,
                fuerza:fuerza,
                velocidad:velocidad,
                defensa:defensa,
                image:resp.data.sprites.other['official-artwork'].front_default

            }
            console.log(obj);
            response.json(obj);
        }
        let resDB = await Pokemon.findAll({
            where:{id:request.params.id},
            include: Tipo,
        });
        resDB[0].tipos = resDB[0].tipos.map(x=>x.nombre);
        response.send(resDB[0]);

    } catch (error) {
        response.json('no encontramos nada');
    }
})

router.post('/pokemons', async (request, response)=>{
    const {nombre, vida, velocidad, peso, altura, fuerza, defensa, tipos, imagen} = request.body;
    try {
        const nuevoPokemon = await Pokemon.create({
            nombre,  vida, fuerza, defensa, velocidad, altura, peso, imagen
        });
        
        let pokemonAlterar = await Pokemon.findByPk(nuevoPokemon.id)
        let tiposid = tipos.map(x=>{
            return Tipo.findAll({
            where:{nombre:x}
        })})
        tiposid = await (await Promise.all(tiposid)).flat();
        tiposid = tiposid.map(x=>x.id);
        const devolver = await pokemonAlterar.addTipo(tiposid);
        console.log('funcionó')
        response.json(devolver);
    } catch (error) {
        console.log(error)
        response.json(error);
    }
    
});

router.get('/types', async(request, response)=>{
    try {
        const values = await axios.get('https://pokeapi.co/api/v2/type');
        const finalValues = values.data.results.map(element=>element.name);
        // console.log(finalValues);
        finalValues.forEach( x=>{
            Tipo.findOrCreate({
            where:{nombre:x}
         }).catch(error=>console.log(error));
        })
        console.log('sucess');
        response.json(finalValues)
    } catch (error) {
        response.json(error);
    }
})

router.post('/algo', async(request, response)=>{
    try {
        const data = request.body.tipo;
        Tipo.findOrCreate({
            where:{tipo:data}
        })
        response.json('si');
    } catch (error) {
        response.json(error)
    }
})
router.get('/test', (request, response)=>{
    console.log(request.query);
})
module.exports = router;
