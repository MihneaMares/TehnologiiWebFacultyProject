//process.env => atributele sunt definite in config/dev.env pentru a nu fi vizibile in cod
//env-cmd (npm i env-cmd / npm install (daca fisierul package.json specifica aceasta dependenta)) necesar
//nodemon (idem ^)

//comanda de rulare: env-cmd -f ./config/dev.env nodemon src/index.js

const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
	console.log('Server is up on http://localhost:' + port);
});
