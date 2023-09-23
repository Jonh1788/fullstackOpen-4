

const errorHandler = (err, req, res, next) => {

	if(err.name === 'ValidationError'){
	return res.status(400).send({error: err.message})
	}

	if(err.name === 'CastError'){
	return res.status(400).send({error:err.message})
	}

	next(err)
}

module.exports = errorHandler
