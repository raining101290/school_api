const Pool = require('pg').Pool
/*   const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})   */
/*  const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}); 
 */

/* Host
    ec2-54-205-26-79.compute-1.amazonaws.com
Database
    d1ma7sdj6mnvfd
User
    optjokvxwduoug
Port
    5432
Password
    cf7805cabb7988ab1446af0bb15c10092ff0954f0b6f6ed9bfaea71fa85747ad */

/*  const pool = new Pool({
  user: 'dkzhpbzl',
  host: 'suleiman.db.elephantsql.com',
  database: 'dkzhpbzl',
  password: 'MF0_SQjSrQiEyNxUagX7O53Gzyn1FR8v',
  port: 5432,
}) */
 
const pool = new Pool({
  user: 'foilpncdqpalzt',
  host: 'ec2-52-20-248-222.compute-1.amazonaws.com',
  database: 'd2of8vmsb45ohn',
  password: '103461d56df61276fbda13736e9821f55e491ba23c63f9ee7ade04501b71796a',
  port: 5432,
})
 

const getUsers = (request, response) => {
  
    pool.query('SELECT * FROM reg ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const getAllarea = (request, response) => {
  
    pool.query('SELECT * FROM xdist ORDER BY distid ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM reg WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  // test for insert into users database
  const createUser = (request, response) => {
    const { email, name } = request.body
  
    pool.query('INSERT INTO users (email, name) VALUES ($1, $2)', [email, name], (error, results) => {
      if (error) {
        throw error
      }
     // response.status(201).send(`User added with ID: ${result.insertId}`)
     response.status(201).json({ status: 'success', message: 'Book added.' })
    })
    
  }
/*   const checkEmailaddress = (request, response) => {
    const { email } = request.body
  
    pool.query('select * from reg where email = $1', [email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
    
  } */
  const checkEmailaddress = (request, response) => {
    const { email } = request.body
  
    pool.query('select email from reg where email = $1', [email], (error, results) => {
      if (error) {
        throw error
      }
      //response.status(200).json(results.rows)
	  //https://www.youtube.com/watch?v=EIWffC6_6o4
////////////////////////////////////////////////////////
				var rowCount = results.rows.length;
                console.log("Row count: %d",rowCount);
				console.log('Total' + rowCount);
                for(var i = 0; i < rowCount; ++i){
                    console.log(results.rows[i].email);
                }	  
				//response.status(200).json(rowCount)
				if(rowCount > 0)
				{
				  response.status(201).json({ status: 'found', message: 'found data' })	
				}
				else{
					response.status(201).json({ status: 'notfound', message: 'nofound data' })
				}
////////////////////////////////////////////////////////	  
	  
    })
    
  }
  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE reg SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }
  
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }
  
  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllarea,
    checkEmailaddress,
  }
  