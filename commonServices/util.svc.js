var jwt = require('jsonwebtoken');

exports.getMongodbUrl = () => {
    let mongoConnectionUrl = process.env.MONGODB_URL || 'mongodb://localhost/khorochKhata';
    mongoConnectionUrl = mongoConnectionUrl.replace("<password>", process.env.MONGODB_USER_PASSWORD);
    mongoConnectionUrl = mongoConnectionUrl.replace("<databasename>", process.env.MONGO_DATABASE_NAME);
    return mongoConnectionUrl;
}

exports.generateToken = user => {
    return jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email
    },
    process.env.JWT_SECRET || "somethingSecret",
    {
        expiresIn: '30d'
    })
}

exports.objectIsEmpty = object => {
    return (!object || Object.keys(object).length == 0)
}




