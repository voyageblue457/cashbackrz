// Updated link_details function with pagination support
export const link_details = async (req, res) => {
  const { id, admin } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const sites = await Site.find();

    if (admin == 1) {
      const posters = await Poster.find({ root: id });
      const posterIds = posters.map((p) => p._id);

      // Build query
      let query = { root: { $in: posterIds } };
      if (filter) {
        query.$or = [
          { linkName: { $regex: filter, $options: 'i' } },
          { targetUrl: { $regex: filter, $options: 'i' } },
        ];
      }

      // Build sort
      let sort = { createdAt: -1 };
      if (sortBy.length > 0) {
        sort = {};
        sortBy.forEach(s => {
          sort[s.id] = s.desc ? -1 : 1;
        });
      }

      // Get total count
      const total = await Link.countDocuments(query);

      // Get paginated data
      const links = await Link.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.status(200).json({
        data: links,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        sites: sites,
      });
    } else if (admin == 0) {
      const sites = await Site.find();
      const siteNames = sites.map((s) => s.name);

      // Build query for link names
      let query = { linkName: { $in: siteNames } };
      if (filter) {
        query.$or = [
          { linkName: { $regex: filter, $options: 'i' } },
        ];
      }

      // Build sort
      let sort = { createdAt: -1 };
      if (sortBy.length > 0) {
        sort = {};
        sortBy.forEach(s => {
          sort[s.id] = s.desc ? -1 : 1;
        });
      }

      // Get total count
      const total = await Link.countDocuments(query);

      // Get paginated data
      const links = await Link.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      return res.status(200).json({
        data: links,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        sites: siteNames,
      });
    }
  } catch (e) {
    console.error('Error in link_details:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
