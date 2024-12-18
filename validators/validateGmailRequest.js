const Joi = require('joi');

// Define a schema for Gmail validation
const gmailSchema = Joi.object({
    gmail: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/) // Restrict to Gmail domain
        .required()
        .messages({
            'string.email': 'The email address is not valid. Please provide a valid Gmail address.',
            'string.pattern.base': 'Only Gmail addresses (e.g., user@gmail.com) are allowed.',
            'string.empty': 'The Gmail address cannot be empty.',
            'any.required': 'The Gmail address is required.',
        }),
});

// Function to validate the Gmail request body
function validateGmailRequest(data) {
    return gmailSchema.validate(data, { abortEarly: false }); // Return all errors if there are multiple
}


module.exports = validateGmailRequest;
