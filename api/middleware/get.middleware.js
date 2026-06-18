
module.exports = (req, res, next) => {
    console.log('Middleware exécuté avant le contrôleur')

    if (req.query.toto === 'true') {
        return res.status(403).json({ message: 'Accès interdit' })
    }

    next()
}