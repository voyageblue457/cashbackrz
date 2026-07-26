// Paginated all_poster function - REPLACE in routehandler.js
export const all_poster = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const user = await User.findOne({ _id: id });

    let query = { root: id };
    if (filter) {
      query.$or = [
        { username: { $regex: filter, $options: 'i' } },
        { posterId: { $regex: filter, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    const total = await Poster.countDocuments(query);
    const posters = await Poster.find(query)
      .select('username password links posterId createdAt')
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      posters,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error('Error fetching posters:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
