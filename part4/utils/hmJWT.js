const crypto = require('crypto')

const sign = (objeto, secret) => {

	const objetoString = JSON.stringify(objeto)
	const iv = crypto.randomBytes(16)
	const pass = crypto.scryptSync(secret, 'salt', 32)
	const cipher = crypto.createCipheriv("aes-256-cbc", 
	pass, iv)
	let encryptedData = cipher.update(objetoString,
	'utf-8',
	'hex')
	encryptedData += cipher.final('hex')
	return `${encryptedData}.${iv.toString('hex')}`

}

const verify = (token, secret) => {

	
	const pass = crypto.scryptSync(secret, 'salt', 32)
	const [tokenData, ivHex] = token.split('.')
	const iv = Buffer.from(ivHex, 'hex')

	const decipher = crypto.createDecipheriv('aes-256-cbc',
	pass, iv)
	
	let decryptedData = decipher.update(tokenData,
	'hex',
	'utf-8')
	decryptedData += decipher.final('utf-8')

	return JSON.parse(decryptedData)
}


module.exports = {
	sign,
	verify
}
