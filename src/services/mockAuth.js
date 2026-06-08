export const mockLogin = async (email, password) => {
  await new Promise(r => setTimeout(r, 1500));
  if (email === 'test@protiker.com' && password === 'test123') {
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-123',
        sessionToken: crypto.randomUUID(),
        role: 'citizen',
        name: 'রফিকুল ইসলাম',
        email: 'test@protiker.com',
        preferredLanguage: 'bn',
      },
    };
  }
  throw {
    response: {
      data: {
        success: false,
        message: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
      },
    },
  };
};

export const mockSignup = async (formData) => {
  await new Promise(r => setTimeout(r, 2000));
  if (formData.email === 'existing@protiker.com') {
    throw {
      response: {
        data: {
          success: false,
          message: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত হচ্ছে।',
        },
      },
    };
  }
  return {
    success: true,
    data: {
      token: 'mock-jwt-token-456',
      sessionToken: crypto.randomUUID(),
      role: formData.role,
      name: formData.name,
      email: formData.email,
      preferredLanguage: formData.preferredLanguage,
    },
  };
};
