const express = require('express');
const router_movie = require('./routes/movies');
const router_authentic = require('./routes/authentic');
const router_user = require('./routes/user');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const app = express()

app.use(morgan('tiny'))
app.use(express.json());
app.use('/',router_movie);
app.use('/',router_authentic)
app.use('/',router_user)

const option = {
    definition: {
        openapi : '3.0.0',
        info:{
            title : 'API-SWAGGER',
            version : '0.1.0',
            description : 'Homewirk Week 9'
        }, servers : [{
            url : 'http://localhost:3000'
        }]
    },
    apis: ['./routes/*'] 
}

const specs = swaggerjsdoc(option)
app.use(
    '/api-docs',
    swaggerui.serve,
    swaggerui.setup(specs, {explorer : true})
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
