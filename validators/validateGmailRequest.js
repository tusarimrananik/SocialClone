const Joi = require('joi');

// Define a schema for Gmail validation
const gmailSchema = Joi.object({
    gmail: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'The Gmail address is not valid. Please provide a valid Gmail address.',
            'string.empty': 'The Gmail address cannot be empty.',
            'any.required': 'The Gmail address is required.',
        }),
});

// Function to validate the Gmail request body
function validateGmailRequest(data) {
    return gmailSchema.validate(data, { abortEarly: false }); // Return all errors if there are multiple
}


module.exports = validateGmailRequest;
