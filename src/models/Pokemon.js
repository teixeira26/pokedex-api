const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {


  // defino el modelo
  //No hace falta agregar el campo id ya que sequelize crea este campo por defecto si no lo declaramos
  sequelize.define('pokemon', {
    id:{
      type: Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4,
      allowNull:false,
      primaryKey:true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vida:{
      type: DataTypes.INTEGER,
    },
    fuerza:{
      type: DataTypes.INTEGER,
    },
    defensa: {
      type: DataTypes.INTEGER,
    },
    velocidad:{
      type: DataTypes.INTEGER
    },
    altura: {
      type: DataTypes.INTEGER,
    },
    peso: {
      type: DataTypes.INTEGER
    },
    imagen:{
      type: DataTypes.TEXT,
    }, 
    createdinDb:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull:false,
    }
  }, 
  //Se añade el parametro options para que y se setea timestamps en false para que no se muestre el created at y updated at
  {
    timestamps: false,
  });
};
