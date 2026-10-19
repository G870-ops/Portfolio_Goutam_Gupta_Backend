import Skill from '../models/Skill.js';

/**
 * @desc   Fetch all skills (grouped by category or flat list)
 * @route  GET /api/skills
 * @access Public
 */
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, proficiency: -1 });

    // Also provide structured grouped data for easy frontend rendering
    const grouped = skills.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: skills.length,
      grouped,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add new skill
 * @route  POST /api/skills
 * @access Private/Admin
 */
export const createSkill = async (req, res, next) => {
  try {
    const { category, name, proficiency, icon } = req.body;
    const skill = await Skill.create({
      category,
      name,
      proficiency: Number(proficiency) || 80,
      icon: icon || 'Code',
    });

    res.status(201).json({
      success: true,
      message: 'Skill registered successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing skill
 * @route  PUT /api/skills/:id
 * @access Private/Admin
 */
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const { category, name, proficiency, icon } = req.body;
    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        category: category || skill.category,
        name: name || skill.name,
        proficiency: proficiency !== undefined ? Number(proficiency) : skill.proficiency,
        icon: icon || skill.icon,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a skill
 * @route  DELETE /api/skills/:id
 * @access Private/Admin
 */
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    await skill.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
