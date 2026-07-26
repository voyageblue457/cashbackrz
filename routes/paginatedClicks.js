// Paginated click function for /:adminId/:posterId route
export const click = async (req, res) => {
  const { adminId, posterId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const query = { adminId: adminId, posterId: posterId };
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { click: { $regex: filter, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    const total = await Click.countDocuments(query);
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
    console.error('Error fetching clicks:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Paginated click_for_admin function for /:adminId/ route
export const click_for_admin = async (req, res) => {
  const { adminId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const query = { adminId: adminId };
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { click: { $regex: filter, $options: 'i' } },
        { posterId: { $regex: filter, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    const total = await Click.countDocuments(query);
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
    console.error('Error fetching admin clicks:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
