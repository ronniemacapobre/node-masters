const { pokemonService } = require('../services');
const url = require('url');

const writeSuccessResponse = (res, result) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(result));
  res.end();
};

const writeFailedResponse = (res, result) => {
  res.writeHead(400, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(result));
  res.end();
};

exports.handleGetRequest = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);

  const data = searchParams.has('name')
    ? pokemonService.getByName(searchParams.get('name'))
    : pokemonService.get();

  const result = { data };

  writeSuccessResponse(res, result);
};

exports.handlePostRequest = (req, res) => {
  const data = [];

  req.on('data', (chunk) => {
    data.push(chunk);
  });

  req.on('end', () => {
    const parsedData = Buffer.concat(data).toString();
    const dataJson = JSON.parse(parsedData);

    const result = pokemonService.insert(dataJson);

    if (!result.success) {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      res.write(JSON.stringify(result));
      res.end();
    }

    writeSuccessResponse(res, result);
  });
};

exports.handlePutRequest = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);

  if (!searchParams.has('name')) {
    writeFailedResponse(res, {
      success: false,
      errorMessage: 'Name parameter not found.',
    });
  }

  const data = [];

  req.on('data', (chunk) => {
    data.push(chunk);
  });

  req.on('end', () => {
    const parsedData = Buffer.concat(data).toString();
    const dataJson = JSON.parse(parsedData);

    const result = pokemonService.update(searchParams.get('name'), dataJson);

    if (!result.success) writeFailedResponse(res, result);
    else writeSuccessResponse(res, result);
  });
};

exports.handleDeleteRequest = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);

  if (!searchParams.has('name')) {
    writeFailedResponse(res, {
      success: false,
      errorMessage: 'Name parameter not found.',
    });
  }

  const name = searchParams.get('name');
  const result = pokemonService.delete(name);
  if (!result.success) writeFailedResponse(res, result);
  else writeSuccessResponse(res, result);
};
