import Profile from '../models/Profile.js';

const defaultProfile = {
  name: 'Goutam Gupta',
  bio: 'Full-Stack MERN Architect & Android Developer with deep expertise in reactive frontends, asynchronous Node.js microservices, distributed MongoDB pipelines, and mission-critical edge AI applications.',
  email: 'goutamgupta605@gmail.com',
  phone: '+91 8343957187',
  github: 'https://github.com/G870-ops',
  linkedin: 'https://www.linkedin.com/in/goutam-gupta',
  resumeEmail: 'goutamgupta605@gmail.com',
  profileImg: '/profile.jpg',
};

/**
 * @desc   Get public profile information
 * @route  GET /api/profile
 * @access Public
 */
export const getProfile = async (req, res, next) => {
  try {
    let profile = null;
    try {
      profile = await Profile.findOne().sort({ updatedAt: -1 });
    } catch (err) {
      console.warn('[PROFILE] DB query failed, returning fallback default:', err.message);
    }

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: defaultProfile,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update profile information
 * @route  PUT /api/profile
 * @access Private/Admin
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, email, phone, github, linkedin, resumeEmail, profileImg } = req.body;

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        name: name || defaultProfile.name,
        bio: bio || defaultProfile.bio,
        email: email || defaultProfile.email,
        phone: phone || defaultProfile.phone,
        github: github || defaultProfile.github,
        linkedin: linkedin || defaultProfile.linkedin,
        resumeEmail: resumeEmail || defaultProfile.resumeEmail,
        profileImg: profileImg || defaultProfile.profileImg,
      });
    } else {
      profile.name = name !== undefined ? name : profile.name;
      profile.bio = bio !== undefined ? bio : profile.bio;
      profile.email = email !== undefined ? email : profile.email;
      profile.phone = phone !== undefined ? phone : profile.phone;
      profile.github = github !== undefined ? github : profile.github;
      profile.linkedin = linkedin !== undefined ? linkedin : profile.linkedin;
      profile.resumeEmail = resumeEmail !== undefined ? resumeEmail : profile.resumeEmail;
      profile.profileImg = profileImg !== undefined ? profileImg : profile.profileImg;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile successfully updated across all clients and MongoDB!',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
