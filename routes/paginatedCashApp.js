// Paginated get_deyails_cashapp function - REPLACE in routehandler.js
export const get_deyails_cashapp = async (req, res) => {
  const { anyid } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    let query = { posterId: anyid };
    if (filter) {
      query.$or = [
        { contact: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } },
        { site: { $regex: filter, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    const total = await Cash.countDocuments(query);
    const cashapp = await Cash.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      data: cashapp,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error('Error fetching cash app data:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
