const jsonServer = require('json-server');
const copyfiles = require('copyfiles');
const rimraf = require('rimraf');

if(0)
	rimraf('./demo/server/tmp');

copyfiles([
	'./demo/server/db/db.json',
	'./demo/server/tmp' // Destination path
], true, ()=>{});

const server = jsonServer.create();
const router = jsonServer.router('./demo/server/tmp/db.json');
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
  res.jsonp({
    data: res.locals.data
  });
};

server.use(middlewares);
server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
})
