// Updated click and click_for_admin functions with pagination support
// Add these to replace the existing functions in routehandler.js

export const click = async (req, res) => {
  const { adminId, posterId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || "";
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    // Build query
    const query = { adminId: adminId, posterId: posterId };

    // Add filter if provided
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { click: { $regex: filter, $options: 'i' } },
      ];
    }

    // Build sort
    let sort = { createdAt: -1 }; // default sort
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => {
        sort[s.id] = s.desc ? -1 : 1;
      });
    }

    // Get total count
    const total = await Click.countDocuments(query);

    // Get paginated data
    const clicks = await Click.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      data: clicks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error("Error fetching clicks:", e);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const click_for_admin = async (req, res) => {
  const { adminId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || "";
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    // Build query
    const query = { adminId: adminId };

    // Add filter if provided
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { click: { $regex: filter, $options: 'i' } },
        { posterId: { $regex: filter, $options: 'i' } },
      ];
    }

    // Build sort
    let sort = { createdAt: -1 }; // default sort
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => {
        sort[s.id] = s.desc ? -1 : 1;
      });
    }

    // Get total count
    const total = await Click.countDocuments(query);

    // Get paginated data
    const clicks = await Click.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      data: clicks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error("Error fetching admin clicks:", e);
    return res.status(500).json({ error: 'Server error' });
  }
};
