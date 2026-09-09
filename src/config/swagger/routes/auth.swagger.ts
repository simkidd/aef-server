export const authSwaggerPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User Login',
      description: 'Authenticates user with email & password, returns JWT token pair and role permissions.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'admin@adelefoundation.org' },
                password: { type: 'string', example: 'Adele@2026' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Login successful' },
        401: { description: 'Invalid email or password' },
      },
    },
  },
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register Beneficiary',
      description: 'Creates a candidate account and beneficiary profile, dispatches welcome email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'firstName', 'lastName', 'gender', 'phone'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                middleName: { type: 'string' },
                gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                dateOfBirth: { type: 'string', format: 'date' },
                phone: { type: 'string' },
                alternatePhone: { type: 'string' },
                address: { type: 'string' },
                stateOfOrigin: { type: 'string' },
                lgaOfOrigin: { type: 'string' },
                highestEducation: { type: 'string' },
                employmentStatus: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Account registered successfully' },
        409: { description: 'Email already exists' },
      },
    },
  },
  '/auth/send-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Request OTP Verification Code',
      description: 'Generates a 6-digit numeric OTP and dispatches via Brevo email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email' },
                purpose: { type: 'string', enum: ['LOGIN', 'VERIFICATION', 'PASSWORD_RESET'], default: 'VERIFICATION' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'OTP dispatched successfully' },
      },
    },
  },
  '/auth/verify-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Verify OTP Code',
      description: 'Validates submitted OTP. If purpose is LOGIN, returns full JWT token pair and user profile.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'otp'],
              properties: {
                email: { type: 'string', format: 'email' },
                otp: { type: 'string', example: '123456' },
                purpose: { type: 'string', enum: ['LOGIN', 'VERIFICATION', 'PASSWORD_RESET'], default: 'VERIFICATION' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'OTP verified successfully' },
        400: { description: 'Invalid or expired OTP code' },
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh Access Token',
      description: 'Rotates refresh token and returns a new access & refresh token pair.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Token refreshed' },
        401: { description: 'Invalid or revoked refresh token' },
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Revoke Session and Logout',
      description: 'Revokes active session tokens in MongoDB and terminates session.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Logged out successfully' },
      },
    },
  },
  '/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get Current Authenticated User',
      security: [{ BearerAuth: [] }],
      responses: {
        200: { description: 'User profile with active roles, permissions, and scopes' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/auth/profile': {
    put: {
      tags: ['Auth'],
      summary: 'Update Current User Contact & Profile',
      description: 'Updates editable contact fields (phone, alternatePhone, address, stateOfResidence, lgaOfResidence, emergencyContact).',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                phone: { type: 'string' },
                alternatePhone: { type: 'string' },
                address: { type: 'string' },
                stateOfResidence: { type: 'string' },
                lgaOfResidence: { type: 'string' },
                emergencyContact: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    relationship: { type: 'string' },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Profile updated successfully' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/auth/change-password': {
    put: {
      tags: ['Auth'],
      summary: 'Change User Password',
      description: 'Validates currentPassword and updates to newPassword with bcrypt hashing.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string' },
                newPassword: { type: 'string', minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Password changed successfully' },
        400: { description: 'Incorrect current password or validation error' },
        401: { description: 'Unauthorized' },
      },
    },
  },
};
