const Joi = require('joi');


// Define a schema for Facebook URL validation
const facebookUrlSchema = Joi.object({
    url: Joi.string()
        .pattern(
            /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9(\.\?)?]+/
        )
        .required()
        .messages({
            'string.pattern.base': 'The URL must be a valid Facebook URL (e.g., https://facebook.com/username).',
            'string.empty': 'The URL cannot be empty.',
            'any.required': 'The URL is required.',
        }),
});

// Function to validate the Facebook URL request body
function validateFacebookUrlRequest(data) {
    return facebookUrlSchema.validate(data, { abortEarly: false }); // Return all errors if there are multiple
}


module.exports = validateFacebookUrlRequest;