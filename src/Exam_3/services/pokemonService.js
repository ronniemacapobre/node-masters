const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);

db.defaults({ pokemons: [] }).write();

exports.get = () => {
  const pokemons = db.get('pokemons').value();

  return pokemons;
};

exports.getByName = (name) => {
  const pokemon = db
    .get('pokemons')
    .find((val) => {
      return val.name.toLowerCase() === name.toLowerCase();
    })
    .value();

  if (!pokemon)
    return {
      success: false,
      errorMessage: `Pokemon ${name.toUpperCase()} not exist.`,
    };

  return pokemon;
};

exports.insert = (pokemon) => {
  const { name } = pokemon;

  const isPokemonExist =
    db
      .get('pokemons')
      .value()
      .filter((_) => _.name === name).length > 0;

  if (isPokemonExist) {
    return {
      success: false,
      errorMessage: `Pokemon ${name.toUpperCase()} already exist.`,
    };
  }

  db.get('pokemons').push(pokemon).write();

  return {
    success: true,
  };
};

exports.update = (name, pokemon) => {
  const isPokemonExist =
    db
      .get('pokemons')
      .value()
      .filter((_) => _.name === name).length > 0;

  if (!isPokemonExist)
    return {
      success: false,
      errorMessage: `Pokemon ${name.toUpperCase()} not exist.`,
    };

  const { type, generation } = pokemon;

  if (!type)
    return {
      success: false,
      errorMessage: `Missing type`,
    };

  db.get('pokemons')
    .find({ name })
    .assign({
      type,
      generation,
    })
    .write();

  return {
    success: true,
  };
};

exports.delete = (name) => {
  const isPokemonExist =
    db
      .get('pokemons')
      .value()
      .filter((_) => _.name === name).length > 0;

  if (!isPokemonExist) {
    return {
      success: false,
      errorMessage: `Pokemon ${name.toUpperCase()} does not exist.`,
    };
  }

  db.get('pokemons').remove({ name }).write();

  return {
    success: true,
  };
};
