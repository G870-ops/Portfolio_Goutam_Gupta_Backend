import Project from '../models/Project.js';

/**
 * @desc   Fetch all projects
 * @route  GET /api/projects
 * @access Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Fetch single project by ID
 * @route  GET /api/projects/:id
 * @access Public
 */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found with the requested ID',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new project
 * @route  POST /api/projects
 * @access Private/Admin
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      techStack,
      liveUrl,
      githubUrl,
      apkUrl,
      imageUrl,
      featured,
      category,
      telemetryInsight,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack)
        ? techStack
        : techStack.split(',').map((item) => item.trim()),
      liveUrl,
      githubUrl,
      apkUrl,
      imageUrl,
      featured: Boolean(featured),
      category: category || 'Full Stack',
      telemetryInsight:
        telemetryInsight || '⚡ Real-time V8 Event Loop Pipeline',
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing project
 * @route  PUT /api/projects/:id
 * @access Private/Admin
 */
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (req.body.techStack && typeof req.body.techStack === 'string') {
      req.body.techStack = req.body.techStack.split(',').map((t) => t.trim());
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete project
 * @route  DELETE /api/projects/:id
 * @access Private/Admin
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project removed successfully from database',
    });
  } catch (error) {
    next(error);
  }
};
