exports.swaggerOptions = {
    swaggerDefinition : {
        openapi: '3.0.0',
        info: {
            title: 'Тестовое задание для Эталон Шевчук Алексей',
            version: '1.0.0',
            contact: {
                name: 'Шевчук Алексей Викторович',
                contactphone: '89507272031',
            },
        },
    },
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};
exports.dbConfig = {
    host : 'localhost',
    port : 3306,
    user : 'root',
    database : 'hotel',
    password : 'root',
};



